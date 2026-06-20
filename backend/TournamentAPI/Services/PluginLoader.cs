using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TournamentAPI.PluginContracts;

namespace TournamentAPI.Services;

/// <summary>
/// Simple plugin loader that loads external DLLs and registers any IVisualProvider implementations.
/// </summary>
public class PluginLoader
{
    private readonly IConfiguration _configuration;
    private readonly IServiceCollection _services;
    private readonly List<IVisualProvider> _loaded = new();

    public PluginLoader(IConfiguration configuration, IServiceCollection services)
    {
        _configuration = configuration;
        _services = services;
    }

    /// <summary>
    /// Loads assemblies defined in the "VisualPlugins:Paths" configuration section.
    /// For each type implementing IVisualProvider, registers it as a singleton.
    /// </summary>
    public void LoadPlugins()
    {
        var paths = _configuration.GetSection("VisualPlugins:Paths").Get<string[]>() ?? Array.Empty<string>();
        foreach (var relPath in paths)
        {
            if (string.IsNullOrWhiteSpace(relPath)) continue;
            var fullPath = Path.GetFullPath(relPath);
            if (!File.Exists(fullPath))
            {
                Console.WriteLine($"[PluginLoader] DLL not found: {fullPath}");
                continue;
            }
            try
            {
                var asm = Assembly.LoadFrom(fullPath);
                var providerTypes = asm.GetTypes()
                                      .Where(t => typeof(IVisualProvider).IsAssignableFrom(t) && !t.IsAbstract && t.IsClass);
                foreach (var pt in providerTypes)
                {
                    // Register as singleton IVisualProvider -> concrete type
                    _services.AddSingleton(typeof(IVisualProvider), pt);
                    Console.WriteLine($"[PluginLoader] Registered visual provider: {pt.FullName} from {fullPath}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PluginLoader] Failed to load plugin {fullPath}: {ex.Message}");
            }
        }
    }

    /// <summary>
    /// Called after the application service provider is built. Allows providers to perform initialization.
    /// </summary>
    public void InitializePlugins(IServiceProvider provider)
    {
        foreach (var vp in provider.GetServices<IVisualProvider>())
        {
            // If a provider implements a custom initialization method, we could invoke it here.
            // For now we just ensure the instance is created.
            // No action needed.
        }
    }
}
