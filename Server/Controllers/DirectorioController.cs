using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorioController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public DirectorioController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // PÚBLICO
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MiembroDirectorio>>> GetDirectorio()
        {
            return await _context.Directorio.ToListAsync();
        }

        // ADMIN
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<MiembroDirectorio>> PostMiembro([FromForm] MiembroDto dto)
        {
            if (dto.Imagen != null)
            {
                var error = UploadHelper.ValidarImagen(dto.Imagen);
                if (error != null) return BadRequest(new { error });
            }

            var miembro = new MiembroDirectorio
            {
                Nombre = dto.Nombre,
                Cargo = dto.Cargo,
                Descripcion = dto.Descripcion,
                Categoria = dto.Categoria
            };

            if (dto.Imagen != null) miembro.ImagenUrl = await GuardarImagen(dto.Imagen);

            _context.Directorio.Add(miembro);
            await _context.SaveChangesAsync();

            return Ok(miembro);
        }

        // ADMIN
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteMiembro(int id)
        {
            var miembro = await _context.Directorio.FindAsync(id);
            if (miembro == null) return NotFound();

            _context.Directorio.Remove(miembro);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private async Task<string> GuardarImagen(IFormFile imagen)
        {
            var folderPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            var fileName = UploadHelper.NombreSeguro(imagen);
            using (var stream = new FileStream(Path.Combine(folderPath, fileName), FileMode.Create))
            {
                await imagen.CopyToAsync(stream);
            }
            return $"/uploads/{fileName}";
        }
    }

    public class MiembroDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Cargo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public IFormFile? Imagen { get; set; }
    }
}
