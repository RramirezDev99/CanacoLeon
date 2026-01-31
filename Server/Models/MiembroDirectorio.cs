namespace Server.Models
{
    public class MiembroDirectorio
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Cargo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty; // El texto "Lorem ipsum..."
        public string Categoria { get; set; } = string.Empty; // Ej: "Consejeros", "Comite", etc.
        public string? ImagenUrl { get; set; }
    }
}