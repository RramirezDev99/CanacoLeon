using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class ContactoMensaje
    {
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;
        public string Empresa { get; set; } = string.Empty;
        public string Asunto { get; set; } = string.Empty;
        
        [Required]
        public string Mensaje { get; set; } = string.Empty;

        public DateTime FechaEnvio { get; set; } = DateTime.Now;
        
        // Un estatus para saber si ya lo leíste o respondiste
        public bool Atendido { get; set; } = false; 
    }
}