using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
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
    /// Envío de correos. Prioridad:
    ///   1) Si hay Resend:ApiKey configurado → usa el API HTTP de Resend (puerto 443).
    ///      Necesario en hostings como Railway que bloquean el SMTP outbound.
    ///   2) Si no, cae a SMTP con MailKit (útil en local).
    /// </summary>
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;
        private static readonly HttpClient _http = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(30)
        };

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string asunto, string cuerpo, List<string>? adjuntos = null)
        {
            var resendApiKey = _config["Resend:ApiKey"];

            try
            {
                if (!string.IsNullOrEmpty(resendApiKey))
                {
                    await EnviarPorResend(resendApiKey, asunto, cuerpo, adjuntos);
                }
                else
                {
                    await EnviarPorSmtp(asunto, cuerpo, adjuntos);
                }
            }
            catch (Exception ex)
            {
                // No tronamos la petición del usuario; solo logueamos.
                _logger.LogError(ex, "Error al enviar el correo de la solicitud.");
            }
        }

        // ---------- RESEND (API HTTP) ----------
        private async Task EnviarPorResend(string apiKey, string asunto, string cuerpo, List<string>? adjuntos)
        {
            var from = _config["Resend:From"] ?? "CANACO Leon <onboarding@resend.dev>";
            var to = _config["Resend:To"] ?? _config["Smtp:ToEmail"];

            if (string.IsNullOrEmpty(to))
            {
                _logger.LogWarning("Resend: falta el destinatario (Resend:To o Smtp:ToEmail).");
                return;
            }

            var payload = new Dictionary<string, object?>
            {
                ["from"] = from,
                ["to"] = new[] { to },
                ["subject"] = asunto,
                ["html"] = cuerpo,
            };

            // Adjuntos (Resend los quiere en base64)
            if (adjuntos != null && adjuntos.Count > 0)
            {
                var lista = new List<object>();
                foreach (var ruta in adjuntos)
                {
                    if (File.Exists(ruta))
                    {
                        lista.Add(new
                        {
                            filename = Path.GetFileName(ruta),
                            content = Convert.ToBase64String(File.ReadAllBytes(ruta))
                        });
                    }
                    else
                    {
                        _logger.LogWarning("No se encontro el archivo para adjuntar: {Ruta}", ruta);
                    }
                }
                if (lista.Count > 0) payload["attachments"] = lista;
            }

            var json = JsonSerializer.Serialize(payload);
            using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            req.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var resp = await _http.SendAsync(req);
            var body = await resp.Content.ReadAsStringAsync();

            if (resp.IsSuccessStatusCode)
            {
                _logger.LogInformation("Correo enviado via Resend a {To}", to);
            }
            else
            {
                _logger.LogError("Resend respondio {Status}: {Body}", (int)resp.StatusCode, body);
                throw new Exception($"Resend {(int)resp.StatusCode}: {body}");
            }
        }

        // ---------- SMTP (MailKit, fallback local) ----------
        private async Task EnviarPorSmtp(string asunto, string cuerpo, List<string>? adjuntos)
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
                _logger.LogWarning("Falta configuracion de correo (ni Resend ni SMTP). NO se envio el correo.");
                return;
            }

            int smtpPort = int.TryParse(smtpPortStr, out var p) ? p : 587;
            bool enableSsl = !bool.TryParse(enableSslStr, out var s) || s;

            var mensaje = new MimeMessage();
            mensaje.From.Add(new MailboxAddress("Canaco Leon Web", smtpUser));
            mensaje.To.Add(MailboxAddress.Parse(toEmail));
            mensaje.Subject = asunto;

            var builder = new BodyBuilder { HtmlBody = cuerpo };
            if (adjuntos != null)
            {
                foreach (var ruta in adjuntos)
                {
                    if (File.Exists(ruta)) builder.Attachments.Add(ruta);
                    else _logger.LogWarning("No se encontro el archivo para adjuntar: {Ruta}", ruta);
                }
            }
            mensaje.Body = builder.ToMessageBody();

            SecureSocketOptions sslMode;
            if (!enableSsl) sslMode = SecureSocketOptions.None;
            else if (smtpPort == 465) sslMode = SecureSocketOptions.SslOnConnect;
            else if (smtpPort == 587) sslMode = SecureSocketOptions.StartTls;
            else sslMode = SecureSocketOptions.Auto;

            using var client = new SmtpClient();
            client.Timeout = 20000;
            await client.ConnectAsync(smtpHost, smtpPort, sslMode);
            await client.AuthenticateAsync(smtpUser, smtpPass);
            await client.SendAsync(mensaje);
            await client.DisconnectAsync(true);

            _logger.LogInformation("Correo enviado via SMTP a {ToEmail}", toEmail);
        }
    }
}
