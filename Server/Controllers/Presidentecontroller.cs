using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;
using Server.Services;

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

    // PÚBLICO: la web muestra al presidente en el banner principal
    [HttpGet]
    public async Task<ActionResult<Presidente>> GetPresidente()
    {
        // Solo debe haber un presidente. Si no hay, devolvemos null (no 404)
        // para que el frontend muestre valores por defecto.
        var presidente = await _context.Presidentes.FirstOrDefaultAsync();
        return Ok(presidente);
    }

    // ADMIN — sirve tanto para crear como para editar (upsert)
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> PostPresidente([FromForm] PresidenteDto dto)
    {
        if (dto.Imagen != null)
        {
            var error = UploadHelper.ValidarImagen(dto.Imagen);
            if (error != null) return BadRequest(new { error });
        }

        var presidenteActual = await _context.Presidentes.FirstOrDefaultAsync();

        if (presidenteActual == null)
        {
            // No existe: lo creamos
            presidenteActual = new Presidente
            {
                Nombre = dto.Nombre,
                Cargo = dto.Cargo,
                Mensaje = dto.Mensaje
            };

            if (dto.Imagen != null)
            {
                presidenteActual.ImagenUrl = await GuardarImagen(dto.Imagen);
            }

            _context.Presidentes.Add(presidenteActual);
        }
        else
        {
            // Ya existe: lo actualizamos
            presidenteActual.Nombre = dto.Nombre;
            presidenteActual.Cargo = dto.Cargo;
            presidenteActual.Mensaje = dto.Mensaje;

            if (dto.Imagen != null)
            {
                // Borramos la imagen vieja del disco para no acumular basura
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
