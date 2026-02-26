using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpresaDirectorioController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public EmpresaDirectorioController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/EmpresaDirectorio
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmpresaDirectorio>>> GetEmpresas()
        {
            var empresas = await _context.EmpresasDirectorio
                                         .Where(e => e.Activo)
                                         .ToListAsync();
            return Ok(empresas);
        }

        // POST: api/EmpresaDirectorio
        [HttpPost]
        public async Task<ActionResult<EmpresaDirectorio>> PostEmpresa([FromForm] CrearEmpresaDto dto)
        {
            if (dto.Logo == null || dto.Logo.Length == 0)
            {
                return BadRequest("Se requiere una imagen para el logo.");
            }

            string relativePath = await GuardarImagen(dto.Logo);

            var nuevaEmpresa = new EmpresaDirectorio
            {
                Nombre = dto.Nombre,
                Giro = dto.Giro,
                Descripcion = dto.Descripcion,
                Telefono = dto.Telefono,
                Email = dto.Email,
                SitioWeb = dto.SitioWeb,
                FacebookUrl = dto.FacebookUrl,
                InstagramUrl = dto.InstagramUrl,
                RutaLogo = relativePath,
                Activo = true
            };

            _context.EmpresasDirectorio.Add(nuevaEmpresa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmpresas), new { id = nuevaEmpresa.Id }, nuevaEmpresa);
        }

        // PUT: api/EmpresaDirectorio/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmpresa(int id, [FromForm] CrearEmpresaDto dto)
        {
            var empresa = await _context.EmpresasDirectorio.FindAsync(id);
            if (empresa == null) return NotFound();

            // Actualizar datos básicos
            empresa.Nombre = dto.Nombre;
            empresa.Giro = dto.Giro;
            empresa.Descripcion = dto.Descripcion;
            empresa.Telefono = dto.Telefono;
            empresa.Email = dto.Email;
            empresa.SitioWeb = dto.SitioWeb;
            empresa.FacebookUrl = dto.FacebookUrl;
            empresa.InstagramUrl = dto.InstagramUrl;

            // Si se subió un logo nuevo, reemplazar el anterior
            if (dto.Logo != null && dto.Logo.Length > 0)
            {
                EliminarImagenFisica(empresa.RutaLogo); // Borra el viejo para no llenar el server de basura
                empresa.RutaLogo = await GuardarImagen(dto.Logo);
            }

            _context.Entry(empresa).State = EntityState.Modified;
            
            try 
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmpresaExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/EmpresaDirectorio/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpresa(int id)
        {
            var empresa = await _context.EmpresasDirectorio.FindAsync(id);
            if (empresa == null) return NotFound();

            // 1. Borrar el archivo físico del logo
            EliminarImagenFisica(empresa.RutaLogo);

            // 2. Borrar de la base de datos
            _context.EmpresasDirectorio.Remove(empresa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // --- MÉTODOS DE APOYO (HELPER METHODS) ---

        private async Task<string> GuardarImagen(IFormFile file)
        {
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads", "empresas");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"/uploads/empresas/{uniqueFileName}";
        }

        private void EliminarImagenFisica(string rutaRelativa)
        {
            if (string.IsNullOrEmpty(rutaRelativa)) return;

            // Convertimos la ruta del logo en una ruta física real del disco
            var fullPath = Path.Combine(_env.ContentRootPath, rutaRelativa.TrimStart('/'));

            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }
        }

        private bool EmpresaExists(int id)
        {
            return _context.EmpresasDirectorio.Any(e => e.Id == id);
        }
    }
}