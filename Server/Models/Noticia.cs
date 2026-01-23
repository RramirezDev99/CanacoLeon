namespace Server.Models
{
    public class Noticia
    {
        public int Id { get; set; }
        public string? Titulo { get; set; }   // <--- Agrega el ?
        public string? Resumen { get; set; }  // <--- Agrega el ?
        public string? Imagen { get; set; }   // <--- Agrega el ?
    }
}