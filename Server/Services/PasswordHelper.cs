using System.Security.Cryptography;

namespace Server.Services
{
    // Hash de contraseñas usando PBKDF2 (incluido en .NET, no requiere paquetes extra).
    // Formato guardado en BD: "v1.{salt}.{hash}"  (todo en base64).
    // El prefijo "v1" sirve para detectar contraseñas viejas en texto plano y poder migrarlas.
    public static class PasswordHelper
    {
        private const int SaltSize = 16;          // 128 bits de sal aleatoria
        private const int HashSize = 32;          // 256 bits de hash
        private const int Iterations = 100_000;   // costo: lento a propósito para frenar fuerza bruta
        private const string Prefix = "v1";

        // Genera un hash listo para guardar en la BD.
        public static string Hash(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
            byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
                password, salt, Iterations, HashAlgorithmName.SHA256, HashSize);

            return $"{Prefix}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
        }

        // Compara una contraseña en texto plano contra el valor guardado en la BD.
        public static bool Verify(string password, string stored)
        {
            if (string.IsNullOrEmpty(stored)) return false;

            var parts = stored.Split('.');
            if (parts.Length != 3 || parts[0] != Prefix) return false;

            try
            {
                byte[] salt = Convert.FromBase64String(parts[1]);
                byte[] expected = Convert.FromBase64String(parts[2]);
                byte[] actual = Rfc2898DeriveBytes.Pbkdf2(
                    password, salt, Iterations, HashAlgorithmName.SHA256, HashSize);

                // Comparación a tiempo constante para evitar timing attacks
                return CryptographicOperations.FixedTimeEquals(expected, actual);
            }
            catch
            {
                return false;
            }
        }

        // ¿El valor guardado ya está hasheado con este helper?
        // Lo usamos para migrar usuarios viejos que tienen la contraseña en texto plano.
        public static bool IsHashed(string value)
        {
            return !string.IsNullOrEmpty(value) && value.StartsWith(Prefix + ".");
        }
    }
}
