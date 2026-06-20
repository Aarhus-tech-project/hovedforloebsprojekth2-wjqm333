using Microsoft.AspNetCore.Mvc;
using TournamentAPI.Data;
using TournamentAPI.Models;
using System.Security.Cryptography;
using System.Text;

namespace TournamentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            // brugernavn skal være unikt
            if (_context.Users.Any(u => u.Username == req.Username))
                return BadRequest("Brugernavnet er allerede taget.");

            var user = new User
            {
                Username     = req.Username,
                Email        = req.Email,
                PasswordHash = HashPassword(req.Password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { user.Id, user.Username, user.Email });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            var user = _context.Users
                .FirstOrDefault(u => u.Username == req.Username);

            // hashes passwordet og sammenligner med det gemte
            if (user == null || user.PasswordHash != HashPassword(req.Password))
                return Unauthorized("Forkert brugernavn eller adgangskode.");

            return Ok(new { user.Id, user.Username, message = "Login OK" });
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users
                .Select(u => new { u.Id, u.Username, u.Email })
                .ToList();
            return Ok(users);
        }

        // SHA256 så vi ikke gemmer passwords i klartekst
        private static string HashPassword(string password)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }
    }

    public record RegisterRequest(string Username, string Email, string Password);
    public record LoginRequest(string Username, string Password);
}
