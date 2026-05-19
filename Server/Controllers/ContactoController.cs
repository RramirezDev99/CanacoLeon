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
        // Sirve para diagnosticar la configuración SMTP sin tener que adivinar.
        [HttpGet("test-smtp")]
        [Authorize]
        public async Task<IActionResult> TestSmtp([FromServices] IConfiguration config)
        {
            // Reportamos qué variables están configuradas (sin exponer el password)
            var diag = new {
                host       = config["Smtp:Host"],
                port       = config["Smtp:Port"],
                enableSsl  = config["Smtp:EnableSsl"],
                user       = config["Smtp:User"],
                passLength = (config["Smtp:Pass"] ?? "").Length,
                toEmail    = config["Smtp:ToEmail"]
            };

            // Intentamos enviar SIN atrapar el error en EmailService — lo armamos
            // a mano para ver la excepción real.
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

                using var client = new System.Net.Mail.SmtpClient(host, port);
                client.Credentials = new System.Net.NetworkCredential(user, pass);
                client.EnableSsl = ssl;
                // Timeout corto para que el error sea visible antes que Railway
                // nos corte por 502 (su proxy se aburre a los ~30s).
                client.Timeout = 10000;

                var msg = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress(user, "Canaco León Web — Test"),
                    Subject = "TEST SMTP CANACO — " + DateTime.Now.ToString("HH:mm:ss"),
                    Body = "<p>Si lees esto, el SMTP funciona perfecto. ✅</p><p>Hora: "
                           + DateTime.Now + "</p>",
                    IsBodyHtml = true,
                };
                msg.To.Add(toEmail);

                await client.SendMailAsync(msg);
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