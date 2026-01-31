using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MiembroDirectorio>>> GetDirectorio()
        {
            return await _context.Directorio.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<MiembroDirectorio>> PostMiembro([FromForm] MiembroDto dto)
        {
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

        [HttpDelete("{id}")]
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
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imagen.FileName);
            using (var stream = new FileStream(Path.Combine(folderPath, fileName), FileMode.Create))
            {
                await imagen.CopyToAsync(stream);
            }
            return $"/uploads/{fileName}";
        }
    }

    public class MiembroDto
    {
        public string Nombre { get; set; }
        public string Cargo { get; set; }
        public string Descripcion { get; set; }
        public string Categoria { get; set; }
        public IFormFile? Imagen { get; set; }
    }
}