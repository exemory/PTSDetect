namespace Application.Common.Interfaces;

public interface IDatabaseInitializer
{
    public Task InitializeDatabase(CancellationToken cancellationToken = default);
}