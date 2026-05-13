using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Server.Data;
using Server.Models;
using Server.Services;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. CONFIGURACIÓN DE SERVICIOS
// ==========================================

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=canaco.db"));

builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- CORS ---
// Antes estaba abierto a cualquier origen (AllowAnyOrigin), lo que permitía a cualquier
// página de internet llamar a nuestra API desde el navegador del usuario.
// Ahora leemos los orígenes permitidos desde appsettings (Cors:Origins) y, si no hay nada,
// usamos los típicos de desarrollo (Vite y CRA).
var origenesPermitidos = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
    ?? new[] { "http://localhost:5173", "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins(origenesPermitidos)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// --- JWT ---
// IMPORTANTE: ya no aceptamos un valor por defecto inseguro.
// Si Jwt:Key no está configurado (en appsettings.Development.json, User Secrets
// o variables de entorno), la app falla al iniciar para que no quede expuesta.
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "Falta Jwt:Key en la configuración. Agrégalo en appsettings.Development.json " +
        "o usa 'dotnet user-secrets set \"Jwt:Key\" \"tu-clave-larga-y-aleatoria\"'.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CanacoServer";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "CanacoClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

// ==========================================
// 2. CONSTRUCCIÓN DE LA APP + SEED INICIAL
// ==========================================
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();

        // Crear tabla ContenidosSitio si no existe (EnsureCreated no la agrega a BD existente)
        context.Database.ExecuteSqlRaw(@"
            CREATE TABLE IF NOT EXISTS ContenidosSitio (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                Clave TEXT NOT NULL,
                Valor TEXT NOT NULL DEFAULT '',
                ImagenUrl TEXT
            );
        ");
        // Índice único en Clave
        context.Database.ExecuteSqlRaw(@"
            CREATE UNIQUE INDEX IF NOT EXISTS IX_ContenidosSitio_Clave ON ContenidosSitio (Clave);
        ");

        // Contraseña inicial del admin: la leemos de configuración para no hardcodearla.
        // Si no la pones en config, usamos un valor por defecto SOLO para arrancar local.
        var passwordInicial = builder.Configuration["Admin:PasswordInicial"] ?? "admin123";

        if (!context.Usuarios.Any())
        {
            // Primer arranque: creamos el usuario admin con la contraseña ya hasheada.
            context.Usuarios.Add(new Usuario
            {
                Nombre = "Admin Principal",
                Email = "admin@canaco.com",
                PasswordHash = PasswordHelper.Hash(passwordInicial)
            });
            context.SaveChanges();
            Console.WriteLine($"--> BD: Usuario admin creado (admin@canaco.com / {passwordInicial}). " +
                              "⚠️ CÁMBIALA después de tu primer login.");
        }
        else
        {
            // Migración automática: si algún usuario tiene la contraseña vieja en TEXTO PLANO,
            // la re-hasheamos en caliente. Así no rompemos a los usuarios existentes.
            var sinHashear = context.Usuarios
                .AsEnumerable()
                .Where(u => !PasswordHelper.IsHashed(u.PasswordHash))
                .ToList();

            if (sinHashear.Count > 0)
            {
                foreach (var u in sinHashear)
                {
                    // El "texto plano" que estaba guardado es la contraseña real
                    u.PasswordHash = PasswordHelper.Hash(u.PasswordHash);
                }
                context.SaveChanges();
                Console.WriteLine($"--> BD: {sinHashear.Count} contraseña(s) migrada(s) a hash seguro.");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("--> ERROR al inicializar BD: " + ex.Message);
    }
}

// ==========================================
// 3. PIPELINE DE PETICIONES (EL ORDEN IMPORTA)
// ==========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Servir la carpeta /uploads como contenido estático.
// Así http://localhost:5286/uploads/empresas/archivo.jpg funciona.
var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsPath); // Crearla si no existe (producción)
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

app.UseStaticFiles(); // Sigue sirviendo wwwroot por si acaso

app.UseCors("PermitirReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
