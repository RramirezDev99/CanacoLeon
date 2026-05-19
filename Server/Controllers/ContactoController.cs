using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.Services;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService; // <--- 2. Variable para el servicio

        // 3. Inyectamos el servicio en el constructor
        public ContactoController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST: api/contacto
        [HttpPost]
        public async Task<IActionResult> PostMensaje([FromBody] ContactoMensaje mensaje)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try 
            {
                // A) Guardar en BD
                mensaje.FechaEnvio = DateTime.Now;
                mensaje.Atendido = false;

                _context.MensajesContacto.Add(mensaje);
                await _context.SaveChangesAsync();
                
                Console.WriteLine($"--> [BD] Mensaje de {mensaje.Nombre} guardado exitosamente.");

                // B) Armar el correo (HTML)
                string cuerpoCorreo = $@"
                    <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;'>
                        <h2 style='color: #0f3460;'>Nuevo Mensaje de Contacto Web</h2>
                        <p><strong>Nombre:</strong> {mensaje.Nombre}</p>
                        <p><strong>Email:</strong> {mensaje.Email}</p>
                        <p><strong>Teléfono:</strong> {mensaje.Telefono}</p>
                        <p><strong>Empresa:</strong> {mensaje.Empresa}</p>
                        <p><strong>Asunto:</strong> {mensaje.Asunto}</p>
                        <hr/>
                        <h3>Mensaje:</h3>
                        <p style='background-color: #f9f9f9; padding: 15px;'>{mensaje.Mensaje}</p>
                        <br/>
                        <small>Este correo fue enviado automáticamente desde canacoleon.com</small>
                    </div>
                ";

                // C) Intentar Enviar el Correo
                try 
                {
                    Console.WriteLine("--> [EMAIL] Intentando conectar con SMTP...");
                    
                    await _emailService.SendEmailAsync(
                        $"Nuevo Contacto: {mensaje.Asunto}", 
                        cuerpoCorreo
                    );
                    
                    Console.WriteLine("--> [EMAIL] ¡Correo enviado con éxito!");
                }
                catch (Exception ex)
                {
                    // Si falla el correo, NO detenemos todo, solo avisamos en consola.
                    Console.WriteLine($"--> [ERROR EMAIL]: {ex.Message}");
                    if (ex.InnerException != null) 
                    {
                         Console.WriteLine($"--> [ERROR INTERNO]: {ex.InnerException.Message}");
                    }
                }
                
                return Ok(new { message = "Mensaje recibido y procesado." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        // GET: api/contacto
        // ADMIN — listar todos los mensajes recibidos (solo con token JWT)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ContactoMensaje>>> GetMensajes()
        {
            return await _context.MensajesContacto
                                 .OrderByDescending(m => m.FechaEnvio)
                                 .ToListAsync();
        }

        // GET: api/contacto/test-smtp
        // ADMIN — manda un correo de prueba y devuelve el error EXACTO si falla.
        // Usa MailKit (no System.Net.Mail) para evitar los problemas del SmtpClient
        // deprecado de .NET con el TLS moderno de Gmail.
        [HttpGet("test-smtp")]
        [Authorize]
        public async Task<IActionResult> TestSmtp([FromServices] IConfiguration config)
        {
            var diag = new {
                host       = config["Smtp:Host"],
                port       = config["Smtp:Port"],
                enableSsl  = config["Smtp:EnableSsl"],
                user       = config["Smtp:User"],
                passLength = (config["Smtp:Pass"] ?? "").Length,
                toEmail    = config["Smtp:ToEmail"]
            };

            try
            {
                var host = config["Smtp:Host"];
                var portStr = config["Smtp:Port"];
                var user = config["Smtp:User"];
                var pass = config["Smtp:Pass"];
                var toEmail = config["Smtp:ToEmail"];
                var sslStr = config["Smtp:EnableSsl"];

                if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(user)
                    || string.IsNullOrEmpty(pass) || string.IsNullOrEmpty(toEmail))
                {
                    return BadRequest(new { error = "Faltan variables Smtp__ en el server.", diag });
                }

                int port = int.TryParse(portStr, out var p) ? p : 587;
                bool ssl = !bool.TryParse(sslStr, out var s) || s;

                var mensaje = new MimeKit.MimeMessage();
                mensaje.From.Add(new MimeKit.MailboxAddress("Canaco Leon Web - Test", user));
                mensaje.To.Add(MimeKit.MailboxAddress.Parse(toEmail));
                mensaje.Subject = "TEST SMTP CANACO - " + DateTime.Now.ToString("HH:mm:ss");
                mensaje.Body = new MimeKit.BodyBuilder
                {
                    HtmlBody = "<p>Si lees esto, el SMTP funciona perfecto.</p>" +
                               "<p>Hora: " + DateTime.Now + "</p>"
                }.ToMessageBody();

                MailKit.Security.SecureSocketOptions sslMode;
                if (!ssl) sslMode = MailKit.Security.SecureSocketOptions.None;
                else if (port == 465) sslMode = MailKit.Security.SecureSocketOptions.SslOnConnect;
                else if (port == 587) sslMode = MailKit.Security.SecureSocketOptions.StartTls;
                else sslMode = MailKit.Security.SecureSocketOptions.Auto;

                using var client = new MailKit.Net.Smtp.SmtpClient();
                client.Timeout = 15000;

                await client.ConnectAsync(host, port, sslMode);
                await client.AuthenticateAsync(user, pass);
                await client.SendAsync(mensaje);
                await client.DisconnectAsync(true);

                return Ok(new { ok = true, message = $"Correo enviado a {toEmail}", diag });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {
                    ok = false,
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    type = ex.GetType().Name,
                    diag
                });
            }
        }
    }
}