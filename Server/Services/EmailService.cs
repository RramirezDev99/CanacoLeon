using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.IO;

namespace Server.Services
{
    public interface IEmailService
    {
        // Un solo método flexible que acepta adjuntos opcionales
        Task SendEmailAsync(string asunto, string cuerpo, List<string>? adjuntos = null);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string asunto, string cuerpo, List<string>? adjuntos = null)
        {
            var smtpHost = _config["Smtp:Host"];
            var smtpPort = int.Parse(_config["Smtp:Port"]);
            var smtpUser = _config["Smtp:User"];
            var smtpPass = _config["Smtp:Pass"];
            var toEmail = _config["Smtp:ToEmail"];
            var enableSsl = bool.Parse(_config["Smtp:EnableSsl"]);

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
                    }
                }

                await client.SendMailAsync(mailMessage);
            }
        }
    }
}