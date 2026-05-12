namespace Server.DTOs
{
    // DTO para el endpoint de cambio de contraseña del admin.
    // Pedimos la contraseña actual para que tener solo el token no baste.
    public class CambiarPasswordDto
    {
        public string PasswordActual { get; set; } = string.Empty;
        public string PasswordNueva { get; set; } = string.Empty;
    }
}
