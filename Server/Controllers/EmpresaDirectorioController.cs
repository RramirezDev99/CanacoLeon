using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using Server.DTOs;
using Server.Services;

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

        // PÚBLICO: el directorio comercial se muestra en la web
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmpresaDirectorio>>> GetEmpresas()
        {
            var empresas = await _context.EmpresasDirectorio
                                         .Where(e => e.Activo)
                                         .ToListAsync();
            return Ok(empresas);
        }

        // ADMIN
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<EmpresaDirectorio>> PostEmpresa([FromForm] CrearEmpresaDto dto)
        {
            // Validamos el logo: tipo, tamaño y que no venga vacío
            var error = UploadHelper.ValidarImagen(dto.Logo);
            if (error != null) return BadRequest(new { error });

            string relativePath = await GuardarImagen(dto.Logo!);

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

        // ADMIN
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutEmpresa(int id, [FromForm] CrearEmpresaDto dto)
        {
            var empresa = await _context.EmpresasDirectorio.FindAsync(id);
            if (empresa == null) return NotFound();

            // Si mandan logo nuevo, lo validamos antes de borrar el viejo
            if (dto.Logo != null && dto.Logo.Length > 0)
            {
                var error = UploadHelper.ValidarImagen(dto.Logo);
                if (error != null) return BadRequest(new { error });
            }

            empresa.Nombre = dto.Nombre;
            empresa.Giro = dto.Giro;
            empresa.Descripcion = dto.Descripcion;
            empresa.Telefono = dto.Telefono;
            empresa.Email = dto.Email;
            empresa.SitioWeb = dto.SitioWeb;
            empresa.FacebookUrl = dto.FacebookUrl;
            empresa.InstagramUrl = dto.InstagramUrl;

            // Si subieron logo nuevo, reemplazar el anterior (borrando el archivo viejo del disco)
            if (dto.Logo != null && dto.Logo.Length > 0)
            {
                EliminarImagenFisica(empresa.RutaLogo);
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

        // ADMIN
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteEmpresa(int id)
        {
            var empresa = await _context.EmpresasDirectorio.FindAsync(id);
            if (empresa == null) return NotFound();

            // Primero borramos el logo físico, luego el registro de BD
            EliminarImagenFisica(empresa.RutaLogo);

            _context.EmpresasDirectorio.Remove(empresa);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // --- HELPERS PRIVADOS ---

        private async Task<string> GuardarImagen(IFormFile file)
        {
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "uploads", "empresas");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            // Usamos un GUID como nombre — nunca confiamos en el nombre original del archivo
            var uniqueFileName = UploadHelper.NombreSeguro(file);
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

            // Convertimos la ruta lógica (/uploads/...) en una ruta real del disco
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
