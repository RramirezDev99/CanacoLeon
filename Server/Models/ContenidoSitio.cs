namespace Server.Models
{
    /// <summary>
    /// Almacena contenido administrable del sitio en formato clave-valor.
    /// Claves esperadas: "mision", "vision", "valores",
    /// "hero_titulo", "hero_subtitulo", "hero_descripcion".
    /// Cada clave puede tener texto y opcionalmente una imagen asociada.
    /// </summary>
    public class ContenidoSitio
    {
        public int Id { get; set; }

        /// <summary>Identificador único del contenido, ej: "mision", "vision", "hero_titulo"</summary>
        public string Clave { get; set; } = string.Empty;

        /// <summary>Texto del contenido</summary>
        public string Valor { get; set; } = string.Empty;

        /// <summary>Ruta de imagen asociada (opcional)</summary>
        public string? ImagenUrl { get; set; }
    }
}
