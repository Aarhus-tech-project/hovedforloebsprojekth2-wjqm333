using Microsoft.AspNetCore.Mvc;
using TournamentAPI.Models;
using TournamentAPI.Data;

namespace TournamentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlayerController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetPlayers()
        {
            var players = _context.Players.ToList();
            return Ok(players);
        }

        [HttpPost]
        public IActionResult CreatePlayer(Player player)
        {
            _context.Players.Add(player);
            _context.SaveChanges();

            return Ok(player);
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePlayer(int id)
        {
            var player = _context.Players.FirstOrDefault(p => p.Id == id);

            if (player == null)
                return NotFound();

            _context.Players.Remove(player);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePlayer(int id, Player updatedPlayer)
        {
            var player = _context.Players.FirstOrDefault(p => p.Id == id);

            if (player == null)
                return NotFound();

            player.Name = updatedPlayer.Name;
            player.Score = updatedPlayer.Score;

            _context.SaveChanges();

            return NoContent();
        }
    }
}