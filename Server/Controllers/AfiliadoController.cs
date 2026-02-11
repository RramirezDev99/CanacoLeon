using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;
using Server.DTOs;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AfiliadoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IWebHostEnvironment _env;

        public AfiliadoController(ApplicationDbContext context, IEmailService emailService, IWebHostEnvironment env)
        {
            _context = context;
            _emailService = emailService;
            _env = env;
        }

[HttpPost("solicitar")]
public async Task<IActionResult> Solicitar([FromForm] AfiliadoDto dto)
{
    try
    {
        var solicitud = new AfiliadoSolicitud
        {
            NombreCompleto = dto.NombreCompleto,
            RazonSocial = dto.RazonSocial,
            RFC = dto.RFC,
            Telefono = dto.Telefono ?? "N/A",
            Email = dto.Email,
            FechaSolicitud = DateTime.Now,
            Estatus = "Pendiente"
        };

        string folderPath = Path.Combine(_env.ContentRootPath, "uploads", "afiliados");
        if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

        // Guardamos los archivos y obtenemos las rutas relativas
        string? rutaConstancia = await GuardarArchivo(dto.Constancia, folderPath);
        string? rutaIne = await GuardarArchivo(dto.Ine, folderPath);
        string? rutaComprobante = await GuardarArchivo(dto.Comprobante, folderPath);

        solicitud.RutaConstancia = rutaConstancia;
        solicitud.RutaIne = rutaIne;
        solicitud.RutaComprobante = rutaComprobante;

        _context.AfiliadosSolicitudes.Add(solicitud);
        await _context.SaveChangesAsync();

        // --- PREPARAR ADJUNTOS PARA EL CORREO ---
        var listaAdjuntos = new List<string>();
        
        // Convertimos rutas relativas a rutas físicas completas para que el SmtpClient las encuentre
        if (!string.IsNullOrEmpty(rutaConstancia)) 
            listaAdjuntos.Add(Path.Combine(_env.ContentRootPath, rutaConstancia.TrimStart('/')));
        if (!string.IsNullOrEmpty(rutaIne)) 
            listaAdjuntos.Add(Path.Combine(_env.ContentRootPath, rutaIne.TrimStart('/')));
        if (!string.IsNullOrEmpty(rutaComprobante)) 
            listaAdjuntos.Add(Path.Combine(_env.ContentRootPath, rutaComprobante.TrimStart('/')));

        string cuerpo = $@"
            <h2>Nueva Solicitud de Afiliación</h2>
            <p><strong>Empresa:</strong> {solicitud.RazonSocial}</p>
            <p><strong>Representante:</strong> {solicitud.NombreCompleto}</p>
            <p><strong>Email:</strong> {solicitud.Email}</p>
            <p>Los archivos originales están adjuntos en este correo.</p>";

        // Enviamos el correo con la lista de archivos
        await _emailService.SendEmailAsync($"Nueva Afiliación - {solicitud.RazonSocial}", cuerpo, listaAdjuntos);

        return Ok(new { message = "Solicitud enviada con éxito y archivos enviados por correo" });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.Message });
    }
}

        private async Task<string?> GuardarArchivo(IFormFile? file, string folder)
        {
            if (file == null || file.Length == 0) return null;
            string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string filePath = Path.Combine(folder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return "/uploads/afiliados/" + fileName;
        }
    }
}