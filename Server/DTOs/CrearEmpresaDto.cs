using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Server.DTOs
{
    public class CrearEmpresaDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        public string Nombre { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El giro es obligatorio")]
        public string Giro { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "La descripción es obligatoria")]
        public string Descripcion { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El teléfono es obligatorio")]
        public string Telefono { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de correo inválido")]
        public string Email { get; set; } = string.Empty;
        
        // --- LOS NULOS ---
        public string? SitioWeb { get; set; }
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        
        // --- EL ARCHIVO FÍSICO ---
        // No es Required porque al editar puede no mandar logo nuevo
        public IFormFile? Logo { get; set; }
    }
}