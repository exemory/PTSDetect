using Application;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
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

    BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Standard));

    builder.Services.AddApplicationServices(builder.Configuration);
    builder.Services.AddWebApiServices(builder.Configuration);

    var app = builder.Build();

    app.UseCors();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapEndpoints();

    await app.InitializeDatabase();

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