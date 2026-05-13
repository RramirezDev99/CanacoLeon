import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { API_URL, apiFetch } from "../../lib/api";

// Base del servidor (sin "/api") — la usamos para mostrar imágenes que vienen
// como rutas relativas: ej. "/uploads/empresas/logo.jpg"
const FILES_BASE = API_URL.replace(/\/api\/?$/, "");

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("noticias");
  const [mensaje, setMensaje] = useState(null);
  const [editId, setEditId] = useState(null);

  // --- ESTADOS DE DATOS ---
  const [listaNoticias, setListaNoticias] = useState([]);
  const [listaEventos, setListaEventos] = useState([]);
  const [listaDirectorio, setListaDirectorio] = useState([]);
  const [listaComercial, setListaComercial] = useState([]);

  // --- FORMULARIOS ---
  const [newsForm, setNewsForm] = useState({ titulo: "", resumen: "", fechaPublicacion: "", imagen: null });
  const [eventForm, setEventForm] = useState({ titulo: "", descripcion: "", fecha: "", lugar: "", imagen: null });
  const [presidentForm, setPresidentForm] = useState({ nombre: "", cargo: "", mensaje: "", imagen: null });
  const [dirForm, setDirForm] = useState({ nombre: "", cargo: "", descripcion: "", categoria: "Consejeros", imagen: null });
  const [comercialForm, setComercialForm] = useState({
    nombre: "", giro: "", descripcion: "", telefono: "", email: "", sitioWeb: "", facebookUrl: "", instagramUrl: "", imagen: null
  });

  // --- CONTENIDO DEL SITIO (misión, visión, valores, hero) ---
  const [contenidoMap, setContenidoMap] = useState({});
  const contenidoKeys = [
    { clave: "mision", label: "Misión", placeholder: "Describe la misión de CANACO León...", multiline: true },
    { clave: "vision", label: "Visión", placeholder: "Describe la visión de CANACO León...", multiline: true },
    { clave: "valores", label: "Valores", placeholder: "Lista los valores de CANACO León...", multiline: true },
    { clave: "hero_titulo", label: "Hero — Título", placeholder: "Ej: CANACO SERVyTUR LEÓN", multiline: false },
    { clave: "hero_subtitulo", label: "Hero — Subtítulo", placeholder: "Ej: Cámara Nacional de Comercio, Servicios y Turismo", multiline: false },
    { clave: "hero_descripcion", label: "Hero — Descripción", placeholder: "Ej: Impulsando el desarrollo empresarial de León", multiline: false },
  ];

  // Carga las listas para todas las tabs. Los GET son públicos, así que no hace falta token.
  const cargarDatos = () => {
    fetch(`${API_URL}/noticias`).then(res => res.json()).then(data => setListaNoticias(data));
    fetch(`${API_URL}/eventos`).then(res => res.json()).then(data => setListaEventos(data));
    fetch(`${API_URL}/directorio`).then(res => res.json()).then(data => setListaDirectorio(data));
    fetch(`${API_URL}/EmpresaDirectorio`).then(res => res.json()).then(data => setListaComercial(data));
    fetch(`${API_URL}/presidente`).then(res => res.json()).then(data => data && setPresidentForm({ ...data, imagen: null })).catch(() => {});
    fetch(`${API_URL}/ContenidoSitio`).then(res => res.json()).then(data => {
      const map = {};
      (data || []).forEach(item => { map[item.clave] = { valor: item.valor, imagenUrl: item.imagenUrl }; });
      setContenidoMap(map);
    }).catch(() => {});
  };

  useEffect(() => { cargarDatos(); }, []);

  const resetAll = () => {
    setEditId(null);
    setMensaje(null);
    setNewsForm({ titulo: "", resumen: "", fechaPublicacion: "", imagen: null });
    setEventForm({ titulo: "", descripcion: "", fecha: "", lugar: "", imagen: null });
    setDirForm({ nombre: "", cargo: "", descripcion: "", categoria: "Consejeros", imagen: null });
    setComercialForm({ nombre: "", giro: "", descripcion: "", telefono: "", email: "", sitioWeb: "", facebookUrl: "", instagramUrl: "", imagen: null });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "noticias") setNewsForm({ ...newsForm, imagen: file });
    else if (type === "eventos") setEventForm({ ...eventForm, imagen: file });
    else if (type === "presidente") setPresidentForm({ ...presidentForm, imagen: file });
    else if (type === "directorio") setDirForm({ ...dirForm, imagen: file });
    else if (type === "comercial") setComercialForm({ ...comercialForm, imagen: file });
  };

  // Estado temporal para imágenes de contenido (se maneja aparte del contenidoMap)
  const [contenidoImagenes, setContenidoImagenes] = useState({});

  const submitContenido = async (clave) => {
    const formData = new FormData();
    formData.append("clave", clave);
    formData.append("valor", contenidoMap[clave]?.valor || "");
    if (contenidoImagenes[clave]) {
      formData.append("imagen", contenidoImagenes[clave]);
    }
    try {
      const response = await apiFetch(`/ContenidoSitio`, { method: "POST", body: formData });
      if (response.ok) {
        setMensaje({ type: "success", text: `"${clave}" actualizado` });
        setContenidoImagenes(prev => ({ ...prev, [clave]: null }));
        cargarDatos();
      } else {
        setMensaje({ type: "error", text: "Error al guardar" });
      }
    } catch {
      setMensaje({ type: "error", text: "Error de conexión" });
    }
  };

  const formatURL = (url) => {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
  };

  // DELETE — usa apiFetch para mandar el token JWT en el header Authorization.
  // Sin token el servidor responde 401 y apiFetch nos manda al login.
  const handleDelete = async (id, endpoint) => {
    if (!window.confirm("¿Eliminar este elemento permanentemente?")) return;
    try {
      const response = await apiFetch(`/${endpoint}/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMensaje({ type: "success", text: "Eliminado de la base de datos" });
        cargarDatos();
      }
    } catch (error) { console.error(error); }
  };

  // --- SUBMITS (todos usan apiFetch para incluir el token) ---
  const submitNoticia = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", newsForm.titulo);
    formData.append("resumen", newsForm.resumen);
    formData.append("fechaPublicacion", newsForm.fechaPublicacion);
    if (newsForm.imagen) formData.append("imagen", newsForm.imagen);
    const path = editId ? `/noticias/${editId}` : `/noticias`;
    await apiFetch(path, { method: editId ? "PUT" : "POST", body: formData });
    resetAll(); cargarDatos();
    setMensaje({ type: "success", text: "Noticia guardada" });
  };

  const submitEvento = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", eventForm.titulo);
    formData.append("descripcion", eventForm.descripcion);
    formData.append("fecha", eventForm.fecha);
    formData.append("lugar", eventForm.lugar);
    if (eventForm.imagen) formData.append("imagen", eventForm.imagen);
    const path = editId ? `/eventos/${editId}` : `/eventos`;
    await apiFetch(path, { method: editId ? "PUT" : "POST", body: formData });
    resetAll(); cargarDatos();
    setMensaje({ type: "success", text: "Evento guardado" });
  };

  const submitPresidente = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", presidentForm.nombre);
    formData.append("cargo", presidentForm.cargo);
    formData.append("mensaje", presidentForm.mensaje);
    if (presidentForm.imagen) formData.append("imagen", presidentForm.imagen);
    await apiFetch(`/presidente`, { method: "POST", body: formData });
    cargarDatos();
    setMensaje({ type: "success", text: "Presidente actualizado" });
  };

  const submitDirectorio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(dirForm).forEach(key => { if (dirForm[key]) formData.append(key, dirForm[key]); });
    await apiFetch(`/directorio`, { method: "POST", body: formData });
    resetAll(); cargarDatos();
    setMensaje({ type: "success", text: "Miembro guardado" });
  };

  const submitComercial = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Mapeo exacto a CrearEmpresaDto.cs
    formData.append("Nombre", comercialForm.nombre);
    formData.append("Giro", comercialForm.giro);
    formData.append("Descripcion", comercialForm.descripcion);
    formData.append("Telefono", comercialForm.telefono || "");
    formData.append("Email", comercialForm.email || "");
    formData.append("SitioWeb", formatURL(comercialForm.sitioWeb));
    formData.append("FacebookUrl", formatURL(comercialForm.facebookUrl));
    formData.append("InstagramUrl", formatURL(comercialForm.instagramUrl));

    if (comercialForm.imagen) {
      formData.append("Logo", comercialForm.imagen);
    }

    const path = editId ? `/EmpresaDirectorio/${editId}` : `/EmpresaDirectorio`;
    const method = editId ? "PUT" : "POST";

    try {
      const response = await apiFetch(path, { method, body: formData });
      if (response.ok) {
        setMensaje({ type: "success", text: editId ? "Empresa actualizada" : "Empresa guardada con éxito" });
        resetAll();
        cargarDatos();
      } else {
        setMensaje({ type: "error", text: "Error: Revisa los campos obligatorios" });
      }
    } catch (error) {
      setMensaje({ type: "error", text: "Error de conexión" });
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de Administración</h1>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === "noticias" ? "active" : ""}`} onClick={() => {setActiveTab("noticias"); resetAll();}}>Noticias</button>
        <button className={`tab-btn ${activeTab === "eventos" ? "active" : ""}`} onClick={() => {setActiveTab("eventos"); resetAll();}}>Eventos</button>
        <button className={`tab-btn ${activeTab === "presidente" ? "active" : ""}`} onClick={() => {setActiveTab("presidente"); resetAll();}}>Presidente</button>
        <button className={`tab-btn ${activeTab === "directorio" ? "active" : ""}`} onClick={() => {setActiveTab("directorio"); resetAll();}}>Directorio</button>
        <button className={`tab-btn ${activeTab === "comercial" ? "active" : ""}`} onClick={() => {setActiveTab("comercial"); resetAll();}}>D. Comercial</button>
        <button className={`tab-btn ${activeTab === "contenido" ? "active" : ""}`} onClick={() => {setActiveTab("contenido"); resetAll();}}>Contenido</button>
      </div>

      {mensaje && <div className={`message ${mensaje.type}`}>{mensaje.text}</div>}

      {/* --- NOTICIAS --- */}
      {activeTab === "noticias" && (
        <>
          <form className="upload-form" onSubmit={submitNoticia}>
            <h3>{editId ? "Editar Noticia" : "Nueva Noticia"}</h3>
            <input type="text" placeholder="Título" className="form-input" value={newsForm.titulo} onChange={e => setNewsForm({...newsForm, titulo: e.target.value})} required />
            <textarea placeholder="Resumen" className="form-textarea" value={newsForm.resumen} onChange={e => setNewsForm({...newsForm, resumen: e.target.value})} required />
            <input type="date" className="form-input" value={newsForm.fechaPublicacion} onChange={e => setNewsForm({...newsForm, fechaPublicacion: e.target.value})} required />
            <input type="file" className="file-input" onChange={e => handleFileChange(e, "noticias")} />
            <button type="submit" className="submit-btn">{editId ? "Actualizar" : "Publicar"}</button>
          </form>
          <div className="items-list">
            {listaNoticias.map(n => (
              <div key={n.id} className="list-item">
                <span>{n.titulo}</span>
                <div className="actions">
                  <button className="edit-action" onClick={() => {setEditId(n.id); setNewsForm(n); window.scrollTo(0,0);}}>Editar</button>
                  <button className="delete-action" onClick={() => handleDelete(n.id, "noticias")}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- EVENTOS --- */}
      {activeTab === "eventos" && (
        <>
          <form className="upload-form" onSubmit={submitEvento}>
            <h3>{editId ? "Editar Evento" : "Nuevo Evento"}</h3>
            <input type="text" placeholder="Título" className="form-input" value={eventForm.titulo} onChange={e => setEventForm({...eventForm, titulo: e.target.value})} required />
            <textarea placeholder="Descripción" className="form-textarea" value={eventForm.descripcion} onChange={e => setEventForm({...eventForm, descripcion: e.target.value})} required />
            <input type="date" className="form-input" value={eventForm.fecha} onChange={e => setEventForm({...eventForm, fecha: e.target.value})} required />
            <input type="text" placeholder="Lugar" className="form-input" value={eventForm.lugar} onChange={e => setEventForm({...eventForm, lugar: e.target.value})} required />
            <input type="file" className="file-input" onChange={e => handleFileChange(e, "eventos")} />
            <button type="submit" className="submit-btn">{editId ? "Actualizar" : "Guardar"}</button>
          </form>
          <div className="items-list">
            {listaEventos.map(ev => (
              <div key={ev.id} className="list-item">
                <span>{ev.titulo}</span>
                <div className="actions">
                  <button className="edit-action" onClick={() => {setEditId(ev.id); setEventForm(ev); window.scrollTo(0,0);}}>Editar</button>
                  <button className="delete-action" onClick={() => handleDelete(ev.id, "eventos")}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- PRESIDENTE --- */}
      {activeTab === "presidente" && (
        <form className="upload-form" onSubmit={submitPresidente}>
          <h3>Configurar Presidente</h3>
          <input type="text" placeholder="Nombre" className="form-input" value={presidentForm.nombre} onChange={e => setPresidentForm({...presidentForm, nombre: e.target.value})} required />
          <input type="text" placeholder="Cargo" className="form-input" value={presidentForm.cargo} onChange={e => setPresidentForm({...presidentForm, cargo: e.target.value})} required />
          <textarea placeholder="Mensaje" className="form-textarea" value={presidentForm.mensaje} onChange={e => setPresidentForm({...presidentForm, mensaje: e.target.value})} required />
          <input type="file" className="file-input" onChange={e => handleFileChange(e, "presidente")} />
          <button type="submit" className="submit-btn">Actualizar Presidente</button>
        </form>
      )}

      {/* --- DIRECTORIO (MIEMBROS) --- */}
      {activeTab === "directorio" && (
        <>
          <form className="upload-form" onSubmit={submitDirectorio}>
            <h3>Agregar Miembro</h3>
            <select className="form-input" value={dirForm.categoria} onChange={e => setDirForm({...dirForm, categoria: e.target.value})}>
              <option value="Consejeros">Consejeros</option>
              <option value="ComiteEjecutivo">Comité Ejecutivo</option>
              <option value="Vicepresidencias">Vicepresidencias</option>
            </select>
            <input type="text" placeholder="Nombre" className="form-input" value={dirForm.nombre} onChange={e => setDirForm({...dirForm, nombre: e.target.value})} required />
            <input type="text" placeholder="Cargo" className="form-input" value={dirForm.cargo} onChange={e => setDirForm({...dirForm, cargo: e.target.value})} required />
            <input type="file" className="file-input" onChange={e => handleFileChange(e, "directorio")} />
            <button type="submit" className="submit-btn">Guardar Miembro</button>
          </form>
          <div className="items-list">
            {listaDirectorio.map(m => (
              <div key={m.id} className="list-item">
                <span>{m.nombre} <small>({m.categoria})</small></span>
                <button className="delete-action" onClick={() => handleDelete(m.id, "directorio")}>Borrar</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- DIRECTORIO COMERCIAL (EMPRESAS) --- */}
      {activeTab === "comercial" && (
        <>
          <form className="upload-form" onSubmit={submitComercial}>
            <h3>{editId ? "Editar Empresa" : "Nueva Empresa"}</h3>
            <div className="form-grid-2">
              <input type="text" placeholder="Nombre" className="form-input" value={comercialForm.nombre} onChange={e => setComercialForm({...comercialForm, nombre: e.target.value})} required />
              <input type="text" placeholder="Giro" className="form-input" value={comercialForm.giro} onChange={e => setComercialForm({...comercialForm, giro: e.target.value})} required />
            </div>
            <textarea placeholder="Descripción" className="form-textarea" value={comercialForm.descripcion} onChange={e => setComercialForm({...comercialForm, descripcion: e.target.value})} required />
            <div className="form-grid-2">
              <input type="text" placeholder="Teléfono" className="form-input" value={comercialForm.telefono} onChange={e => setComercialForm({...comercialForm, telefono: e.target.value})} required />
              <input type="email" placeholder="Email" className="form-input" value={comercialForm.email} onChange={e => setComercialForm({...comercialForm, email: e.target.value})} required />
            </div>
            <div className="form-grid-2">
              <input type="text" placeholder="Facebook URL" className="form-input" value={comercialForm.facebookUrl} onChange={e => setComercialForm({...comercialForm, facebookUrl: e.target.value})} />
              <input type="text" placeholder="Instagram URL" className="form-input" value={comercialForm.instagramUrl} onChange={e => setComercialForm({...comercialForm, instagramUrl: e.target.value})} />
            </div>
            <input type="text" placeholder="Sitio Web" className="form-input" value={comercialForm.sitioWeb} onChange={e => setComercialForm({...comercialForm, sitioWeb: e.target.value})} />
            <input type="file" className="file-input" onChange={e => handleFileChange(e, "comercial")} required={!editId} />
            <button type="submit" className="submit-btn">{editId ? "Actualizar" : "Guardar"}</button>
            {editId && <button type="button" className="cancel-btn" onClick={resetAll}>Cancelar</button>}
          </form>
          <div className="items-list">
            {listaComercial.map(c => (
              <div key={c.id} className="list-item">
                <img
                  src={`${FILES_BASE}${c.rutaLogo}`}
                  alt="Logo"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }}
                  onError={(e) => { e.target.src = "/default-new.png"; }}
                />
                <span><strong>{c.nombre}</strong> - {c.giro}</span>
                <div className="actions">
                  <button className="edit-action" onClick={() => {setEditId(c.id); setComercialForm({...c, imagen: null}); window.scrollTo(0,0);}}>Editar</button>
                  <button className="delete-action" onClick={() => handleDelete(c.id, "EmpresaDirectorio")}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- CONTENIDO DEL SITIO (MISIÓN, VISIÓN, VALORES, HERO) --- */}
      {activeTab === "contenido" && (
        <div className="contenido-admin">
          <h3>Contenido del Sitio</h3>
          <p style={{color:'#64748b', marginBottom:'20px', fontSize:'0.9rem'}}>
            Aquí puedes definir la misión, visión, valores y el texto del banner principal (Hero) de tu página.
          </p>
          {contenidoKeys.map(({ clave, label, placeholder, multiline }) => (
            <div key={clave} className="upload-form" style={{marginBottom:'20px'}}>
              <label style={{fontWeight:'600', marginBottom:'6px', display:'block'}}>{label}</label>
              {multiline ? (
                <textarea
                  className="form-textarea"
                  placeholder={placeholder}
                  value={contenidoMap[clave]?.valor || ""}
                  onChange={e => setContenidoMap(prev => ({
                    ...prev,
                    [clave]: { ...prev[clave], valor: e.target.value }
                  }))}
                  rows={4}
                />
              ) : (
                <input
                  type="text"
                  className="form-input"
                  placeholder={placeholder}
                  value={contenidoMap[clave]?.valor || ""}
                  onChange={e => setContenidoMap(prev => ({
                    ...prev,
                    [clave]: { ...prev[clave], valor: e.target.value }
                  }))}
                />
              )}

              {/* Mostrar imagen actual si existe */}
              {contenidoMap[clave]?.imagenUrl && (
                <div style={{margin:'8px 0'}}>
                  <img
                    src={`${FILES_BASE}${contenidoMap[clave].imagenUrl}`}
                    alt={label}
                    style={{maxWidth:'200px', maxHeight:'120px', borderRadius:'8px', objectFit:'cover'}}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              <input
                type="file"
                className="file-input"
                onChange={e => setContenidoImagenes(prev => ({ ...prev, [clave]: e.target.files[0] }))}
              />
              <button
                type="button"
                className="submit-btn"
                style={{marginTop:'8px'}}
                onClick={() => submitContenido(clave)}
              >
                Guardar {label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
