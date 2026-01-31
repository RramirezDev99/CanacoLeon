public class PresidenteDto
{
    public string Nombre { get; set; }
    public string Cargo { get; set; }
    public string Mensaje { get; set; }
    public IFormFile? Imagen { get; set; } // Puede ser null si no la actualizan
}