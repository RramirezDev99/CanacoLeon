using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data; 
using Server.Models;
using Server.Services; // <--- 1. IMPORTANTE: Usar el servicio de email

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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactoMensaje>>> GetMensajes()
        {
            return await _context.MensajesContacto
                                 .OrderByDescending(m => m.FechaEnvio)
                                 .ToListAsync();
        }
    }
}