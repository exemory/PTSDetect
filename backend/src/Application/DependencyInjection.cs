using System.Reflection;
using System.Text;
using Application.AuthRequirements;
using Application.Common.Constants;
using Application.Common.Errors;
using Application.Common.Interfaces;
using Application.Common.Interfaces.Repositories;
using Application.Extensions;
using Application.Features.GeneralTest.ResultsAnalysis;
using Application.Features.GeneralTest.ResultsAnalysis.Interfaces;
using Application.Features.GeneralTest.ResultsAnalysis.Strategies;
using Application.Infrastructure.Email;
using Application.Infrastructure.FileStorage;
using Application.Infrastructure.Identity;
using Application.Infrastructure.Persistence;
using Application.Infrastructure.Persistence.Interfaces;
using Application.Infrastructure.Persistence.Repositories;
using Application.Infrastructure.User;
using Application.Options;
using FluentValidation;
using HotChocolate.Types;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using SendGrid.Extensions.DependencyInjection;
using RefreshTokenRequirement = Application.AuthRequirements.RefreshTokenRequirement;
using Void = Application.ScalarTypes.Void;
using IdentityOptions = Application.Options.IdentityOptions;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        ConfigureBsonGuidRepresentation();

        services.AddJwtOptions(configuration, out var authJwtOptions, out _);
        services.Configure<AssetOptions>(configuration.GetRequiredSection(AssetOptions.SectionName));
        services.Configure<MongoDbOptions>(configuration.GetRequiredSection(MongoDbOptions.SectionName));
        services.Configure<AppDbCollectionNames>(configuration.GetRequiredSection(AppDbCollectionNames.SectionName));
        services.Configure<EmailOptions>(configuration.GetRequiredSection(EmailOptions.SectionName));
        services.Configure<SendGridOptions>(configuration.GetRequiredSection(SendGridOptions.SectionName));
        services.Configure<FrontendOptions>(configuration.GetRequiredSection(FrontendOptions.SectionName));
        services.Configure<FileContainerNames>(configuration.GetRequiredSection(FileContainerNames.SectionName));
        services.Configure<AzureStorageOptions>(configuration.GetRequiredSection(AzureStorageOptions.SectionName));

        services.AddTransient<IMailService, SendGridMailService>();

        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddScoped<IIdentityService, IdentityService>();
        services.AddScoped<IDatabaseInitializer, DatabaseInitializer>();
        services.AddScoped<IUserService, UserService>();

        services.AddSingleton(TimeProvider.System);
        services.AddSingleton<ITokenService, JwtTokenService>();
        services.AddSingleton<IUserRepository, UserRepository>();
        services.AddSingleton<ITestRepository, TestRepository>();
        services.AddSingleton<IAdviceListRepository, AdviceListRepository>();
        services.AddSingleton<IAppDbContext, AppDbContext>();
        services.AddSingleton<IFileService, AzureBlobStorageService>();

        services.AddHttpContextAccessor();
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddGeneralTestProcessor();
        services.AddIdentity(configuration);
        services.AddCors(configuration);
        services.AddAuthentication(authJwtOptions);
        services.AddSendGrid(configuration);
        services.AddAuthorization();
        services.AddHotChocolate();
        services.AddAzureServices(configuration);

        return services;
    }

    private static void ConfigureBsonGuidRepresentation()
    {
#pragma warning disable CS0618 // Type or member is obsolete
        BsonDefaults.GuidRepresentationMode = GuidRepresentationMode.V3;
#pragma warning restore CS0618 // Type or member is obsolete
        BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));
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
            .AddIdentityCore<ApplicationUser>(x =>
            {
                x.User.RequireUniqueEmail = identityOptions.RequireUniqueEmail;
                x.Password.RequiredLength = identityOptions.RequiredPasswordLength;
                x.SignIn.RequireConfirmedEmail = true;
            })
            .AddRoles<Role>()
            .AddMongoDbStores()
            .AddDefaultTokenProviders();

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
                    .AllowCredentials()
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
        var gqlBuilder = services.AddGraphQLServer()
            .AddAuthorization()
            .AddQueryType(x => x.Name(GraphQlTypes.Query))
            .AddMutationType(x => x.Name(GraphQlTypes.Mutation))
            .AddMutationConventions()
            .AddType<Void>()
            .AddType<PropertyValidationError>()
            .AddFiltering()
            .AddSorting()
            .AddProjections()
            .AddInstrumentation();

        var executingAssembly = Assembly.GetExecutingAssembly();

        executingAssembly
            .GetTypes()
            .Where(x => x.GetCustomAttribute<ExtendObjectTypeAttribute>() is not null)
            .ToList()
            .ForEach(x => gqlBuilder.AddTypeExtension(x));

        var errorTypes = executingAssembly
            .GetTypes()
            .Where(x => x.Namespace == typeof(ValidationError).Namespace)
            .ToArray();

        gqlBuilder.AddTypes(errorTypes);

        return services;
    }

    private static IServiceCollection AddSendGrid(this IServiceCollection services, IConfiguration configuration)
    {
        var sendGridOptions = configuration
            .GetRequiredSection(SendGridOptions.SectionName)
            .Get<SendGridOptions>();

        if (sendGridOptions is null)
        {
            throw new InvalidOperationException("Failed to obtain SendGrid options from configuration.");
        }

        services.AddSendGrid(x => { x.ApiKey = sendGridOptions.ApiKey; });

        return services;
    }

    private static IServiceCollection AddAzureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var azureBlobStorageOptions = configuration
            .GetRequiredSection(AzureStorageOptions.SectionName)
            .Get<AzureStorageOptions>();

        if (azureBlobStorageOptions is null)
        {
            throw new InvalidOperationException("Failed to obtain AzureBlobStorageOptions options from configuration.");
        }

        services.AddAzureClients(x => { x.AddBlobServiceClient(azureBlobStorageOptions.ConnectionString); });

        return services;
    }
}