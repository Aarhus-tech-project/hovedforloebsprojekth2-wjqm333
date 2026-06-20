using TournamentAPI.PluginContracts;

namespace TournamentAPI.Services;

public class DefaultVisualProvider : IVisualProvider
{
    public VisualInfoDto GetVisualInfo(int matchId)
    {
        return new VisualInfoDto
        {
            MatchId = matchId,
            Data = new System.Collections.Generic.Dictionary<string, object>
            {
                { "Info", $"Default visual data for match {matchId}" },
                { "Timestamp", System.DateTime.UtcNow }
            }
        };
    }
}
