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

        // PÚBLICO: cualquier empresa puede enviar su solicitud de afiliación.
        // No requiere login, pero SÍ validamos los archivos para evitar abusos.
        [HttpPost("solicitar")]
        public async Task<IActionResult> Solicitar([FromForm] AfiliadoDto dto)
        {
            try
            {
                // Validamos cada documento antes de guardar nada en disco o BD
                foreach (var (archivo, nombre) in new[]
                {
                    (dto.Constancia, "Constancia"),
                    (dto.Ine, "INE"),
                    (dto.Comprobante, "Comprobante"),
                    (dto.FormatoExcel, "Formato Excel"),
                })
                {
                    if (archivo == null) continue; // Si es opcional, lo dejamos pasar
                    var error = UploadHelper.ValidarDocumento(archivo);
                    if (error != null) return BadRequest(new { error = $"{nombre}: {error}" });
                }

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

                // Guardamos los 4 archivos (incluyendo el Excel de registro)
                string? rutaConstancia = await GuardarArchivo(dto.Constancia, folderPath);
                string? rutaIne = await GuardarArchivo(dto.Ine, folderPath);
                string? rutaComprobante = await GuardarArchivo(dto.Comprobante, folderPath);
                string? rutaFormatoExcel = await GuardarArchivo(dto.FormatoExcel, folderPath);

                solicitud.RutaConstancia = rutaConstancia!;
                solicitud.RutaIne = rutaIne!;
                solicitud.RutaComprobante = rutaComprobante!;
                solicitud.RutaFormatoExcel = rutaFormatoExcel!;

                _context.AfiliadosSolicitudes.Add(solicitud);
                await _context.SaveChangesAsync();

                // Preparamos la lista de adjuntos para el correo (rutas absolutas en disco)
                var listaAdjuntos = new List<string>();
                foreach (var ruta in new[] { rutaConstancia, rutaIne, rutaComprobante, rutaFormatoExcel })
                {
                    if (!string.IsNullOrEmpty(ruta))
                        listaAdjuntos.Add(Path.Combine(_env.ContentRootPath, ruta.TrimStart('/')));
                }

                string cuerpo = $@"
                    <h2>Nueva Solicitud de Afiliación</h2>
                    <p><strong>Empresa:</strong> {solicitud.RazonSocial}</p>
                    <p><strong>Representante:</strong> {solicitud.NombreCompleto}</p>
                    <p><strong>Email:</strong> {solicitud.Email}</p>
                    <p>Se han adjuntado los 4 archivos originales (incluyendo el Formato de Registro Excel).</p>";

                await _emailService.SendEmailAsync($"Nueva Afiliación - {solicitud.RazonSocial}", cuerpo, listaAdjuntos);

                return Ok(new { message = "Solicitud enviada con éxito, archivos y Excel enviados por correo" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // Guarda el archivo en disco con un nombre seguro y devuelve la ruta lógica.
        private async Task<string?> GuardarArchivo(IFormFile? file, string folder)
        {
            if (file == null || file.Length == 0) return null;
            string fileName = UploadHelper.NombreSeguro(file);
            string filePath = Path.Combine(folder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return "/uploads/afiliados/" + fileName;
        }
    }
}
