using Microsoft.AspNetCore.Http;

namespace Server.DTOs
{
    public class CrearNoticiaDto
    {
        public string Titulo { get; set; } = string.Empty;
        public string Resumen { get; set; } = string.Empty;
        public string FechaPublicacion { get; set; } = string.Empty;

        // Aquí recibimos el archivo real
        public IFormFile? Imagen { get; set; }
    }
}