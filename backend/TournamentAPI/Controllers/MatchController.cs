using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TournamentAPI.Data;
using TournamentAPI.Models;

namespace TournamentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MatchController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateMatch([FromBody] CreateMatchRequest req)
        {
            var tournament = _context.Tournaments.Find(req.TournamentId);
            if (tournament == null) return BadRequest("Turnering ikke fundet.");

            // begge spillere skal være tilmeldt turneringen
            bool p1joined = _context.TournamentPlayers
                .Any(tp => tp.TournamentId == req.TournamentId && tp.UserId == req.Player1Id);
            bool p2joined = _context.TournamentPlayers
                .Any(tp => tp.TournamentId == req.TournamentId && tp.UserId == req.Player2Id);

            if (!p1joined || !p2joined)
                return BadRequest("Begge spillere skal være tilmeldt turneringen.");

            var match = new Match
            {
                TournamentId = req.TournamentId,
                Player1Id    = req.Player1Id,
                Player2Id    = req.Player2Id
            };

            _context.Matches.Add(match);
            _context.SaveChanges();

            return Ok(new { match.Id, message = "Kamp oprettet" });
        }

        [HttpPut("{id}/result")]
        public IActionResult SetResult(int id, [FromBody] ResultRequest req)
        {
            var match = _context.Matches.Find(id);
            if (match == null) return NotFound("Kamp ikke fundet.");

            // vinderen skal være en af de to spillere i kampen
            if (req.WinnerId != match.Player1Id && req.WinnerId != match.Player2Id)
                return BadRequest("Vinderen skal være Player1 eller Player2.");

            match.WinnerId = req.WinnerId;
            match.PlayedAt = DateTime.UtcNow;

            _context.SaveChanges();
            return Ok(new { message = "Resultat gemt" });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMatch(int id)
        {
            var match = _context.Matches.Find(id);
            if (match == null) return NotFound("Kamp ikke fundet.");

            _context.Matches.Remove(match);
            _context.SaveChanges();
            return NoContent();
        }

        [HttpGet("tournament/{tournamentId}")]
        public IActionResult GetByTournament(int tournamentId)
        {
            var matches = _context.Matches
                .Include(m => m.Player1)
                .Include(m => m.Player2)
                .Include(m => m.Winner)
                .Where(m => m.TournamentId == tournamentId)
                .Select(m => new
                {
                    m.Id,
                    Player1 = m.Player1.Username,
                    Player2 = m.Player2.Username,
                    Winner  = m.Winner != null ? m.Winner.Username : "Ikke spillet endnu",
                    m.PlayedAt
                })
                .ToList();

            return Ok(matches);
        }
    }

    public record CreateMatchRequest(int TournamentId, int Player1Id, int Player2Id);
    public record ResultRequest(int WinnerId);
}
