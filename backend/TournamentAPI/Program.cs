using Microsoft.EntityFrameworkCore;
using TournamentAPI.Data;
using TournamentAPI.PluginContracts;
using TournamentAPI.Services;
using Microsoft.Extensions.FileProviders;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IVisualProvider, DefaultVisualProvider>();

var visualPluginLoader = new PluginLoader(builder.Configuration, builder.Services);
visualPluginLoader.LoadPlugins();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null
        )
    ));

var app = builder.Build();

// server React frontend fra dist mappen
app.UseFileServer(new FileServerOptions {
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "frontend", "react-app", "dist")
    ),
    RequestPath = "",
    EnableDefaultFiles = true,
    EnableDirectoryBrowsing = false
});

// sender ikke-API requests til index.html så React routing virker
app.Use(async (context, next) => {
    if (!context.Request.Path.StartsWithSegments("/api") && !Path.HasExtension(context.Request.Path))
    {
        context.Request.Path = "/index.html";
    }
    await next();
});

app.UseFileServer(new FileServerOptions {
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "frontend", "react-app", "dist")
    ),
    RequestPath = "",
    EnableDefaultFiles = true
});

visualPluginLoader.InitializePlugins(app.Services);

// forbinder til databasen og kører migrations
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
        Console.WriteLine("Database forbundet og klar.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database ikke tilgængelig: {ex.Message}");
        Console.WriteLine("API starter alligevel - endpoints er klar.");
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
