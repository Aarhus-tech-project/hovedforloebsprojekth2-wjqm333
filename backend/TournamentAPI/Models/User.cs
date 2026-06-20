namespace TournamentAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<Tournament> Tournaments { get; set; } = new();
        public List<TournamentPlayer> TournamentPlayers { get; set; } = new();
    }
}
