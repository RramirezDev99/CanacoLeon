using Microsoft.AspNetCore.Http;

namespace Server.DTOs
{
    public class AfiliadoDto
    {
        public string NombreCompleto { get; set; } = string.Empty;
        public string RazonSocial { get; set; } = string.Empty;
        public string RFC { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Archivos que recibiremos del formulario
        public IFormFile? Constancia { get; set; }
        public IFormFile? Ine { get; set; }
        public IFormFile? Comprobante { get; set; }
    }
}