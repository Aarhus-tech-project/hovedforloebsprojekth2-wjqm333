using Microsoft.AspNetCore.Mvc;
using TournamentAPI.PluginContracts;

namespace TournamentAPI.Controllers;

[ApiController]
[Route("api/visual")]
public class VisualController : ControllerBase
{
    private readonly IEnumerable<IVisualProvider> _providers;

    public VisualController(IEnumerable<IVisualProvider> providers)
    {
        _providers = providers;
    }

    /// <summary>
    /// Returns combined visual information for a given match.
    /// </summary>
    [HttpGet("match/{matchId}")]
    public IActionResult GetVisualForMatch(int matchId)
    {
        var results = _providers.Select(p => p.GetVisualInfo(matchId)).ToList();
        return Ok(results);
    }
}
