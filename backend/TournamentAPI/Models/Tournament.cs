namespace TournamentAPI.Models
{
    public class Tournament
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Game { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int CreatedByUserId { get; set; }
        public User CreatedBy { get; set; } = null!;

        public List<TournamentPlayer> Players { get; set; } = new();
        public List<Match> Matches { get; set; } = new();
        public List<Team> Teams { get; set; } = new();
    }
}
