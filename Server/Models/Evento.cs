namespace Server.Models
{
    public class Evento
    {
        public int Id { get; set; }
        public string? Titulo { get; set; }
        public string? Descripcion { get; set; }
        public string? Fecha { get; set; }
        public string? Lugar { get; set; }
        public string? Imagen { get; set; }
    }
}