namespace Server.Models
{
    public class Noticia
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Resumen { get; set; } = string.Empty;
        public string FechaPublicacion { get; set; } = string.Empty; // Agregamos esta si falta
        
        // --- CAMBIO IMPORTANTE ---
        // Antes decía: public string Imagen { get; set; }
        public string ImagenUrl { get; set; } = string.Empty;
    }
}