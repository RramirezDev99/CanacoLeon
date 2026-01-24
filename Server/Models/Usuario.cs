public class Usuario
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty; // <--- Agrega esto
    public string Email { get; set; } = string.Empty;  // <--- Agrega esto
    public string PasswordHash { get; set; } = string.Empty; // <--- Agrega esto
}