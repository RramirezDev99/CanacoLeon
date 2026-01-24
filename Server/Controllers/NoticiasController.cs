using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Necesario para .ToListAsync()
using Server.Data;   // Necesario para conectar la BD
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NoticiasController : ControllerBase
    {
        // 1. Preparamos la conexión
        private readonly ApplicationDbContext _context;

        // 2. Recibimos la conexión en el constructor
        public NoticiasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 3. Método GET real (Asíncrono y directo a la BD)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Noticia>>> Get()
        {
            // Busca en la tabla 'Noticias' y regrésalas todas
            return await _context.Noticias.ToListAsync();
        }
    }
}