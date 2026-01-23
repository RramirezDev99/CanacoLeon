var builder = WebApplication.CreateBuilder(args);

// --- 1. AGREGAR SERVICIOS ---

// A) Habilitamos los Controladores (para que lea tu archivo NoticiasController.cs)
builder.Services.AddControllers();

// B) Habilitamos CORS (para que React pueda pedir datos)
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact",
        policy => policy.WithOrigins("http://localhost:5173") // Asegúrate que este sea el puerto de tu React
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Lo que ya tenías (OpenAPI)
builder.Services.AddOpenApi();

var app = builder.Build();

// --- 2. CONFIGURAR EL PIPELINE ---

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// C) Usamos la política CORS (IMPORTANTE: Ponerlo antes de los Maps)
app.UseCors("PermitirReact");

// D) Mapeamos los controladores (Esto activa la ruta /api/noticias)
app.MapControllers();


// --- 3. TU CÓDIGO ORIGINAL (NO SE TOCA) ---
// Dejamos esto aquí para que tu ejemplo de clima siga funcionando si lo necesitas

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}