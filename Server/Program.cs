using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Server.Data;
using Server.Models;
using Server.Services;
using Microsoft.Extensions.FileProviders; // <--- 1. AGREGADO: Para manejar archivos físicos

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var jwtKey = builder.Configuration["Jwt:Key"] ?? "ClaveSecretaSuperSeguraParaDesarrollo12345";
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

// ==========================================
// 2. CONSTRUCCIÓN DE LA APP
// ==========================================
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();

        if (!context.Usuarios.Any())
        {
            context.Usuarios.Add(new Usuario
            {
                Nombre = "Admin Principal",
                Email = "admin@canaco.com",
                PasswordHash = "admin123" 
            });
            context.SaveChanges();
            Console.WriteLine("--> BASE DE DATOS: Usuario Admin creado (admin@canaco.com / admin123)");
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

// --- 2. AGREGADO: CONFIGURACIÓN PARA SERVIR LA CARPETA UPLOADS ---
// Esto permite que http://localhost:5286/uploads/empresas/archivo.jpg funcione
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "uploads")),
    RequestPath = "/uploads"
});

app.UseStaticFiles(); // Sigue sirviendo wwwroot por si acaso

app.UseCors("PermitirReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();