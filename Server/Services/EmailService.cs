using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace Server.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string asunto, string cuerpo, List<string>? adjuntos = null);
    }

    /// <summary>
    /// Envío de correos usando MailKit (reemplazo moderno de System.Net.Mail.SmtpClient,
    /// que Microsoft tiene oficialmente deprecado por no soportar bien los protocolos
    /// TLS modernos de Gmail/Outlook).
    /// </summary>
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

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

                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUser)
                    || string.IsNullOrEmpty(toEmail) || string.IsNullOrEmpty(smtpPass))
                {
                    _logger.LogWarning("Falta configuracion SMTP. Se guardo la solicitud pero NO se envio el correo.");
                    return;
                }

                int smtpPort = int.TryParse(smtpPortStr, out var p) ? p : 587;
                bool enableSsl = !bool.TryParse(enableSslStr, out var s) || s;

                // Construir el mensaje
                var mensaje = new MimeMessage();
                mensaje.From.Add(new MailboxAddress("Canaco Leon Web", smtpUser));
                mensaje.To.Add(MailboxAddress.Parse(toEmail));
                mensaje.Subject = asunto;

                var builder = new BodyBuilder { HtmlBody = cuerpo };

                if (adjuntos != null)
                {
                    foreach (var ruta in adjuntos)
                    {
                        if (File.Exists(ruta))
                        {
                            builder.Attachments.Add(ruta);
                        }
                        else
                        {
                            _logger.LogWarning("No se encontro el archivo para adjuntar: {Ruta}", ruta);
                        }
                    }
                }

                mensaje.Body = builder.ToMessageBody();

                // Decidir tipo de conexion segun puerto:
                //   465 → SSL implícito
                //   587 → STARTTLS
                //   otro → Auto (MailKit decide)
                SecureSocketOptions sslMode;
                if (!enableSsl) sslMode = SecureSocketOptions.None;
                else if (smtpPort == 465) sslMode = SecureSocketOptions.SslOnConnect;
                else if (smtpPort == 587) sslMode = SecureSocketOptions.StartTls;
                else sslMode = SecureSocketOptions.Auto;

                using var client = new SmtpClient();
                client.Timeout = 20000; // 20s, suficiente para handshake + auth

                await client.ConnectAsync(smtpHost, smtpPort, sslMode);
                await client.AuthenticateAsync(smtpUser, smtpPass);
                await client.SendAsync(mensaje);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Correo enviado exitosamente a {ToEmail}", toEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al enviar el correo de la solicitud.");
            }
        }
    }
}
