using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;
using Server.Services;

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

        // PÚBLICO
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evento>>> Get()
        {
            return await _context.Eventos.OrderByDescending(e => e.Id).ToListAsync();
        }

        // PÚBLICO: obtener un evento por ID (lo usa la página de detalle)
        [HttpGet("{id}")]
        public async Task<ActionResult<Evento>> GetPorId(int id)
        {
            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null) return NotFound();
            return Ok(evento);
        }

        // ADMIN
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Evento>> Post([FromForm] CrearEventoDto dto)
        {
            if (dto.Imagen != null)
            {
                var error = UploadHelper.ValidarImagen(dto.Imagen);
                if (error != null) return BadRequest(new { error });
            }

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

        // ADMIN
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Put(int id, [FromForm] CrearEventoDto dto)
        {
            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null) return NotFound();

            if (dto.Imagen != null)
            {
                var error = UploadHelper.ValidarImagen(dto.Imagen);
                if (error != null) return BadRequest(new { error });
            }

            evento.Titulo = dto.Titulo;
            evento.Descripcion = dto.Descripcion;
            evento.Fecha = dto.Fecha;
            evento.Lugar = dto.Lugar;

            if (dto.Imagen != null) evento.ImagenUrl = await GuardarImagen(dto.Imagen);

            await _context.SaveChangesAsync();
            return Ok(evento);
        }

        // ADMIN
        [HttpDelete("{id}")]
        [Authorize]
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

            string fileName = UploadHelper.NombreSeguro(imagen);
            string filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imagen.CopyToAsync(stream);
            }
            return $"/uploads/{fileName}";
        }
    }
}
