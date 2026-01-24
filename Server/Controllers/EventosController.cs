using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Necesario para .ToListAsync()
using Server.Data;   // <--- Asegúrate que aquí esté tu DbContext
using Server.Models;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        // 1. Campo para guardar la conexión a la Base de Datos
        private readonly ApplicationDbContext _context;

        // 2. El Constructor pide la conexión (Inyección de dependencias)
        public EventosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 3. El método GET ahora es asíncrono y va a la BD real
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evento>>> Get()
        {
            // Busca en la tabla 'Eventos' y conviértela en lista
            return await _context.Eventos.ToListAsync();
        }
    }
}