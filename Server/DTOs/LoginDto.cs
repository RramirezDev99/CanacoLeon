namespace Server.DTOs  // <--- ¡ESTO ES LO IMPORTANTE!
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}