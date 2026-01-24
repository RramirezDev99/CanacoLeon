using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NoticiasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public NoticiasController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Noticia>>> Get()
        {
            // Ordenamos por ID descendente para ver las nuevas primero en el panel
            return await _context.Noticias.OrderByDescending(n => n.Id).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Noticia>> Post([FromForm] CrearNoticiaDto dto)
        {
            var nuevaNoticia = new Noticia
            {
                Titulo = dto.Titulo,
                Resumen = dto.Resumen,
                FechaPublicacion = dto.FechaPublicacion,
                ImagenUrl = ""
            };

            if (dto.Imagen != null)
            {
                nuevaNoticia.ImagenUrl = await GuardarImagen(dto.Imagen);
            }

            _context.Noticias.Add(nuevaNoticia);
            await _context.SaveChangesAsync();
            return Ok(nuevaNoticia);
        }

        // --- EDITAR (PUT) ---
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromForm] CrearNoticiaDto dto)
        {
            var noticia = await _context.Noticias.FindAsync(id);
            if (noticia == null) return NotFound("Noticia no encontrada");

            // Actualizamos datos
            noticia.Titulo = dto.Titulo;
            noticia.Resumen = dto.Resumen;
            noticia.FechaPublicacion = dto.FechaPublicacion;

            // Si mandaron nueva imagen, la reemplazamos. Si no, dejamos la vieja.
            if (dto.Imagen != null)
            {
                noticia.ImagenUrl = await GuardarImagen(dto.Imagen);
            }

            await _context.SaveChangesAsync();
            return Ok(noticia);
        }

        // --- BORRAR (DELETE) ---
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var noticia = await _context.Noticias.FindAsync(id);
            if (noticia == null) return NotFound();

            _context.Noticias.Remove(noticia);
            await _context.SaveChangesAsync();
            return Ok("Eliminado");
        }

        // Método auxiliar para no repetir código de imagen
        private async Task<string> GuardarImagen(IFormFile imagen)
        {
            string folderPath = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(imagen.FileName);
            string filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imagen.CopyToAsync(stream);
            }
            return $"/uploads/{fileName}";
        }
    }
}