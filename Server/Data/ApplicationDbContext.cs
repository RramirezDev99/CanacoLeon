using Microsoft.EntityFrameworkCore;
using Server.Models; // <--- Importante para que reconozca Usuario, Noticia y Evento

namespace Server.Data  // <--- ¡ESTO ES LO QUE FALTABA!
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Tablas de la base de datos
        public DbSet<Usuario> Usuarios { get; set; }
        
        // ¡DESCOMENTA ESTAS LÍNEAS! Las necesitas para que funcione lo que acabamos de hacer
        public DbSet<Noticia> Noticias { get; set; }
        public DbSet<Evento> Eventos { get; set; }
    }
}