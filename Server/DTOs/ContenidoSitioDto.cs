using System.ComponentModel.DataAnnotations;

public class ContenidoSitioDto
{
    /// <summary>Clave del contenido: "mision", "vision", "valores", "hero_titulo", etc.</summary>
    [Required]
    public string Clave { get; set; } = string.Empty;

    /// <summary>Texto del contenido (puede estar vacío)</summary>
    public string? Valor { get; set; } = string.Empty;

    /// <summary>Imagen opcional asociada al contenido</summary>
    public IFormFile? Imagen { get; set; }
}
