using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.Services;

[Route("api/[controller]")]
[ApiController]
public class ContenidoSitioController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ContenidoSitioController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // PÚBLICO — Devuelve TODO el contenido del sitio (para que el frontend lo consuma de un solo fetch)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContenidoSitio>>> GetAll()
    {
        var contenidos = await _context.ContenidosSitio.ToListAsync();
        return Ok(contenidos);
    }

    // PÚBLICO — Devuelve un contenido por su clave
    [HttpGet("{clave}")]
    public async Task<ActionResult<ContenidoSitio>> GetByClave(string clave)
    {
        var contenido = await _context.ContenidosSitio
            .FirstOrDefaultAsync(c => c.Clave == clave);

        return Ok(contenido); // null si no existe, el frontend maneja el caso
    }

    // ADMIN — Upsert: crea o actualiza un contenido por su clave
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Upsert([FromForm] ContenidoSitioDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Clave))
            return BadRequest(new { error = "La clave es obligatoria" });

        if (dto.Imagen != null)
        {
            var error = UploadHelper.ValidarImagen(dto.Imagen);
            if (error != null) return BadRequest(new { error });
        }

        var existente = await _context.ContenidosSitio
            .FirstOrDefaultAsync(c => c.Clave == dto.Clave);

        if (existente == null)
        {
            // Crear nuevo
            existente = new ContenidoSitio
            {
                Clave = dto.Clave,
                Valor = dto.Valor ?? string.Empty
            };

            if (dto.Imagen != null)
            {
                existente.ImagenUrl = await GuardarImagen(dto.Imagen);
            }

            _context.ContenidosSitio.Add(existente);
        }
        else
        {
            // Actualizar existente
            existente.Valor = dto.Valor ?? string.Empty;

            if (dto.Imagen != null)
            {
                // Borrar imagen vieja
                if (!string.IsNullOrEmpty(existente.ImagenUrl))
                {
                    var oldPath = Path.Combine(_env.WebRootPath, existente.ImagenUrl.TrimStart('/'));
                    if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);
                }

                existente.ImagenUrl = await GuardarImagen(dto.Imagen);
            }
        }

        await _context.SaveChangesAsync();
        return Ok(existente);
    }

    // ADMIN — Eliminar imagen de un contenido (sin borrar el texto)
    [HttpDelete("{clave}/imagen")]
    [Authorize]
    public async Task<IActionResult> DeleteImagen(string clave)
    {
        var contenido = await _context.ContenidosSitio
            .FirstOrDefaultAsync(c => c.Clave == clave);

        if (contenido == null) return NotFound();

        if (!string.IsNullOrEmpty(contenido.ImagenUrl))
        {
            var filePath = Path.Combine(_env.WebRootPath, contenido.ImagenUrl.TrimStart('/'));
            if (System.IO.File.Exists(filePath)) System.IO.File.Delete(filePath);
            contenido.ImagenUrl = null;
            await _context.SaveChangesAsync();
        }

        return Ok(contenido);
    }

    private async Task<string> GuardarImagen(IFormFile imagen)
    {
        var uploadPath = Path.Combine(_env.WebRootPath, "uploads");
        if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

        var fileName = UploadHelper.NombreSeguro(imagen);
        var filePath = Path.Combine(uploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await imagen.CopyToAsync(stream);
        }

        return "/uploads/" + fileName;
    }
}
