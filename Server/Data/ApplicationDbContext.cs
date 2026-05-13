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

        // --- LA LÍNEA NUEVA PARA EL DIRECTORIO COMERCIAL ---
        public DbSet<EmpresaDirectorio> EmpresasDirectorio { get; set; }

        // --- CONTENIDO ADMINISTRABLE DEL SITIO (misión, visión, hero, etc.) ---
        public DbSet<ContenidoSitio> ContenidosSitio { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // La clave debe ser única (no puede haber dos "mision")
            modelBuilder.Entity<ContenidoSitio>()
                .HasIndex(c => c.Clave)
                .IsUnique();
        }
    }
}