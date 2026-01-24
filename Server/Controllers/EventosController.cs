using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EventosController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evento>>> Get()
        {
            return await _context.Eventos.OrderByDescending(e => e.Id).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Evento>> Post([FromForm] CrearEventoDto dto)
        {
            var nuevoEvento = new Evento
            {
                Titulo = dto.Titulo,
                Descripcion = dto.Descripcion,
                Fecha = dto.Fecha,
                Lugar = dto.Lugar,
                ImagenUrl = ""
            };

            if (dto.Imagen != null) nuevoEvento.ImagenUrl = await GuardarImagen(dto.Imagen);

            _context.Eventos.Add(nuevoEvento);
            await _context.SaveChangesAsync();
            return Ok(nuevoEvento);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromForm] CrearEventoDto dto)
        {
            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null) return NotFound();

            evento.Titulo = dto.Titulo;
            evento.Descripcion = dto.Descripcion;
            evento.Fecha = dto.Fecha;
            evento.Lugar = dto.Lugar;

            if (dto.Imagen != null) evento.ImagenUrl = await GuardarImagen(dto.Imagen);

            await _context.SaveChangesAsync();
            return Ok(evento);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null) return NotFound();

            _context.Eventos.Remove(evento);
            await _context.SaveChangesAsync();
            return Ok("Eliminado");
        }

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