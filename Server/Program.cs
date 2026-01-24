using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 
using Server.Data;
using Server.Models; // <--- 2. AGREGADO: Para que reconozca la clase 'Usuario' abajo

var builder = WebApplication.CreateBuilder(args);

// --- 1. AGREGAR SERVICIOS ---

// A) CONEXIÓN A BASE DE DATOS (SQLITE)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=canaco.db")); 

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer(); 
builder.Services.AddSwaggerGen();           

// B) Configuración CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// C) Configuración JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
    };
});


// --- AQUÍ SE CONSTRUYE LA APP ---
var app = builder.Build();


// --- 2. CONFIGURAR EL PIPELINE Y SEMILLA DE DATOS ---

// D) SEMILLA DE DATOS (CREAR ADMIN AUTOMÁTICO)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    // Esto crea el archivo canaco.db si no existe
    context.Database.EnsureCreated();

    // Si la tabla usuarios está vacía, creamos al Admin
    if (!context.Usuarios.Any())
    {
        context.Usuarios.Add(new Usuario
        {
            Nombre = "Admin Principal",
            Email = "admin@canaco.com",
            PasswordHash = "admin123" 
        });
        context.SaveChanges();
        Console.WriteLine("--> ¡USUARIO ADMIN CREADO! (admin@canaco.com / admin123)");
    }
}

// Configuración de entorno
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();           
    app.UseSwaggerUI();         
}

// --- IMPORTANTE: ACTIVAR ARCHIVOS ESTÁTICOS ---
// Esto permite que la carpeta wwwroot (y uploads) sea pública
app.UseStaticFiles(); 
// ----------------------------------------------

app.UseCors("PermitirReact");
app.UseAuthentication(); 
app.UseAuthorization();  
app.MapControllers();

app.Run();