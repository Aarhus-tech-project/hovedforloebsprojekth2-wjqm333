using System.Collections.Generic;

namespace TournamentAPI.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public int TournamentId { get; set; }
        public Tournament Tournament { get; set; } = null!;

        public List<TeamPlayer> Players { get; set; } = new();
    }
}
