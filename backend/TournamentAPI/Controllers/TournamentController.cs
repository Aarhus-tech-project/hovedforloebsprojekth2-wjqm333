using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TournamentAPI.Data;
using TournamentAPI.Models;

namespace TournamentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TournamentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TournamentController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var tournaments = _context.Tournaments
                .Include(t => t.CreatedBy)
                .Include(t => t.Players).ThenInclude(tp => tp.User)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Game,
                    t.CreatedAt,
                    t.CreatedByUserId,
                    CreatedBy   = t.CreatedBy.Username,
                    PlayerCount = t.Players.Count,
                    Players = t.Players.Select(tp => new
                    {
                        tp.User.Id,
                        tp.User.Username,
                        tp.JoinedAt
                    })
                })
                .ToList();

            return Ok(tournaments);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var tournament = _context.Tournaments
                .Include(t => t.CreatedBy)
                .Include(t => t.Players).ThenInclude(tp => tp.User)
                .Include(t => t.Matches).ThenInclude(m => m.Player1)
                .Include(t => t.Matches).ThenInclude(m => m.Player2)
                .Include(t => t.Matches).ThenInclude(m => m.Winner)
                .FirstOrDefault(t => t.Id == id);

            if (tournament == null) return NotFound();

            return Ok(new
            {
                tournament.Id,
                tournament.Name,
                tournament.Game,
                tournament.CreatedAt,
                tournament.CreatedByUserId,
                CreatedBy = tournament.CreatedBy.Username,
                Players = tournament.Players.Select(tp => new
                {
                    tp.User.Id,
                    tp.User.Username
                }),
                Matches = tournament.Matches.Select(m => new
                {
                    m.Id,
                    Player1 = m.Player1.Username,
                    Player2 = m.Player2.Username,
                    // hvis ingen vinder endnu vises denne tekst
                    Winner  = m.Winner != null ? m.Winner.Username : "Ikke spillet endnu",
                    m.PlayedAt
                })
            });
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateTournamentRequest req)
        {
            var user = _context.Users.Find(req.CreatedByUserId);
            if (user == null) return BadRequest("Bruger ikke fundet.");

            var tournament = new Tournament
            {
                Name            = req.Name,
                Game            = req.Game,
                CreatedByUserId = req.CreatedByUserId
            };

            _context.Tournaments.Add(tournament);
            _context.SaveChanges();

            return Ok(new { tournament.Id, tournament.Name, tournament.Game });
        }

        [HttpPost("{id}/join")]
        public IActionResult Join(int id, [FromBody] JoinRequest req)
        {
            var tournament = _context.Tournaments.Find(id);
            if (tournament == null) return NotFound("Turnering ikke fundet.");

            var user = _context.Users.Find(req.UserId);
            if (user == null) return BadRequest("Bruger ikke fundet.");

            // tjekker om spilleren allerede er tilmeldt
            bool already = _context.TournamentPlayers
                .Any(tp => tp.TournamentId == id && tp.UserId == req.UserId);
            if (already) return BadRequest("Spilleren er allerede tilmeldt.");

            _context.TournamentPlayers.Add(new TournamentPlayer
            {
                TournamentId = id,
                UserId       = req.UserId
            });
            _context.SaveChanges();

            return Ok(new { message = $"{user.Username} tilmeldt {tournament.Name}" });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var tournament = _context.Tournaments.Find(id);
            if (tournament == null) return NotFound();

            _context.Tournaments.Remove(tournament);
            _context.SaveChanges();
            return NoContent();
        }
    }

    public record CreateTournamentRequest(string Name, string Game, int CreatedByUserId);
    public record JoinRequest(int UserId);
}
