using Microsoft.EntityFrameworkCore;
using TournamentAPI.Models;

namespace TournamentAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<TournamentPlayer> TournamentPlayers { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamPlayer> TeamPlayers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // brugernavn skal være unikt
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Tournament>()
                .HasOne(t => t.CreatedBy)
                .WithMany(u => u.Tournaments)
                .HasForeignKey(t => t.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TournamentPlayer>()
                .HasOne(tp => tp.Tournament)
                .WithMany(t => t.Players)
                .HasForeignKey(tp => tp.TournamentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TournamentPlayer>()
                .HasOne(tp => tp.User)
                .WithMany(u => u.TournamentPlayers)
                .HasForeignKey(tp => tp.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Player1)
                .WithMany()
                .HasForeignKey(m => m.Player1Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Player2)
                .WithMany()
                .HasForeignKey(m => m.Player2Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.Winner)
                .WithMany()
                .HasForeignKey(m => m.WinnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // når en turnering slettes, slettes dens kampe også
            modelBuilder.Entity<Match>()
                .HasOne(m => m.Tournament)
                .WithMany(t => t.Matches)
                .HasForeignKey(m => m.TournamentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
