using Microsoft.Data.Sqlite;

// ============================================================
// Seeder de la base de datos CANACO León
// - Inserta noticias, eventos, presidente, directorio interno y
//   directorio comercial.
// - NO toca la tabla ContenidosSitio (banners / misión / visión).
// - Usa la imagen /uploads/seed/descarga.jpg para todos los
//   campos de imagen.
// ============================================================

const string Imagen = "/uploads/seed/descarga.jpg";

// El working directory esperado es Server/ (donde está canaco.db)
var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "canaco.db");
if (!File.Exists(dbPath))
{
    Console.Error.WriteLine($"No se encontró canaco.db en {dbPath}");
    Console.Error.WriteLine("Ejecuta este seeder desde la carpeta Server/.");
    return 1;
}

Console.WriteLine($"Conectando a {dbPath}");
using var conn = new SqliteConnection($"Data Source={dbPath}");
conn.Open();

// Helper para ejecutar inserts parametrizados
void Insert(string sql, params (string name, object? value)[] parameters)
{
    using var cmd = conn.CreateCommand();
    cmd.CommandText = sql;
    foreach (var (name, value) in parameters)
    {
        var p = cmd.CreateParameter();
        p.ParameterName = name;
        p.Value = value ?? DBNull.Value;
        cmd.Parameters.Add(p);
    }
    cmd.ExecuteNonQuery();
}

long Count(string table)
{
    using var cmd = conn.CreateCommand();
    cmd.CommandText = $"SELECT COUNT(*) FROM {table}";
    return (long)(cmd.ExecuteScalar() ?? 0L);
}

// ============================================================
// NOTICIAS
// ============================================================
if (Count("Noticias") == 0)
{
    Console.WriteLine("Sembrando Noticias...");
    var noticias = new (string Titulo, string Resumen, string Fecha)[]
    {
        ("CANACO León impulsa el comercio local con nueva campaña",
         "La Cámara Nacional de Comercio en León lanza una iniciativa para fortalecer a las pequeñas y medianas empresas locales mediante capacitaciones gratuitas, asesoría fiscal y promoción digital.",
         "2026-05-10"),

        ("Firmamos convenio con la Universidad para impulsar el emprendimiento",
         "CANACO León firmó un convenio de colaboración con instituciones educativas para acercar a los estudiantes al ecosistema empresarial y fomentar la creación de nuevos negocios en la región.",
         "2026-05-02"),

        ("Resultados positivos en la temporada de ventas 2026",
         "Los comercios afiliados a CANACO León reportaron un incremento del 12% en ventas durante el primer trimestre del año, gracias a las estrategias coordinadas y al impulso del consumo local.",
         "2026-04-22"),

        ("Nuevo programa de financiamiento para afiliados",
         "Presentamos un esquema de créditos blandos en alianza con instituciones bancarias, diseñado especialmente para los socios de la Cámara que buscan expandir o modernizar su negocio.",
         "2026-04-08"),

        ("CANACO León premia a los Mejores Comercios del Año",
         "Reconocimos la trayectoria, innovación y compromiso de los empresarios leoneses que han destacado por su contribución al desarrollo económico y social de la ciudad.",
         "2026-03-25"),

        ("Capacitación gratuita en facturación electrónica 4.0",
         "Más de 200 afiliados participaron en el taller para actualizarse en los requerimientos del SAT y mantener sus operaciones al día sin contratiempos.",
         "2026-03-12"),
    };

    foreach (var n in noticias)
    {
        Insert(
            "INSERT INTO Noticias (Titulo, Resumen, FechaPublicacion, ImagenUrl) VALUES (@t, @r, @f, @i)",
            ("@t", n.Titulo), ("@r", n.Resumen), ("@f", n.Fecha), ("@i", Imagen));
    }
    Console.WriteLine($"  -> {noticias.Length} noticias insertadas");
}
else
{
    Console.WriteLine($"Noticias ya tiene {Count("Noticias")} registros, se omite.");
}

// ============================================================
// EVENTOS
// ============================================================
if (Count("Eventos") == 0)
{
    Console.WriteLine("Sembrando Eventos...");
    var eventos = new (string Titulo, string Descripcion, string Fecha, string Lugar)[]
    {
        ("Expo Negocios León 2026",
         "El evento empresarial más grande del Bajío reúne a expositores, conferencistas y emprendedores de todo el país. Networking, ruedas de negocio y conferencias magistrales.",
         "2026-06-15", "Poliforum León"),

        ("Taller: Marketing Digital para PyMEs",
         "Aprende las estrategias clave para posicionar tu negocio en redes sociales, atraer clientes y aumentar tus ventas con herramientas accesibles.",
         "2026-05-28", "Auditorio CANACO León"),

        ("Foro de Mujeres Empresarias",
         "Encuentro para impulsar el liderazgo femenino en los negocios, con ponentes destacadas, paneles y oportunidades de mentoría.",
         "2026-06-08", "Hotel Real de Minas"),

        ("Networking Mensual de Afiliados",
         "Reunión exclusiva para socios CANACO. Una oportunidad ideal para conectar con otros empresarios, generar alianzas y compartir experiencias.",
         "2026-05-25", "Salón Cibeles, CANACO León"),

        ("Curso Intensivo de Comercio Exterior",
         "Programa de 4 sesiones para conocer los procedimientos, tratados y oportunidades del comercio internacional desde León.",
         "2026-07-02", "Aula Virtual CANACO"),

        ("Cena de Gala 2026 - Aniversario CANACO",
         "Celebramos un año más de servicio al comercio leonés con una noche de reconocimientos, música en vivo y networking de primer nivel.",
         "2026-09-12", "Hotel Hot León"),
    };

    foreach (var e in eventos)
    {
        Insert(
            "INSERT INTO Eventos (Titulo, Descripcion, Fecha, Lugar, ImagenUrl) VALUES (@t, @d, @f, @l, @i)",
            ("@t", e.Titulo), ("@d", e.Descripcion), ("@f", e.Fecha),
            ("@l", e.Lugar), ("@i", Imagen));
    }
    Console.WriteLine($"  -> {eventos.Length} eventos insertados");
}
else
{
    Console.WriteLine($"Eventos ya tiene {Count("Eventos")} registros, se omite.");
}

// ============================================================
// PRESIDENTE (solo hay uno; si existe se actualiza)
// ============================================================
{
    const string nombre = "Lic. Juan Carlos Martínez Hernández";
    const string cargo  = "Presidente del Consejo Directivo 2025-2027";
    const string mensaje = "Es un honor representar a la comunidad empresarial de León como Presidente de CANACO Servytur. Trabajamos día con día para impulsar el desarrollo del comercio, los servicios y el turismo en nuestra ciudad, generando oportunidades para nuestros afiliados y fortaleciendo el tejido económico de la región. Te invitamos a ser parte de esta gran familia que durante décadas ha sido motor del crecimiento de León.";

    if (Count("Presidentes") == 0)
    {
        Console.WriteLine("Sembrando Presidente...");
        Insert(
            "INSERT INTO Presidentes (Nombre, Cargo, Mensaje, ImagenUrl) VALUES (@n, @c, @m, @i)",
            ("@n", nombre), ("@c", cargo), ("@m", mensaje), ("@i", Imagen));
        Console.WriteLine("  -> Presidente insertado");
    }
    else
    {
        Console.WriteLine("Actualizando Presidente existente con datos de seed...");
        Insert(
            @"UPDATE Presidentes
              SET Nombre = @n, Cargo = @c, Mensaje = @m, ImagenUrl = @i
              WHERE Id = (SELECT Id FROM Presidentes ORDER BY Id LIMIT 1)",
            ("@n", nombre), ("@c", cargo), ("@m", mensaje), ("@i", Imagen));
        Console.WriteLine("  -> Presidente actualizado");
    }
}

// ============================================================
// DIRECTORIO (miembros internos del consejo / comités)
// ============================================================
if (Count("Directorio") == 0)
{
    Console.WriteLine("Sembrando Directorio (miembros)...");
    var miembros = new (string Nombre, string Cargo, string Descripcion, string Categoria)[]
    {
        // Consejo
        ("Lic. Juan Carlos Martínez Hernández", "Presidente",
         "Empresario con más de 25 años de experiencia en el sector comercial leonés. Comprometido con el crecimiento sostenible de la Cámara.",
         "Consejo Directivo"),
        ("Lic. María Fernanda Soto Pérez", "Vicepresidenta",
         "Especialista en desarrollo de negocios y vinculación institucional. Lidera proyectos de capacitación y fortalecimiento empresarial.",
         "Consejo Directivo"),
        ("C.P. Roberto Alvarado Núñez", "Tesorero",
         "Contador público con amplia experiencia en finanzas corporativas. Responsable de la salud financiera de la Cámara.",
         "Consejo Directivo"),
        ("Lic. Ana Patricia Reyes López", "Secretaria",
         "Abogada corporativa especializada en derecho mercantil. Coordina las sesiones y actas del Consejo.",
         "Consejo Directivo"),

        // Comités
        ("Ing. Eduardo Ramírez Salinas", "Coordinador Comité de Comercio",
         "Promueve iniciativas para fortalecer el comercio establecido y combatir el comercio informal en la ciudad.",
         "Comités"),
        ("Lic. Sandra Bautista Mora", "Coordinadora Comité de Turismo",
         "Impulsa proyectos para posicionar a León como destino turístico de negocios y entretenimiento.",
         "Comités"),
        ("Mtra. Verónica Gómez Torres", "Coordinadora Comité de Mujeres Empresarias",
         "Lidera iniciativas para visibilizar y potenciar el liderazgo femenino dentro del sector empresarial.",
         "Comités"),
        ("Ing. Carlos Mendoza Vargas", "Coordinador Comité de Innovación",
         "Acerca tecnología y herramientas digitales a las PyMEs afiliadas para acelerar su transformación.",
         "Comités"),
    };

    foreach (var m in miembros)
    {
        Insert(
            "INSERT INTO Directorio (Nombre, Cargo, Descripcion, Categoria, ImagenUrl) VALUES (@n, @c, @d, @cat, @i)",
            ("@n", m.Nombre), ("@c", m.Cargo), ("@d", m.Descripcion),
            ("@cat", m.Categoria), ("@i", Imagen));
    }
    Console.WriteLine($"  -> {miembros.Length} miembros insertados");
}
else
{
    Console.WriteLine($"Directorio ya tiene {Count("Directorio")} registros, se omite.");
}

// ============================================================
// EMPRESAS DIRECTORIO (directorio comercial público)
// Solo agregamos si las nuevas aún no existen (idempotente por Email)
// ============================================================
{
    Console.WriteLine("Sembrando EmpresasDirectorio...");
    var empresas = new (string Nombre, string Giro, string Descripcion, string Telefono,
                        string Email, string? SitioWeb, string? Facebook, string? Instagram)[]
    {
        ("Calzado Don Pancho", "Calzado y peletería",
         "Fábrica leonesa con 40 años fabricando calzado de piel para caballero. Venta al mayoreo y menudeo.",
         "477 712 3456", "ventas@donpancho.mx",
         "https://donpancho.mx", "https://facebook.com/donpancho", "https://instagram.com/donpancho_calzado"),

        ("Tortillería La Espiga de Oro", "Alimentos",
         "Tortillas hechas a mano con maíz 100% mexicano. Servicio a domicilio y eventos en todo León.",
         "477 720 1122", "contacto@laespigadeoro.com",
         null, "https://facebook.com/laespigadeoro", null),

        ("Constructora Bajío Activo", "Construcción",
         "Más de 15 años desarrollando proyectos residenciales, comerciales e industriales en el Bajío.",
         "477 765 4321", "info@bajioactivo.com",
         "https://bajioactivo.com", "https://facebook.com/bajioactivo", "https://instagram.com/bajio.activo"),

        ("Notaría Pública 24", "Servicios legales",
         "Servicios notariales: escrituración, testamentos, poderes y constitución de sociedades.",
         "477 715 9988", "notaria24@leon.gob.mx",
         "https://notaria24leon.mx", null, null),

        ("Boutique Mariana", "Moda y accesorios",
         "Ropa de diseñador para dama con las últimas tendencias. Visítanos en Plaza Mayor.",
         "477 718 4477", "hola@boutiquemariana.mx",
         null, "https://facebook.com/boutiquemariana", "https://instagram.com/boutiquemarianaleon"),

        ("Tech Solutions Bajío", "Tecnología",
         "Desarrollo de software, soporte técnico y consultoría TI para empresas del Bajío.",
         "477 700 8899", "ventas@techbajio.com",
         "https://techbajio.com", "https://facebook.com/techsolutionsbajio", "https://instagram.com/techbajio"),

        ("Restaurante Las Brasas", "Restaurantes",
         "Cortes finos a la parrilla, ambiente familiar y servicio de primer nivel en el corazón de León.",
         "477 711 5566", "reservas@lasbrasas.mx",
         "https://lasbrasas.mx", "https://facebook.com/lasbrasasleon", "https://instagram.com/lasbrasasleon"),

        ("Farmacia San Rafael", "Salud",
         "Más de 30 años cuidando la salud de las familias leonesas. Servicio 24 horas y entrega a domicilio.",
         "477 716 2233", "atencion@farmaciasanrafael.com",
         null, "https://facebook.com/farmaciasanrafael", null),

        ("Hotel Plaza Centro", "Turismo y hospedaje",
         "Hotel céntrico, cómodo y económico. Ideal para viajes de negocios y turismo en León.",
         "477 714 3300", "reservaciones@hotelplazacentro.com",
         "https://hotelplazacentroleon.com", "https://facebook.com/hotelplazacentro", "https://instagram.com/hotelplazacentro_leon"),

        ("Agencia Creativa Pixel", "Publicidad y diseño",
         "Branding, diseño gráfico, marketing digital y producción audiovisual para impulsar tu negocio.",
         "477 760 7788", "hola@agenciapixel.mx",
         "https://agenciapixel.mx", "https://facebook.com/agenciapixel", "https://instagram.com/agenciapixel.mx"),
    };

    int insertadas = 0;
    foreach (var e in empresas)
    {
        // Evitamos duplicados al re-ejecutar el seeder
        using var existe = conn.CreateCommand();
        existe.CommandText = "SELECT COUNT(*) FROM EmpresasDirectorio WHERE Email = @e";
        var pe = existe.CreateParameter(); pe.ParameterName = "@e"; pe.Value = e.Email;
        existe.Parameters.Add(pe);
        if ((long)(existe.ExecuteScalar() ?? 0L) > 0) continue;

        Insert(
            @"INSERT INTO EmpresasDirectorio
              (Nombre, Giro, Descripcion, Telefono, Email, RutaLogo, SitioWeb, FacebookUrl, InstagramUrl, Activo)
              VALUES (@n, @g, @d, @t, @e, @r, @w, @f, @i, 1)",
            ("@n", e.Nombre), ("@g", e.Giro), ("@d", e.Descripcion),
            ("@t", e.Telefono), ("@e", e.Email), ("@r", Imagen),
            ("@w", (object?)e.SitioWeb), ("@f", (object?)e.Facebook), ("@i", (object?)e.Instagram));
        insertadas++;
    }
    Console.WriteLine($"  -> {insertadas} empresas nuevas insertadas (existentes intactas)");
}

Console.WriteLine();
Console.WriteLine("=== Resumen ===");
Console.WriteLine($"Noticias:           {Count("Noticias")}");
Console.WriteLine($"Eventos:            {Count("Eventos")}");
Console.WriteLine($"Presidentes:        {Count("Presidentes")}");
Console.WriteLine($"Directorio:         {Count("Directorio")}");
Console.WriteLine($"EmpresasDirectorio: {Count("EmpresasDirectorio")}");
try { Console.WriteLine($"ContenidosSitio:    {Count("ContenidosSitio")}  (intacto)"); }
catch { Console.WriteLine("ContenidosSitio:    (tabla aún no creada, se crea al iniciar el server)"); }
Console.WriteLine("Listo.");
return 0;
