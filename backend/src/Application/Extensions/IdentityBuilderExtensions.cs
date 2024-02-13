using Application.Infrastructure.Identity;
using Application.Infrastructure.Persistence;
using Application.Infrastructure.Persistence.Interfaces;
using AspNetCore.Identity.MongoDbCore;
using AspNetCore.Identity.MongoDbCore.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using MongoDB.Bson;
using MongoDbGenericRepository;

namespace Application.Extensions;

public static class IdentityBuilderExtensions
{
    public static IdentityBuilder AddMongoDbStores(this IdentityBuilder builder)
    {
        builder.Services.TryAddSingleton<IMongoDbContext>(x =>
        {
            var appDbContext = x.GetRequiredService<IAppDbContext>();
            return new CustomMongoDbContext(appDbContext.AppDb);
        });

        builder.Services.TryAddSingleton<IMongoRepository>(x =>
        {
            var mongoDbContext = x.GetRequiredService<IMongoDbContext>();
            return new MongoRepository(mongoDbContext);
        });

        builder.Services.TryAddScoped<IUserStore<ApplicationUser>>(provider =>
            new MongoUserStore<ApplicationUser, Role, IMongoDbContext, ObjectId>(
                provider.GetRequiredService<IMongoDbContext>()));
        builder.Services.TryAddScoped<IRoleStore<Role>>(provider =>
            new MongoRoleStore<Role, IMongoDbContext, ObjectId>(
                provider.GetRequiredService<IMongoDbContext>()));

        return builder;
    }
}