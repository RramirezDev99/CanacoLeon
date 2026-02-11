using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Server.Data;
using Server.Models;
using Server.Services; // <--- 1. AGREGADO: Necesario para reconocer el servicio

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. CONFIGURACIÓN DE SERVICIOS
// ==========================================

// A) CONEXIÓN A BASE DE DATOS (SQLITE)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=canaco.db"));

// B) REGISTRO DEL SERVICIO DE EMAIL (¡ESTO FALTABA!)
builder.Services.AddScoped<IEmailService, EmailService>(); // <--- 2. AGREGADO: Esto conecta la interfaz con el código

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// C) CONFIGURACIÓN CORS (Para React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.AllowAnyOrigin() // Ojo: En producción es mejor poner la URL específica
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// D) CONFIGURACIÓN JWT
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

// E) SEMILLA DE DATOS (Crear Admin si no existe)
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
                // Sin Rol, como pediste
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
// 3. PIPELINE DE PETICIONES
// ==========================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(); // Importante para las imágenes/PDFs

app.UseCors("PermitirReact");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();