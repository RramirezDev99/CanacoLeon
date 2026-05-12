using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Server.Data;
using Server.Models;
using Server.DTOs;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/auth/login
        // Valida el email/contraseña y, si son correctos, devuelve un token JWT.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            // 1) Buscar el usuario por email
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == login.Email);

            // NOTA: damos el mismo mensaje genérico aunque no exista el usuario.
            // Así no le decimos al atacante "este correo sí existe, solo te falta la pass".
            if (usuario == null)
            {
                return Unauthorized(new { error = "Credenciales inválidas." });
            }

            // 2) Verificar contraseña con el helper de hashing (PBKDF2)
            if (!PasswordHelper.Verify(login.Password, usuario.PasswordHash))
            {
                return Unauthorized(new { error = "Credenciales inválidas." });
            }

            // 3) Generar el token JWT que el frontend usará en cabeceras Authorization
            var token = GenerarToken(usuario);
            return Ok(new { token });
        }

        // POST: api/auth/cambiar-password
        // Permite al admin cambiar su propia contraseña. Requiere estar logueado.
        [HttpPost("cambiar-password")]
        [Authorize]
        public async Task<IActionResult> CambiarPassword([FromBody] CambiarPasswordDto dto)
        {
            // El "id" lo metimos en los claims del token al hacer login (ver GenerarToken)
            var idClaim = User.FindFirst("id")?.Value;
            if (!int.TryParse(idClaim, out int userId))
                return Unauthorized();

            var usuario = await _context.Usuarios.FindAsync(userId);
            if (usuario == null) return NotFound();

            // Pedimos la contraseña actual para que un token robado no baste para cambiarla
            if (!PasswordHelper.Verify(dto.PasswordActual, usuario.PasswordHash))
                return BadRequest(new { error = "La contraseña actual es incorrecta." });

            if (string.IsNullOrWhiteSpace(dto.PasswordNueva) || dto.PasswordNueva.Length < 8)
                return BadRequest(new { error = "La nueva contraseña debe tener al menos 8 caracteres." });

            usuario.PasswordHash = PasswordHelper.Hash(dto.PasswordNueva);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Contraseña actualizada." });
        }

        private string GenerarToken(Usuario usuario)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", usuario.Id.ToString())
            };

            // Si llega aquí sin Jwt:Key configurado, queremos que falle fuerte
            // en vez de usar una clave hardcoded insegura.
            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Falta configuración Jwt:Key");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(4),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
