using System.Reflection;
using System.Text;
using Application.AuthRequirements;
using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Extensions;
using Application.Features.Auth;
using Application.Features.GeneralTest;
using Application.Features.GeneralTest.ResultsAnalysis;
using Application.Features.GeneralTest.ResultsAnalysis.Interfaces;
using Application.Features.GeneralTest.ResultsAnalysis.Strategies;
using Application.Features.Registration;
using Application.Features.User;
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
using RefreshTokenRequirement = Application.AuthRequirements.RefreshTokenRequirement;
using Void = Application.ScalarTypes.Void;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddJwtOptions(configuration, out var authJwtOptions, out _);
        services.Configure<AssetOptions>(configuration.GetRequiredSection(AssetOptions.SectionName));
        services.Configure<MongoDbOptions>(configuration.GetRequiredSection(MongoDbOptions.SectionName));
        services.Configure<AppDbCollectionNames>(configuration.GetRequiredSection(AppDbCollectionNames.SectionName));

        services.AddHttpContextAccessor();
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddGeneralTestProcessor();

        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IDatabaseInitializer, DatabaseInitializer>();

        services.AddSingleton(TimeProvider.System);
        services.AddSingleton<ITokenService, JwtTokenService>();
        services.AddSingleton<IUserRepository, UserRepository>();
        services.AddSingleton<ITestRepository, TestRepository>();
        services.AddSingleton<IAdviceListRepository, AdviceListRepository>();
        services.AddSingleton<IAppDbContext, AppDbContext>();

        services.AddIdentity(configuration);
        services.AddCors(configuration);
        services.AddAuthentication(authJwtOptions);
        services.AddAuthorization();
        services.AddHotChocolate();

        return services;
    }

    private static IServiceCollection AddIdentity(this IServiceCollection services, IConfiguration configuration)
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
            .AddMongoDbStores();

        return services;
    }

    private static IServiceCollection AddCors(this IServiceCollection services, IConfiguration configuration)
    {
        var corsOptions = configuration
            .GetRequiredSection(CorsOptions.SectionName)
            .Get<CorsOptions>();

        if (corsOptions is null)
        {
            throw new InvalidOperationException("Failed to obtain CORS options from configuration.");
        }

        services.AddCors(x =>
            x.AddDefaultPolicy(y =>
                y.WithOrigins(corsOptions.AllowedOrigins)
                    .WithMethods(corsOptions.AllowedMethods)
                    .AllowAnyHeader()
            )
        );

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

    private static IServiceCollection AddGeneralTestProcessor(this IServiceCollection services)
    {
        services.AddTransient<IPotentialProblemsDetection, PotentialCtsdDetection>();
        services.AddTransient<IPotentialProblemsDetection, PotentialMtDetection>();
        services.AddTransient<IPotentialProblemsDetection, PotentialPcsDetection>();
        services.AddTransient<IPotentialProblemsDetection, PotentialPtsdDetection>();
        services.AddTransient<IPotentialProblemsDetection, PotentialSsDetection>();

        services.AddTransient<IGeneralTestAnswersProcessor, GeneralTestAnswersProcessor>();

        return services;
    }

    private static IServiceCollection AddHotChocolate(this IServiceCollection services)
    {
        services.AddGraphQLServer()
            .AddAuthorization()
            .AddQueryType(x => x.Name(GraphQlTypes.Query))
            .AddTypeExtension<GeneralTestQuestionsQuery>()
            .AddTypeExtension<GeneralTestResultsQuery>()
            .AddTypeExtension<GeneralTestResultQuery>()
            .AddTypeExtension<IsEmailTakenQuery>()
            .AddTypeExtension<UserInfoQuery>()
            .AddMutationType(x => x.Name(GraphQlTypes.Mutation))
            .AddTypeExtension<RegisterUserMutation>()
            .AddTypeExtension<LoginMutation>()
            .AddTypeExtension<RefreshTokenMutation>()
            .AddTypeExtension<SubmitGeneralTestAnswersMutation>()
            .AddMutationConventions()
            .AddType<Void>()
            .AddType<RegistrationError>()
            .AddType<PropertyValidationError>()
            .AddFiltering()
            .AddSorting()
            .AddProjections();

        return services;
    }
}