using Application;
using Serilog;
using WebAPI;
using WebAPI.Extensions;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddWebApiServices(builder.Configuration);
    builder.Services.AddApplicationServices(builder.Configuration);

    var app = builder.Build();

    app.UseCors();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapEndpoints();

    await app.InitializeDatabase();
    
    Log.Information("Application initialized successfully");
    
    app.Run();
}
catch (Exception e)
{
    Log.Fatal(e, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program
{
    public static readonly Guid InstanceId = Guid.NewGuid();
}