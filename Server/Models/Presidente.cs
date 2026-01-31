namespace Server.Models // <--- ¡ESTO ES CRÍTICO!
{
    public class Presidente
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Cargo { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;
        public string? ImagenUrl { get; set; }
    }
}