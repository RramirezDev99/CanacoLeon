namespace Server.Services
{
    // Centraliza la validación de archivos subidos (imágenes y documentos).
    // Antes, cada controller aceptaba cualquier IFormFile sin revisar tipo ni tamaño,
    // lo cual es un riesgo (subir ejecutables, llenar el disco, etc.).
    public static class UploadHelper
    {
        // Extensiones permitidas para LOGOS / IMÁGENES (noticias, eventos, presidente, etc.)
        private static readonly HashSet<string> ExtensionesImagen = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".webp", ".gif"
        };

        // Extensiones permitidas para DOCUMENTOS de afiliación (Constancia, INE, etc.)
        private static readonly HashSet<string> ExtensionesDocumento = new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf", ".jpg", ".jpeg", ".png", ".xlsx", ".xls", ".docx", ".doc"
        };

        // Límites en bytes
        public const long MaxImagenBytes = 5 * 1024 * 1024;      // 5 MB para imágenes
        public const long MaxDocumentoBytes = 10 * 1024 * 1024;  // 10 MB para documentos

        // Devuelve null si está OK, o un mensaje de error si no pasa la validación.
        public static string? ValidarImagen(IFormFile? file)
        {
            return Validar(file, ExtensionesImagen, MaxImagenBytes, "imagen");
        }

        public static string? ValidarDocumento(IFormFile? file)
        {
            return Validar(file, ExtensionesDocumento, MaxDocumentoBytes, "documento");
        }

        private static string? Validar(IFormFile? file, HashSet<string> extensiones, long maxBytes, string tipo)
        {
            if (file == null || file.Length == 0)
                return $"El archivo de {tipo} está vacío.";

            if (file.Length > maxBytes)
                return $"El {tipo} pesa más de {maxBytes / (1024 * 1024)} MB.";

            var ext = Path.GetExtension(file.FileName);
            if (!extensiones.Contains(ext))
                return $"Extensión no permitida para {tipo}. Permitidas: {string.Join(", ", extensiones)}";

            return null; // todo bien
        }

        // Genera un nombre de archivo seguro y único.
        // No confiamos en el nombre que mandó el usuario (puede tener "../" u otros caracteres feos).
        public static string NombreSeguro(IFormFile file)
        {
            return Guid.NewGuid().ToString("N") + Path.GetExtension(file.FileName).ToLowerInvariant();
        }
    }
}
