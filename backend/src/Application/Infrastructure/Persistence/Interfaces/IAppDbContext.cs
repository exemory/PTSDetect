using Application.Documents;
using Application.Infrastructure.Identity;
using MongoDB.Driver;

namespace Application.Infrastructure.Persistence.Interfaces;

public interface IAppDbContext
{
    public IMongoDatabase AppDb { get; }

    public IMongoCollection<ApplicationUser> Users { get; }
    public IMongoCollection<T> Tests<T>();
    public IMongoCollection<Advice> Advice { get; set; }
}