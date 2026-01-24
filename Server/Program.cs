using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // <--- 1. IMPORTANTE: Agrega esto para usar SQLite
using Server.Data; // <--- ¡AGREGA ESTO!
var builder = WebApplication.CreateBuilder(args);

// --- 1. AGREGAR SERVICIOS ---

// A) CONEXIÓN A BASE DE DATOS (SQLITE) - ¡ESTO ES LO QUE FALTABA!
// ----------------------------------------------------------------
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=canaco.db")); 
// ----------------------------------------------------------------

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


// --- AQUÍ SE CONSTRUYE LA APP (NO PONER SERVICIOS DESPUÉS DE ESTO) ---
var app = builder.Build();


// --- 2. CONFIGURAR EL PIPELINE Y SEMILLA DE DATOS ---

// D) SEMILLA DE DATOS (CREAR ADMIN AUTOMÁTICO) - ¡ESTO TAMBIÉN ES NUEVO!
// ----------------------------------------------------------------
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
// ----------------------------------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();           
    app.UseSwaggerUI();         
}

app.UseCors("PermitirReact");
app.UseAuthentication(); 
app.UseAuthorization();  
app.MapControllers();

app.Run();