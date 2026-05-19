# ============================================================
# Seeder REMOTO — puebla la BD de producción (Railway) usando
# los endpoints admin del API.
#
# Construye multipart UTF-8 manualmente con Invoke-WebRequest
# (NO usa curl.exe, que en Windows manda los acentos en CP1252
# y rompe el encoding).
#
# Uso:
#   .\Seeder\SeedRemote.ps1 -Email "admin@canaco.com" -Password "pass"
#
# Opciones:
#   -Reset      Borra primero todo lo seedeado anteriormente
#               (noticias, eventos, miembros del directorio,
#                empresas con email de seed). Sirve para limpiar
#               datos con mojibake.
#   -ApiUrl     URL base del API (default: producción Railway)
#   -ImagePath  ruta a la imagen (default: Server\uploads\seed\descarga.jpg)
#
# NO toca banners (ContenidoSitio) ni datos del usuario
# (afiliados, contacto).
# ============================================================

param(
    [Parameter(Mandatory=$true)] [string] $Email,
    [Parameter(Mandatory=$true)] [string] $Password,
    [switch] $Reset,
    [string] $ApiUrl = "https://canacoleon-production.up.railway.app/api",
    [string] $ImagePath = "Server\uploads\seed\descarga.jpg"
)

$ErrorActionPreference = "Stop"
# Pero para los POST individuales NO queremos que un fallo aborte todo;
# usamos try/catch local y seguimos con el siguiente.
# Forzar UTF-8 en el output de la consola (para que los logs no salgan rotos)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

if (-not (Test-Path $ImagePath)) {
    Write-Error "No se encontró la imagen en $ImagePath. Corre el script desde la raíz del repo."
    exit 1
}

# ---------- CLIENTE HTTP (System.Net.Http.HttpClient) ----------
# Usamos HttpClient en vez de Invoke-WebRequest porque maneja multipart
# UTF-8 correctamente en PowerShell 5.1, sin sorpresas de encoding.
Add-Type -AssemblyName System.Net.Http
$httpClient = New-Object System.Net.Http.HttpClient
$httpClient.Timeout = [System.TimeSpan]::FromSeconds(60)

# ---------- LOGIN ----------
Write-Host "Conectando a $ApiUrl ..." -ForegroundColor Cyan
$loginJson = @{ email = $Email; password = $Password } | ConvertTo-Json
$loginContent = New-Object System.Net.Http.StringContent(
    $loginJson, [System.Text.Encoding]::UTF8, "application/json")
try {
    $loginResp = $httpClient.PostAsync("$ApiUrl/auth/login", $loginContent).Result
    $loginBody = $loginResp.Content.ReadAsStringAsync().Result
    if (-not $loginResp.IsSuccessStatusCode) {
        Write-Error "Login falló ($($loginResp.StatusCode)): $loginBody"
        exit 1
    }
    $token = ($loginBody | ConvertFrom-Json).token
} catch {
    Write-Error "Login falló: $($_.Exception.Message)"
    exit 1
}
if (-not $token) { Write-Error "No vino token en la respuesta de login."; exit 1 }
Write-Host "Login OK." -ForegroundColor Green
$httpClient.DefaultRequestHeaders.Authorization =
    New-Object System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", $token)

# ---------- HELPER: POST multipart con UTF-8 garantizado ----------
function Send-Multipart {
    param(
        [string] $Url,
        [hashtable] $Fields,
        [string] $FileField,
        [string] $FilePath
    )

    $content = New-Object System.Net.Http.MultipartFormDataContent
    try {
        foreach ($k in $Fields.Keys) {
            $sc = New-Object System.Net.Http.StringContent(
                [string]$Fields[$k], [System.Text.Encoding]::UTF8)
            # Limpiar el charset del Content-Type para que ASP.NET Core no lo
            # interprete raro; el form-data usa el charset del body
            $sc.Headers.ContentType = $null
            $content.Add($sc, $k)
        }

        if ($FilePath) {
            $fileBytes = [System.IO.File]::ReadAllBytes($FilePath)
            $bc = New-Object System.Net.Http.ByteArrayContent(,$fileBytes)
            $bc.Headers.ContentType =
                [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("image/jpeg")
            $content.Add($bc, $FileField, (Split-Path $FilePath -Leaf))
        }

        $resp = $httpClient.PostAsync($Url, $content).Result
        $body = $resp.Content.ReadAsStringAsync().Result
        if (-not $resp.IsSuccessStatusCode) {
            throw "$($resp.StatusCode): $body"
        }
        return $body
    } finally {
        $content.Dispose()
    }
}

# Helper DELETE
function Send-Delete {
    param([string] $Url)
    try {
        $resp = $httpClient.DeleteAsync($Url).Result
        return $resp.IsSuccessStatusCode
    } catch {
        return $false
    }
}

# ---------- DATOS A SEMBRAR ----------
$noticias = @(
    @{ Titulo="CANACO León impulsa el comercio local con nueva campaña";
       Resumen="La Cámara Nacional de Comercio en León lanza una iniciativa para fortalecer a las pequeñas y medianas empresas locales mediante capacitaciones gratuitas, asesoría fiscal y promoción digital.";
       Fecha="2026-05-10" },
    @{ Titulo="Firmamos convenio con la Universidad para impulsar el emprendimiento";
       Resumen="CANACO León firmó un convenio de colaboración con instituciones educativas para acercar a los estudiantes al ecosistema empresarial y fomentar la creación de nuevos negocios en la región.";
       Fecha="2026-05-02" },
    @{ Titulo="Resultados positivos en la temporada de ventas 2026";
       Resumen="Los comercios afiliados a CANACO León reportaron un incremento del 12% en ventas durante el primer trimestre del año, gracias a las estrategias coordinadas y al impulso del consumo local.";
       Fecha="2026-04-22" },
    @{ Titulo="Nuevo programa de financiamiento para afiliados";
       Resumen="Presentamos un esquema de créditos blandos en alianza con instituciones bancarias, diseñado especialmente para los socios de la Cámara que buscan expandir o modernizar su negocio.";
       Fecha="2026-04-08" },
    @{ Titulo="CANACO León premia a los Mejores Comercios del Año";
       Resumen="Reconocimos la trayectoria, innovación y compromiso de los empresarios leoneses que han destacado por su contribución al desarrollo económico y social de la ciudad.";
       Fecha="2026-03-25" },
    @{ Titulo="Capacitación gratuita en facturación electrónica 4.0";
       Resumen="Más de 200 afiliados participaron en el taller para actualizarse en los requerimientos del SAT y mantener sus operaciones al día sin contratiempos.";
       Fecha="2026-03-12" }
)

$eventos = @(
    @{ Titulo="Expo Negocios León 2026";
       Descripcion="El evento empresarial más grande del Bajío reúne a expositores, conferencistas y emprendedores de todo el país. Networking, ruedas de negocio y conferencias magistrales.";
       Fecha="2026-06-15"; Lugar="Poliforum León" },
    @{ Titulo="Taller: Marketing Digital para PyMEs";
       Descripcion="Aprende las estrategias clave para posicionar tu negocio en redes sociales, atraer clientes y aumentar tus ventas con herramientas accesibles.";
       Fecha="2026-05-28"; Lugar="Auditorio CANACO León" },
    @{ Titulo="Foro de Mujeres Empresarias";
       Descripcion="Encuentro para impulsar el liderazgo femenino en los negocios, con ponentes destacadas, paneles y oportunidades de mentoría.";
       Fecha="2026-06-08"; Lugar="Hotel Real de Minas" },
    @{ Titulo="Networking Mensual de Afiliados";
       Descripcion="Reunión exclusiva para socios CANACO. Una oportunidad ideal para conectar con otros empresarios, generar alianzas y compartir experiencias.";
       Fecha="2026-05-25"; Lugar="Salón Cibeles, CANACO León" },
    @{ Titulo="Curso Intensivo de Comercio Exterior";
       Descripcion="Programa de 4 sesiones para conocer los procedimientos, tratados y oportunidades del comercio internacional desde León.";
       Fecha="2026-07-02"; Lugar="Aula Virtual CANACO" },
    @{ Titulo="Cena de Gala 2026 - Aniversario CANACO";
       Descripcion="Celebramos un año más de servicio al comercio leonés con una noche de reconocimientos, música en vivo y networking de primer nivel.";
       Fecha="2026-09-12"; Lugar="Hotel Hot León" }
)

# IMPORTANTE: las categorías deben coincidir con las del frontend
# (Client/src/components/DirectorioSection.jsx):
#   "Consejeros", "ComiteEjecutivo", "Secciones", "Vicepresidencias"
$miembros = @(
    @{ Nombre="Lic. Juan Carlos Martínez Hernández"; Cargo="Presidente";
       Descripcion="Empresario con más de 25 años de experiencia en el sector comercial leonés. Comprometido con el crecimiento sostenible de la Cámara.";
       Categoria="ComiteEjecutivo" },
    @{ Nombre="Lic. María Fernanda Soto Pérez"; Cargo="Vicepresidenta";
       Descripcion="Especialista en desarrollo de negocios y vinculación institucional. Lidera proyectos de capacitación y fortalecimiento empresarial.";
       Categoria="ComiteEjecutivo" },
    @{ Nombre="C.P. Roberto Alvarado Núñez"; Cargo="Tesorero";
       Descripcion="Contador público con amplia experiencia en finanzas corporativas. Responsable de la salud financiera de la Cámara.";
       Categoria="ComiteEjecutivo" },
    @{ Nombre="Lic. Ana Patricia Reyes López"; Cargo="Secretaria";
       Descripcion="Abogada corporativa especializada en derecho mercantil. Coordina las sesiones y actas del Consejo.";
       Categoria="ComiteEjecutivo" },
    @{ Nombre="Ing. Eduardo Ramírez Salinas"; Cargo="Coordinador Comité de Comercio";
       Descripcion="Promueve iniciativas para fortalecer el comercio establecido y combatir el comercio informal en la ciudad.";
       Categoria="Secciones" },
    @{ Nombre="Lic. Sandra Bautista Mora"; Cargo="Coordinadora Comité de Turismo";
       Descripcion="Impulsa proyectos para posicionar a León como destino turístico de negocios y entretenimiento.";
       Categoria="Secciones" },
    @{ Nombre="Mtra. Verónica Gómez Torres"; Cargo="Coordinadora Comité de Mujeres Empresarias";
       Descripcion="Lidera iniciativas para visibilizar y potenciar el liderazgo femenino dentro del sector empresarial.";
       Categoria="Secciones" },
    @{ Nombre="Ing. Carlos Mendoza Vargas"; Cargo="Coordinador Comité de Innovación";
       Descripcion="Acerca tecnología y herramientas digitales a las PyMEs afiliadas para acelerar su transformación.";
       Categoria="Secciones" }
)

$empresas = @(
    @{ Nombre="Calzado Don Pancho"; Giro="Calzado y peletería";
       Descripcion="Fábrica leonesa con 40 años fabricando calzado de piel para caballero. Venta al mayoreo y menudeo.";
       Telefono="477 712 3456"; Email="ventas@donpancho.mx";
       SitioWeb="https://donpancho.mx"; Facebook="https://facebook.com/donpancho"; Instagram="https://instagram.com/donpancho_calzado" },
    @{ Nombre="Tortillería La Espiga de Oro"; Giro="Alimentos";
       Descripcion="Tortillas hechas a mano con maíz 100% mexicano. Servicio a domicilio y eventos en todo León.";
       Telefono="477 720 1122"; Email="contacto@laespigadeoro.com";
       SitioWeb=""; Facebook="https://facebook.com/laespigadeoro"; Instagram="" },
    @{ Nombre="Constructora Bajío Activo"; Giro="Construcción";
       Descripcion="Más de 15 años desarrollando proyectos residenciales, comerciales e industriales en el Bajío.";
       Telefono="477 765 4321"; Email="info@bajioactivo.com";
       SitioWeb="https://bajioactivo.com"; Facebook="https://facebook.com/bajioactivo"; Instagram="https://instagram.com/bajio.activo" },
    @{ Nombre="Notaría Pública 24"; Giro="Servicios legales";
       Descripcion="Servicios notariales: escrituración, testamentos, poderes y constitución de sociedades.";
       Telefono="477 715 9988"; Email="notaria24@leon.gob.mx";
       SitioWeb="https://notaria24leon.mx"; Facebook=""; Instagram="" },
    @{ Nombre="Boutique Mariana"; Giro="Moda y accesorios";
       Descripcion="Ropa de diseñador para dama con las últimas tendencias. Visítanos en Plaza Mayor.";
       Telefono="477 718 4477"; Email="hola@boutiquemariana.mx";
       SitioWeb=""; Facebook="https://facebook.com/boutiquemariana"; Instagram="https://instagram.com/boutiquemarianaleon" },
    @{ Nombre="Tech Solutions Bajío"; Giro="Tecnología";
       Descripcion="Desarrollo de software, soporte técnico y consultoría TI para empresas del Bajío.";
       Telefono="477 700 8899"; Email="ventas@techbajio.com";
       SitioWeb="https://techbajio.com"; Facebook="https://facebook.com/techsolutionsbajio"; Instagram="https://instagram.com/techbajio" },
    @{ Nombre="Restaurante Las Brasas"; Giro="Restaurantes";
       Descripcion="Cortes finos a la parrilla, ambiente familiar y servicio de primer nivel en el corazón de León.";
       Telefono="477 711 5566"; Email="reservas@lasbrasas.mx";
       SitioWeb="https://lasbrasas.mx"; Facebook="https://facebook.com/lasbrasasleon"; Instagram="https://instagram.com/lasbrasasleon" },
    @{ Nombre="Farmacia San Rafael"; Giro="Salud";
       Descripcion="Más de 30 años cuidando la salud de las familias leonesas. Servicio 24 horas y entrega a domicilio.";
       Telefono="477 716 2233"; Email="atencion@farmaciasanrafael.com";
       SitioWeb=""; Facebook="https://facebook.com/farmaciasanrafael"; Instagram="" },
    @{ Nombre="Hotel Plaza Centro"; Giro="Turismo y hospedaje";
       Descripcion="Hotel céntrico, cómodo y económico. Ideal para viajes de negocios y turismo en León.";
       Telefono="477 714 3300"; Email="reservaciones@hotelplazacentro.com";
       SitioWeb="https://hotelplazacentroleon.com"; Facebook="https://facebook.com/hotelplazacentro"; Instagram="https://instagram.com/hotelplazacentro_leon" },
    @{ Nombre="Agencia Creativa Pixel"; Giro="Publicidad y diseño";
       Descripcion="Branding, diseño gráfico, marketing digital y producción audiovisual para impulsar tu negocio.";
       Telefono="477 760 7788"; Email="hola@agenciapixel.mx";
       SitioWeb="https://agenciapixel.mx"; Facebook="https://facebook.com/agenciapixel"; Instagram="https://instagram.com/agenciapixel.mx" }
)

# Emails que considera "del seeder" (para reset selectivo de empresas)
$seedEmails = @($empresas | ForEach-Object { $_.Email })

# ---------- RESET (opcional) ----------
if ($Reset) {
    Write-Host "`n=== MODO RESET: borrando datos previos del seeder ===" -ForegroundColor Magenta

    Write-Host "Borrando todas las noticias..." -ForegroundColor DarkYellow
    $existentes = Invoke-RestMethod -Uri "$ApiUrl/noticias" -Method Get
    foreach ($n in $existentes) {
        if (Send-Delete "$ApiUrl/noticias/$($n.id)") {
            Write-Host "  - noticia $($n.id) borrada" -ForegroundColor DarkGray
        }
    }

    Write-Host "Borrando todos los eventos..." -ForegroundColor DarkYellow
    $existentes = Invoke-RestMethod -Uri "$ApiUrl/eventos" -Method Get
    foreach ($e in $existentes) {
        if (Send-Delete "$ApiUrl/eventos/$($e.id)") {
            Write-Host "  - evento $($e.id) borrado" -ForegroundColor DarkGray
        }
    }

    Write-Host "Borrando todos los miembros del directorio..." -ForegroundColor DarkYellow
    $existentes = Invoke-RestMethod -Uri "$ApiUrl/directorio" -Method Get
    foreach ($m in $existentes) {
        if (Send-Delete "$ApiUrl/directorio/$($m.id)") {
            Write-Host "  - miembro $($m.id) borrado" -ForegroundColor DarkGray
        }
    }

    Write-Host "Borrando empresas del seeder (por email)..." -ForegroundColor DarkYellow
    $existentes = Invoke-RestMethod -Uri "$ApiUrl/empresadirectorio" -Method Get
    foreach ($e in $existentes) {
        if ($seedEmails -contains $e.email) {
            if (Send-Delete "$ApiUrl/empresadirectorio/$($e.id)") {
                Write-Host "  - empresa $($e.id) ($($e.nombre)) borrada" -ForegroundColor DarkGray
            }
        }
    }

    Write-Host "Reset listo." -ForegroundColor Magenta
}

# ---------- NOTICIAS ----------
Write-Host "`n--- Noticias ---" -ForegroundColor Yellow
$existentes = Invoke-RestMethod -Uri "$ApiUrl/noticias" -Method Get
$titulosEx = @($existentes | ForEach-Object { $_.titulo })
foreach ($n in $noticias) {
    if ($titulosEx -contains $n.Titulo) {
        Write-Host "  ya existe: $($n.Titulo)" -ForegroundColor DarkGray
        continue
    }
    try {
        Send-Multipart -Url "$ApiUrl/noticias" -FileField "Imagen" -FilePath $ImagePath -Fields @{
            Titulo = $n.Titulo
            Resumen = $n.Resumen
            FechaPublicacion = $n.Fecha
        } | Out-Null
        Write-Host "  + $($n.Titulo)" -ForegroundColor Green
    } catch {
        Write-Host "  X ERROR en '$($n.Titulo)': $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ---------- EVENTOS ----------
Write-Host "`n--- Eventos ---" -ForegroundColor Yellow
$existentes = Invoke-RestMethod -Uri "$ApiUrl/eventos" -Method Get
$titulosEx = @($existentes | ForEach-Object { $_.titulo })
foreach ($e in $eventos) {
    if ($titulosEx -contains $e.Titulo) {
        Write-Host "  ya existe: $($e.Titulo)" -ForegroundColor DarkGray
        continue
    }
    try {
        Send-Multipart -Url "$ApiUrl/eventos" -FileField "Imagen" -FilePath $ImagePath -Fields @{
            Titulo = $e.Titulo
            Descripcion = $e.Descripcion
            Fecha = $e.Fecha
            Lugar = $e.Lugar
        } | Out-Null
        Write-Host "  + $($e.Titulo)" -ForegroundColor Green
    } catch {
        Write-Host "  X ERROR en '$($e.Titulo)': $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ---------- PRESIDENTE ----------
Write-Host "`n--- Presidente ---" -ForegroundColor Yellow
try {
    Send-Multipart -Url "$ApiUrl/presidente" -FileField "Imagen" -FilePath $ImagePath -Fields @{
        Nombre  = "Lic. Juan Carlos Martínez Hernández"
        Cargo   = "Presidente del Consejo Directivo 2025-2027"
        Mensaje = "Es un honor representar a la comunidad empresarial de León como Presidente de CANACO Servytur. Trabajamos día con día para impulsar el desarrollo del comercio, los servicios y el turismo en nuestra ciudad, generando oportunidades para nuestros afiliados y fortaleciendo el tejido económico de la región. Te invitamos a ser parte de esta gran familia que durante décadas ha sido motor del crecimiento de León."
    } | Out-Null
    Write-Host "  Presidente upsert OK" -ForegroundColor Green
} catch {
    Write-Host "  X ERROR en Presidente: $($_.Exception.Message)" -ForegroundColor Red
}

# ---------- DIRECTORIO ----------
Write-Host "`n--- Directorio (miembros) ---" -ForegroundColor Yellow
$existentes = Invoke-RestMethod -Uri "$ApiUrl/directorio" -Method Get
$nombresEx = @($existentes | ForEach-Object { $_.nombre })
foreach ($m in $miembros) {
    if ($nombresEx -contains $m.Nombre) {
        Write-Host "  ya existe: $($m.Nombre)" -ForegroundColor DarkGray
        continue
    }
    try {
        Send-Multipart -Url "$ApiUrl/directorio" -FileField "Imagen" -FilePath $ImagePath -Fields @{
            Nombre = $m.Nombre; Cargo = $m.Cargo;
            Descripcion = $m.Descripcion; Categoria = $m.Categoria
        } | Out-Null
        Write-Host "  + $($m.Nombre) [$($m.Categoria)]" -ForegroundColor Green
    } catch {
        Write-Host "  X ERROR en '$($m.Nombre)': $($_.Exception.Message)" -ForegroundColor Red
    }
}

# ---------- EMPRESAS DIRECTORIO ----------
Write-Host "`n--- Empresas Directorio ---" -ForegroundColor Yellow
$existentes = Invoke-RestMethod -Uri "$ApiUrl/empresadirectorio" -Method Get
$emailsEx = @($existentes | ForEach-Object { $_.email })
foreach ($e in $empresas) {
    if ($emailsEx -contains $e.Email) {
        Write-Host "  ya existe: $($e.Nombre)" -ForegroundColor DarkGray
        continue
    }
    $fields = @{
        Nombre = $e.Nombre; Giro = $e.Giro; Descripcion = $e.Descripcion;
        Telefono = $e.Telefono; Email = $e.Email
    }
    if ($e.SitioWeb)  { $fields["SitioWeb"]    = $e.SitioWeb }
    if ($e.Facebook)  { $fields["FacebookUrl"] = $e.Facebook }
    if ($e.Instagram) { $fields["InstagramUrl"]= $e.Instagram }

    try {
        Send-Multipart -Url "$ApiUrl/empresadirectorio" -FileField "Logo" -FilePath $ImagePath -Fields $fields | Out-Null
        Write-Host "  + $($e.Nombre)" -ForegroundColor Green
    } catch {
        Write-Host "  X ERROR en '$($e.Nombre)': $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Listo ===" -ForegroundColor Cyan
Write-Host "Verifica en https://www.canacoleon.org/" -ForegroundColor Cyan
