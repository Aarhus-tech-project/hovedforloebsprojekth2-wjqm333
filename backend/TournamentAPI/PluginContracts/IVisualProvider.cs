namespace TournamentAPI.PluginContracts;

/// <summary>
/// Contract for visual‑information providers.
/// Implementations can be loaded from external DLLs.
/// </summary>
public interface IVisualProvider
{
    /// <summary>
    /// Returns visual information for the specified match.
    /// </summary>
    VisualInfoDto GetVisualInfo(int matchId);
}

public class VisualInfoDto
{
    public int MatchId { get; set; }
    public System.Collections.Generic.Dictionary<string, object> Data { get; set; } = new();
}
