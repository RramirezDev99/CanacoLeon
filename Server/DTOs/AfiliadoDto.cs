using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Server.DTOs
{
    public class AfiliadoDto
    {
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

        // Archivos OBLIGATORIOS (sin el ?)
        [Required]
        public IFormFile Constancia { get; set; } = null!;
        [Required]
        public IFormFile Ine { get; set; } = null!;
        [Required]
        public IFormFile Comprobante { get; set; } = null!;
        [Required]
        public IFormFile FormatoExcel { get; set; } = null!; 
    }
}