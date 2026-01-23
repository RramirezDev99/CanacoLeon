// Server/Controllers/NoticiasController.cs
using Microsoft.AspNetCore.Mvc;
using Server.Models; // Asegúrate de que coincida con tu namespace

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // La ruta será: /api/noticias
    public class NoticiasController : ControllerBase
    {
        // Simulamos la base de datos con esta lista estática
        private static readonly List<Noticia> NoticiasMock = new List<Noticia>
        {
            new Noticia { Id = 1, Titulo = "Comercio se suma a Marca Gto", Resumen = "Resumen de prueba 1...", Imagen = "/assets/default-new.png" },
            new Noticia { Id = 2, Titulo = "Expo Provee", Resumen = "Resumen de prueba 2...", Imagen = "/assets/default-new.png" },
            new Noticia { Id = 3, Titulo = "Feria Regreso a Clases", Resumen = "Resumen de prueba 3...", Imagen = "/assets/default-new.png" }
        };

        [HttpGet]
        public IEnumerable<Noticia> Get()
        {
            return NoticiasMock;
        }
    }
}