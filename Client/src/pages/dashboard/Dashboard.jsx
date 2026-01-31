import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const API_URL = "http://localhost:5286/api";

const Dashboard = () => {
  // Pestaña activa: noticias, eventos, presidente, directorio
  const [activeTab, setActiveTab] = useState("noticias");
  const [mensaje, setMensaje] = useState(null);

  // --- ESTADOS DE DATOS ---
  const [listaNoticias, setListaNoticias] = useState([]);
  const [listaEventos, setListaEventos] = useState([]);
  const [listaDirectorio, setListaDirectorio] = useState([]); // <--- NUEVO

  // --- FORMULARIOS ---
  const [editId, setEditId] = useState(null);

  const [newsForm, setNewsForm] = useState({
    titulo: "",
    resumen: "",
    fechaPublicacion: "",
    imagen: null,
  });
  const [eventForm, setEventForm] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    lugar: "",
    imagen: null,
  });
  const [presidentForm, setPresidentForm] = useState({
    nombre: "",
    cargo: "",
    mensaje: "",
    imagen: null,
  });
  const [currentPresidentImg, setCurrentPresidentImg] = useState(null);

  // NUEVO: Formulario Directorio
  const [dirForm, setDirForm] = useState({
    nombre: "",
    cargo: "",
    descripcion: "",
    categoria: "Consejeros",
    imagen: null,
  });

  // --- CARGAR DATOS ---
  const cargarDatos = () => {
    fetch(`${API_URL}/noticias`)
      .then((res) => res.json())
      .then((data) => setListaNoticias(data));
    fetch(`${API_URL}/eventos`)
      .then((res) => res.json())
      .then((data) => setListaEventos(data));
    fetch(`${API_URL}/directorio`)
      .then((res) => res.json())
      .then((data) => setListaDirectorio(data)); // <--- NUEVO

    // Presidente
    fetch(`${API_URL}/presidente`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setPresidentForm({
            nombre: data.nombre,
            cargo: data.cargo,
            mensaje: data.mensaje,
            imagen: null,
          });
          setCurrentPresidentImg(data.imagenUrl);
        }
      })
      .catch((err) => console.log("Sin presidente aun"));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- RESET GENERAL ---
  const resetAll = () => {
    setEditId(null);
    setMensaje(null);
    setNewsForm({
      titulo: "",
      resumen: "",
      fechaPublicacion: "",
      imagen: null,
    });
    setEventForm({
      titulo: "",
      descripcion: "",
      fecha: "",
      lugar: "",
      imagen: null,
    });
    setDirForm({
      nombre: "",
      cargo: "",
      descripcion: "",
      categoria: "Consejeros",
      imagen: null,
    });
  };

  // --- BORRAR GENÉRICO ---
  const handleDelete = async (id, endpoint) => {
    if (!window.confirm("¿Eliminar este elemento?")) return;
    try {
      await fetch(`${API_URL}/${endpoint}/${id}`, { method: "DELETE" });
      setMensaje({ type: "success", text: "Eliminado correctamente" });
      cargarDatos();
    } catch (error) {
      console.error(error);
    }
  };

  // --- HANDLERS (Inputs) ---
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "noticias") setNewsForm({ ...newsForm, imagen: file });
    else if (type === "eventos") setEventForm({ ...eventForm, imagen: file });
    else if (type === "presidente")
      setPresidentForm({ ...presidentForm, imagen: file });
    else if (type === "directorio") setDirForm({ ...dirForm, imagen: file });
  };

  // --- SUBMITS ---
  const submitNoticia = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", newsForm.titulo);
    formData.append("resumen", newsForm.resumen);
    formData.append("fechaPublicacion", newsForm.fechaPublicacion);
    if (newsForm.imagen) formData.append("imagen", newsForm.imagen);

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${API_URL}/noticias/${editId}`
      : `${API_URL}/noticias`;

    await fetch(url, { method, body: formData });
    resetAll();
    cargarDatos();
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

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/eventos/${editId}` : `${API_URL}/eventos`;

    await fetch(url, { method, body: formData });
    resetAll();
    cargarDatos();
    setMensaje({ type: "success", text: "Evento guardado" });
  };

  const submitPresidente = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", presidentForm.nombre);
    formData.append("cargo", presidentForm.cargo);
    formData.append("mensaje", presidentForm.mensaje);
    if (presidentForm.imagen) formData.append("imagen", presidentForm.imagen);

    await fetch(`${API_URL}/presidente`, { method: "POST", body: formData });
    cargarDatos();
    setMensaje({ type: "success", text: "Presidente actualizado" });
  };

  // NUEVO: Submit Directorio
  const submitDirectorio = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", dirForm.nombre);
    formData.append("cargo", dirForm.cargo);
    formData.append("descripcion", dirForm.descripcion);
    formData.append("categoria", dirForm.categoria);
    if (dirForm.imagen) formData.append("imagen", dirForm.imagen);

    await fetch(`${API_URL}/directorio`, { method: "POST", body: formData });
    resetAll();
    cargarDatos();
    setMensaje({ type: "success", text: "Miembro agregado" });
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de Administración</h1>

      {/* PESTAÑAS */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "noticias" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("noticias");
            resetAll();
          }}
        >
          Noticias
        </button>
        <button
          className={`tab-btn ${activeTab === "eventos" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("eventos");
            resetAll();
          }}
        >
          Eventos
        </button>
        <button
          className={`tab-btn ${activeTab === "presidente" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("presidente");
            resetAll();
          }}
        >
          👤 Presidente
        </button>
        <button
          className={`tab-btn ${activeTab === "directorio" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("directorio");
            resetAll();
          }}
        >
          📇 Directorio
        </button>
      </div>

      {mensaje && (
        <div className={`message ${mensaje.type}`}>{mensaje.text}</div>
      )}

      {/* --- NOTICIAS --- */}
      {activeTab === "noticias" && (
        <>
          <form className="upload-form" onSubmit={submitNoticia}>
            <h3>{editId ? "Editar Noticia" : "Nueva Noticia"}</h3>
            <input
              type="text"
              placeholder="Título"
              name="titulo"
              className="form-input"
              value={newsForm.titulo}
              onChange={(e) =>
                setNewsForm({ ...newsForm, titulo: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Resumen"
              name="resumen"
              className="form-textarea"
              value={newsForm.resumen}
              onChange={(e) =>
                setNewsForm({ ...newsForm, resumen: e.target.value })
              }
              required
            />
            <input
              type="date"
              name="fechaPublicacion"
              className="form-input"
              value={newsForm.fechaPublicacion}
              onChange={(e) =>
                setNewsForm({ ...newsForm, fechaPublicacion: e.target.value })
              }
              required
            />
            <input
              type="file"
              className="file-input"
              onChange={(e) => handleFileChange(e, "noticias")}
            />
            <button type="submit" className="submit-btn">
              {editId ? "Actualizar" : "Publicar"}
            </button>
          </form>
          <div className="items-list">
            {listaNoticias.map((item) => (
              <div key={item.id} className="list-item">
                <span>{item.titulo}</span>
                <div className="actions">
                  <button
                    className="edit-action"
                    onClick={() => {
                      setEditId(item.id);
                      setNewsForm(item);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-action"
                    onClick={() => handleDelete(item.id, "noticias")}
                  >
                    Borrar
                  </button>
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
            <input
              type="text"
              placeholder="Título"
              name="titulo"
              className="form-input"
              value={eventForm.titulo}
              onChange={(e) =>
                setEventForm({ ...eventForm, titulo: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Descripción"
              name="descripcion"
              className="form-textarea"
              value={eventForm.descripcion}
              onChange={(e) =>
                setEventForm({ ...eventForm, descripcion: e.target.value })
              }
              required
            />
            <input
              type="date"
              name="fecha"
              className="form-input"
              value={eventForm.fecha}
              onChange={(e) =>
                setEventForm({ ...eventForm, fecha: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Lugar"
              name="lugar"
              className="form-input"
              value={eventForm.lugar}
              onChange={(e) =>
                setEventForm({ ...eventForm, lugar: e.target.value })
              }
              required
            />
            <input
              type="file"
              className="file-input"
              onChange={(e) => handleFileChange(e, "eventos")}
            />
            <button type="submit" className="submit-btn">
              {editId ? "Actualizar" : "Crear"}
            </button>
          </form>
          <div className="items-list">
            {listaEventos.map((item) => (
              <div key={item.id} className="list-item">
                <span>{item.titulo}</span>
                <div className="actions">
                  <button
                    className="edit-action"
                    onClick={() => {
                      setEditId(item.id);
                      setEventForm(item);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="delete-action"
                    onClick={() => handleDelete(item.id, "eventos")}
                  >
                    Borrar
                  </button>
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
          <input
            type="text"
            placeholder="Nombre"
            name="nombre"
            className="form-input"
            value={presidentForm.nombre}
            onChange={(e) =>
              setPresidentForm({ ...presidentForm, nombre: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Cargo"
            name="cargo"
            className="form-input"
            value={presidentForm.cargo}
            onChange={(e) =>
              setPresidentForm({ ...presidentForm, cargo: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Mensaje"
            name="mensaje"
            className="form-textarea"
            rows="5"
            value={presidentForm.mensaje}
            onChange={(e) =>
              setPresidentForm({ ...presidentForm, mensaje: e.target.value })
            }
            required
          />
          {currentPresidentImg && (
            <p style={{ fontSize: "0.8rem", color: "green" }}>
              Imagen actual cargada
            </p>
          )}
          <input
            type="file"
            className="file-input"
            onChange={(e) => handleFileChange(e, "presidente")}
          />
          <button type="submit" className="submit-btn">
            Guardar Cambios
          </button>
        </form>
      )}

      {/* --- DIRECTORIO (NUEVO) --- */}
      {activeTab === "directorio" && (
        <>
          <form className="upload-form" onSubmit={submitDirectorio}>
            <h3>Agregar Miembro al Directorio</h3>

            <div className="form-group">
              <label>Categoría</label>
              <select
                className="form-input"
                value={dirForm.categoria}
                onChange={(e) =>
                  setDirForm({ ...dirForm, categoria: e.target.value })
                }
              >
                <option value="Consejeros">Consejeros</option>
                <option value="ComiteEjecutivo">Comité Ejecutivo</option>
                <option value="Secciones">Secciones Especializadas</option>
                <option value="Vicepresidencias">Vicepresidencias</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Nombre Completo"
              className="form-input"
              value={dirForm.nombre}
              onChange={(e) =>
                setDirForm({ ...dirForm, nombre: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Cargo / Empresa"
              className="form-input"
              value={dirForm.cargo}
              onChange={(e) =>
                setDirForm({ ...dirForm, cargo: e.target.value })
              }
              required
            />

            <textarea
              placeholder="Descripción breve (opcional)"
              className="form-textarea"
              value={dirForm.descripcion}
              onChange={(e) =>
                setDirForm({ ...dirForm, descripcion: e.target.value })
              }
            ></textarea>

            <div className="form-group">
              <label>Foto de Perfil</label>
              <input
                type="file"
                className="file-input"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "directorio")}
              />
            </div>

            <button type="submit" className="submit-btn">
              Guardar Miembro
            </button>
          </form>

          <div className="items-list">
            <h3>Lista Actual</h3>
            {listaDirectorio.map((m) => (
              <div key={m.id} className="list-item">
                <span>
                  {m.nombre} <small>({m.categoria})</small>
                </span>
                <button
                  className="delete-action"
                  onClick={() => handleDelete(m.id, "directorio")}
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
