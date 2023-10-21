using System.Reflection;
using AppAny.HotChocolate.FluentValidation;
using Application.Entities;
using Application.Features.Auth;
using Application.Options;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using MongoDbGenericRepository;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        var mongoDbOptions = configuration
            .GetRequiredSection(MongoDBOptions.SectionName)
            .Get<MongoDBOptions>();

        if (mongoDbOptions is null)
        {
            throw new InvalidOperationException("Failed to obtain MongoDB options from configuration.");
        }

        services.AddMongoDb(mongoDbOptions, out var mongoDbContext);

        var identityOptions = configuration
            .GetRequiredSection(IdentityOptions.SectionName)
            .Get<IdentityOptions>();

        if (identityOptions is null)
        {
            throw new InvalidOperationException("Failed to obtain identity options from configuration.");
        }

        services.AddIdentityCore<ApplicationUser>(config =>
            {
                config.User.RequireUniqueEmail = identityOptions.RequireUniqueEmail;
                config.Password.RequiredLength = identityOptions.RequiredPasswordLength;
            })
            .AddRoles<Role>()
            .AddMongoDbStores<IMongoDbContext>(mongoDbContext);

        services.AddGraphQLServer()
            .AddFluentValidation()
            .AddQueryType<Query>()
            .AddMutationType<RegisterUserMutation>()
            .AddMutationConventions();

        return services;
    }

    private static IServiceCollection AddMongoDb(this IServiceCollection services, MongoDBOptions options,
        out IMongoDbContext mongoDbContext)
    {
        var client = new MongoClient(options.ConnectionString);
        mongoDbContext = new MongoDbContext(client, options.DatabaseName);

        services.AddSingleton(mongoDbContext);

        return services;
    }
}