using System;
using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class AfiliadoSolicitud
    {
        public int Id { get; set; }

        [Required]
        public string NombreCompleto { get; set; } = string.Empty;

        [Required]
        public string RazonSocial { get; set; } = string.Empty;

        [Required]
        public string RFC { get; set; } = string.Empty;

        [Required]
        public string Telefono { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        // --- RUTAS DE LOS ARCHIVOS (Strings) ---
        public string? RutaConstancia { get; set; } 
        public string? RutaIne { get; set; }
        public string? RutaComprobante { get; set; }

        public DateTime FechaSolicitud { get; set; } = DateTime.Now;
        
        // Estatus: Pendiente, Aprobado, Rechazado
        public string Estatus { get; set; } = "Pendiente"; 
    }
}