using Application;
using WebAPI;
using WebAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddWebApiServices(builder.Configuration);

var app = builder.Build();

app.MapHealthChecks();

app.UseAuthentication();
app.UseAuthorization();

app.MapEndpoints();

app.Run();