using Microsoft.AspNetCore.Http; // Necesario para IFormFile

namespace Server.DTOs
{
    public class CrearEventoDto
    {
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Fecha { get; set; } = string.Empty;
        public string Lugar { get; set; } = string.Empty;
        
        // Aquí recibimos el archivo real
        public IFormFile? Imagen { get; set; } 
    }
}