using System.Reflection;
using System.Text;
using Application.AuthRequirements;
using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Features.Auth;
using Application.Infrastructure.Identity;
using Application.Infrastructure.Persistence;
using Application.Infrastructure.Persistence.Interfaces;
using Application.Infrastructure.Persistence.Repositories;
using Application.Options;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using MongoDbGenericRepository;
using RefreshTokenRequirement = Application.AuthRequirements.RefreshTokenRequirement;
using Void = Application.ScalarTypes.Void;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddJwtOptions(configuration, out var authJwtOptions, out _);

        services.AddHttpContextAccessor();
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddScoped<IIdentityService, IdentityService>();

        services.AddSingleton(TimeProvider.System);
        services.AddSingleton<ITokenService, JwtTokenService>();
        services.AddSingleton<IUserRepository, UserRepository>();

        services.AppDbContext(configuration, out var appDbContext);
        services.AddIdentity(configuration, appDbContext);
        services.AddAuthentication(authJwtOptions);
        services.AddAuthorization();
        services.AddHotChocolate();

        return services;
    }

    private static IServiceCollection AddIdentity(this IServiceCollection services, IConfiguration configuration,
        AppDbContext appDbContext)
    {
        var identityOptions = configuration
            .GetRequiredSection(IdentityOptions.SectionName)
            .Get<IdentityOptions>();

        if (identityOptions is null)
        {
            throw new InvalidOperationException("Failed to obtain identity options from configuration.");
        }

        services
            .AddIdentityCore<ApplicationUser>(config =>
            {
                config.User.RequireUniqueEmail = identityOptions.RequireUniqueEmail;
                config.Password.RequiredLength = identityOptions.RequiredPasswordLength;
            })
            .AddRoles<Role>()
            .AddMongoDbStores<IMongoDbContext>(new MongoDbContext(appDbContext.AppDb));

        return services;
    }

    private static IServiceCollection AddAuthentication(this IServiceCollection services, JwtOptions authJwtOptions)
    {
        services
            .AddAuthentication()
            .AddJwtBearer(x =>
            {
                x.TokenValidationParameters =
                    new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = authJwtOptions.Issuer,
                        ValidateAudience = true,
                        ValidAudience = authJwtOptions.Audience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authJwtOptions.Secret)),
                        ValidateLifetime = true,
                        ClockSkew = authJwtOptions.ClockSkew
                    };
            });

        return services;
    }

    private static IServiceCollection AddAuthorization(this IServiceCollection services)
    {
        services.AddSingleton<IAuthorizationHandler, RefreshTokenRequirementHandler>();

        services
            .AddAuthorizationBuilder()
            .AddPolicy(AuthPolicies.RefreshToken, y => { y.AddRequirements(new RefreshTokenRequirement()); });

        return services;
    }

    private static IServiceCollection AddJwtOptions(this IServiceCollection services, IConfiguration configuration,
        out JwtOptions authJwtOptions, out JwtOptions refreshJwtOptions)
    {
        authJwtOptions = GetBaseJwtOptions();
        configuration
            .GetRequiredSection(JwtOptions.AuthSectionName)
            .Bind(authJwtOptions);

        refreshJwtOptions = GetBaseJwtOptions();
        configuration
            .GetRequiredSection(JwtOptions.RefreshSectionName)
            .Bind(refreshJwtOptions);

        services.Configure<JwtOptions>(JwtOptions.Auth,
            configuration.GetRequiredSection(JwtOptions.SectionName));
        services.Configure<JwtOptions>(JwtOptions.Auth,
            configuration.GetRequiredSection(JwtOptions.AuthSectionName));

        services.Configure<JwtOptions>(JwtOptions.Refresh,
            configuration.GetRequiredSection(JwtOptions.SectionName));
        services.Configure<JwtOptions>(JwtOptions.Refresh,
            configuration.GetRequiredSection(JwtOptions.RefreshSectionName));

        return services;

        JwtOptions GetBaseJwtOptions()
        {
            var jwtOptions = configuration
                .GetRequiredSection(JwtOptions.SectionName)
                .Get<JwtOptions>();

            if (jwtOptions is null)
            {
                throw new InvalidOperationException("Failed to obtain JWT options from configuration.");
            }

            return jwtOptions;
        }
    }

    private static IServiceCollection AppDbContext(this IServiceCollection services, IConfiguration configuration,
        out AppDbContext appDbContext)
    {
        var mongoDbOptions = configuration
            .GetRequiredSection(MongoDbOptions.SectionName)
            .Get<MongoDbOptions>();

        if (mongoDbOptions is null)
        {
            throw new InvalidOperationException("Failed to obtain the MongoDB options from the configuration.");
        }

        var appDbCollectionNames = configuration
            .GetRequiredSection(AppDbCollectionNames.SectionName)
            .Get<AppDbCollectionNames>();

        if (appDbCollectionNames is null)
        {
            throw new InvalidOperationException(
                "Failed to obtain collections names of the application database from the configuration.");
        }

        var mongoClient = new MongoClient(mongoDbOptions.ConnectionString);
        appDbContext = new AppDbContext(mongoClient, mongoDbOptions.AppDatabaseName, appDbCollectionNames);

        services.AddSingleton<IAppDbContext>(appDbContext);

        return services;
    }

    private static IServiceCollection AddHotChocolate(this IServiceCollection services)
    {
        services.AddGraphQLServer()
            .AddAuthorization()
            .AddQueryType<Query>()
            .AddMutationType(x => x.Name(GraphQlTypes.Mutation))
            .AddTypeExtension<RegisterUserMutation>()
            .AddTypeExtension<LoginMutation>()
            .AddTypeExtension<RefreshTokenMutation>()
            .AddMutationConventions()
            .AddType<Void>()
            .AddType<RegistrationError>()
            .AddType<PropertyValidationError>();

        return services;
    }
}