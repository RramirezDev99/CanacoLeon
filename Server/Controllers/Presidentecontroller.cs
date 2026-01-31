using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;


[Route("api/[controller]")]
[ApiController]
public class PresidenteController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public PresidenteController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    // GET: api/presidente
    [HttpGet]
    public async Task<ActionResult<Presidente>> GetPresidente()
    {
        // SIEMPRE traemos el primero o por defecto (ya que solo debe haber uno)
        var presidente = await _context.Presidentes.FirstOrDefaultAsync();
        
        // Si no hay nadie, retornamos null o un objeto vacío, no error 404
        // para que el frontend pueda mostrar los datos default
        return Ok(presidente);
    }

    // POST: api/presidente
    // Usamos POST para manejar tanto Creación como Edición (Upsert)
    [HttpPost]
    public async Task<IActionResult> PostPresidente([FromForm] PresidenteDto dto)
    {
        // 1. Buscamos si YA existe un presidente en la BD
        var presidenteActual = await _context.Presidentes.FirstOrDefaultAsync();

        if (presidenteActual == null)
        {
            // --- ESCENARIO: CREAR NUEVO ---
            presidenteActual = new Presidente
            {
                Nombre = dto.Nombre,
                Cargo = dto.Cargo,
                Mensaje = dto.Mensaje
            };
            
            // Manejo de imagen si viene una nueva
            if (dto.Imagen != null)
            {
                presidenteActual.ImagenUrl = await GuardarImagen(dto.Imagen);
            }

            _context.Presidentes.Add(presidenteActual);
        }
        else
        {
            // --- ESCENARIO: ACTUALIZAR EXISTENTE ---
            presidenteActual.Nombre = dto.Nombre;
            presidenteActual.Cargo = dto.Cargo;
            presidenteActual.Mensaje = dto.Mensaje;

            // Solo cambiamos la imagen si el usuario subió una nueva
            if (dto.Imagen != null)
            {
                // Opcional: Borrar la imagen vieja del servidor para no acumular basura
                if (!string.IsNullOrEmpty(presidenteActual.ImagenUrl))
                {
                   var oldPath = Path.Combine(_env.WebRootPath, presidenteActual.ImagenUrl.TrimStart('/'));
                   if (System.IO.File.Exists(oldPath)) System.IO.File.Delete(oldPath);
                }

                presidenteActual.ImagenUrl = await GuardarImagen(dto.Imagen);
            }
        }

        await _context.SaveChangesAsync();
        return Ok(presidenteActual);
    }

    // Función auxiliar para guardar imagen
    private async Task<string> GuardarImagen(IFormFile imagen)
    {
        // Asegurar que exista carpeta uploads
        var uploadPath = Path.Combine(_env.WebRootPath, "uploads");
        if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);

        // Nombre único
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(imagen.FileName);
        var filePath = Path.Combine(uploadPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await imagen.CopyToAsync(stream);
        }

        return "/uploads/" + fileName;
    }
}