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

    builder.Host.UseSerilog((context, configuration) =>
        configuration.ReadFrom.Configuration(context.Configuration)
    );

    builder.Services.AddApplicationServices(builder.Configuration);
    builder.Services.AddWebApiServices(builder.Configuration);

    var app = builder.Build();

    app.UseCors();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapEndpoints();

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