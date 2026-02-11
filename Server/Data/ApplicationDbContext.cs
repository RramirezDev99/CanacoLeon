using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<ContactoMensaje> MensajesContacto { get; set; }
        public DbSet<Noticia> Noticias { get; set; }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Presidente> Presidentes { get; set; }
        public DbSet<MiembroDirectorio> Directorio { get; set; }
        
        // Tabla para las afiliaciones
        public DbSet<AfiliadoSolicitud> AfiliadosSolicitudes { get; set; }
    }
}