namespace Server.Models
{
    public class Evento
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty; // Agregamos esta si falta
        public string Fecha { get; set; } = string.Empty;
        public string Lugar { get; set; } = string.Empty; // Agregamos esta si falta
        
        // --- CAMBIO IMPORTANTE ---
        // Antes decía: public string Imagen { get; set; }
        public string ImagenUrl { get; set; } = string.Empty; 
    }
}