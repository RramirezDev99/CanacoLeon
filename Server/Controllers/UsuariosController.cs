using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
    /// <summary>
    /// Manejo de usuarios administradores. Todos los endpoints requieren
    /// estar logueado como admin — un admin puede crear o borrar otros admins.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsuariosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/usuarios — lista de admins (NUNCA devolvemos el hash)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> Get()
        {
            var usuarios = await _context.Usuarios
                .OrderBy(u => u.Id)
                .Select(u => new { u.Id, u.Nombre, u.Email })
                .ToListAsync();
            return Ok(usuarios);
        }

        // POST: api/usuarios — crea un nuevo admin
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CrearUsuarioDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nombre))
                return BadRequest(new { error = "El nombre es obligatorio." });
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest(new { error = "El email es obligatorio." });
            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 8)
                return BadRequest(new { error = "La contraseña debe tener al menos 8 caracteres." });

            // Email único
            var existe = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
            if (existe)
                return BadRequest(new { error = "Ya existe un usuario con ese email." });

            var nuevo = new Usuario
            {
                Nombre = dto.Nombre.Trim(),
                Email = dto.Email.Trim().ToLowerInvariant(),
                PasswordHash = PasswordHelper.Hash(dto.Password)
            };

            _context.Usuarios.Add(nuevo);
            await _context.SaveChangesAsync();

            // No devolvemos el hash
            return Ok(new { nuevo.Id, nuevo.Nombre, nuevo.Email });
        }

        // DELETE: api/usuarios/{id} — borra un admin
        // Bloqueamos borrar el último admin para no quedarnos sin acceso.
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();

            var total = await _context.Usuarios.CountAsync();
            if (total <= 1)
                return BadRequest(new { error = "No puedes borrar el último administrador." });

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Usuario eliminado." });
        }
    }

    public class CrearUsuarioDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
