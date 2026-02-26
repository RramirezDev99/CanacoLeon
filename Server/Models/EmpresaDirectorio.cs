using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class EmpresaDirectorio
    {
        [Key]
        public int Id { get; set; }
        
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
        
        [Required(ErrorMessage = "El logo es obligatorio")]
        public string RutaLogo { get; set; } = string.Empty; 
        
        // --- ESTOS 3 SÍ PUEDEN SER NULOS (?) ---
        public string? SitioWeb { get; set; }
        
        public string? FacebookUrl { get; set; }
        
        public string? InstagramUrl { get; set; }
        
        // Estado de la empresa (activo por defecto)
        public bool Activo { get; set; } = true; 
    }
}