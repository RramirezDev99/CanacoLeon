using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;

namespace Server.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string asunto, string cuerpo, List<string>? adjuntos = null);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger; // Para ver los errores en tu consola

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string asunto, string cuerpo, List<string>? adjuntos = null)
        {
            try
            {
                var smtpHost = _config["Smtp:Host"];
                var smtpPortStr = _config["Smtp:Port"];
                var smtpUser = _config["Smtp:User"];
                var smtpPass = _config["Smtp:Pass"];
                var toEmail = _config["Smtp:ToEmail"];
                var enableSslStr = _config["Smtp:EnableSsl"];

                // Validación de seguridad: Si faltan datos clave, no intentamos enviar para no tronar
                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUser) || string.IsNullOrEmpty(toEmail))
                {
                    _logger.LogWarning("⚠️ Falta configuración SMTP en appsettings.json. Se guardó la solicitud pero NO se envió el correo.");
                    return; 
                }

                // Parseo seguro: Si falla o es nulo, usamos valores por defecto (ej. puerto 587, SSL true)
                int smtpPort = int.TryParse(smtpPortStr, out int port) ? port : 587;
                bool enableSsl = bool.TryParse(enableSslStr, out bool ssl) ? ssl : true;

                using (var client = new SmtpClient(smtpHost, smtpPort))
                {
                    client.Credentials = new NetworkCredential(smtpUser, smtpPass);
                    client.EnableSsl = enableSsl;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(smtpUser, "Canaco León Web"),
                        Subject = asunto,
                        Body = cuerpo,
                        IsBodyHtml = true,
                    };

                    mailMessage.To.Add(toEmail);

                    // --- AGREGAMOS LOS ARCHIVOS ADJUNTOS SI EXISTEN ---
                    if (adjuntos != null)
                    {
                        foreach (var ruta in adjuntos)
                        {
                            if (File.Exists(ruta))
                            {
                                mailMessage.Attachments.Add(new Attachment(ruta));
                            }
                            else
                            {
                                _logger.LogWarning($"⚠️ No se encontró el archivo para adjuntar: {ruta}");
                            }
                        }
                    }

                    await client.SendMailAsync(mailMessage);
                    _logger.LogInformation("✅ Correo enviado exitosamente a {ToEmail}", toEmail);
                }
            }
            catch (Exception ex)
            {
                // Atrapamos el error para que NO le mande 500 al usuario de React
                _logger.LogError(ex, "❌ Error crítico al enviar el correo de la solicitud.");
            }
        }
    }
}