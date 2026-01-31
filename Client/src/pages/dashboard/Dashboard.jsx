import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const API_URL = "http://localhost:5286/api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("noticias"); // 'noticias', 'eventos', 'presidente'
  const [mensaje, setMensaje] = useState(null);

  // Lista de datos cargados del servidor
  const [listaNoticias, setListaNoticias] = useState([]);
  const [listaEventos, setListaEventos] = useState([]);

  // Modo edición: null = creando nuevo | número = id del que editamos
  const [editId, setEditId] = useState(null);

  // --- FORMULARIOS ---
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

  // NUEVO: Formulario Presidente
  const [presidentForm, setPresidentForm] = useState({
    nombre: "",
    cargo: "",
    mensaje: "",
    imagen: null,
  });
  const [currentPresidentImg, setCurrentPresidentImg] = useState(null); // Para mostrar la foto actual

  // --- CARGAR DATOS AL INICIO ---
  const cargarDatos = () => {
    fetch(`${API_URL}/noticias`)
      .then((res) => res.json())
      .then((data) => setListaNoticias(data));
    fetch(`${API_URL}/eventos`)
      .then((res) => res.json())
      .then((data) => setListaEventos(data));

    // NUEVO: Cargar info del presidente
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
      .catch((err) => console.log("No hay info de presidente aun"));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- PREPARAR FORMULARIO PARA EDITAR ---
  const handleEdit = (item, type) => {
    setEditId(item.id);
    setMensaje(null);
    if (type === "noticias") {
      setNewsForm({
        titulo: item.titulo,
        resumen: item.resumen,
        fechaPublicacion: item.fechaPublicacion,
        imagen: null,
      });
      setActiveTab("noticias");
    } else if (type === "eventos") {
      setEventForm({
        titulo: item.titulo,
        descripcion: item.descripcion || "",
        fecha: item.fecha,
        lugar: item.lugar || "",
        imagen: null,
      });
      setActiveTab("eventos");
    }
    window.scrollTo(0, 0);
  };

  // --- CANCELAR EDICIÓN (LIMPIAR) ---
  const resetForm = () => {
    setEditId(null);
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
    setMensaje(null);
    // Nota: El form de presidente no se resetea igual porque siempre editas el mismo registro
  };

  // --- BORRAR ITEM ---
  const handleDelete = async (id, type) => {
    if (!window.confirm("¿Seguro que quieres eliminar esto?")) return;

    try {
      await fetch(`${API_URL}/${type}/${id}`, { method: "DELETE" });
      cargarDatos();
      setMensaje({ type: "success", text: "Eliminado correctamente" });
    } catch (error) {
      console.error(error);
    }
  };

  // --- MANEJADORES DE INPUTS ---
  const handleNewsChange = (e) =>
    setNewsForm({ ...newsForm, [e.target.name]: e.target.value });
  const handleEventChange = (e) =>
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });

  // NUEVO: Handler Presidente
  const handlePresidentChange = (e) =>
    setPresidentForm({ ...presidentForm, [e.target.name]: e.target.value });

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "noticias") setNewsForm({ ...newsForm, imagen: file });
    else if (type === "eventos") setEventForm({ ...eventForm, imagen: file });
    else if (type === "presidente")
      setPresidentForm({ ...presidentForm, imagen: file }); // NUEVO
  };

  // --- ENVIAR NOTICIA ---
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

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        setMensaje({
          type: "success",
          text: editId ? "Noticia actualizada" : "Noticia creada",
        });
        resetForm();
        cargarDatos();
      } else {
        setMensaje({ type: "error", text: "Error al guardar noticia" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- ENVIAR EVENTO ---
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

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        setMensaje({
          type: "success",
          text: editId ? "Evento actualizado" : "Evento creado",
        });
        resetForm();
        cargarDatos();
      } else {
        setMensaje({ type: "error", text: "Error al guardar evento" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- NUEVO: ENVIAR PRESIDENTE ---
  const submitPresidente = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", presidentForm.nombre);
    formData.append("cargo", presidentForm.cargo);
    formData.append("mensaje", presidentForm.mensaje);
    if (presidentForm.imagen) formData.append("imagen", presidentForm.imagen);

    // Asumimos que siempre es POST/PUT al mismo endpoint único
    try {
      const res = await fetch(`${API_URL}/presidente`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setMensaje({
          type: "success",
          text: "Información del Presidente actualizada",
        });
        cargarDatos(); // Para refrescar la imagen si cambió
      } else {
        setMensaje({ type: "error", text: "Error al actualizar presidente" });
      }
    } catch (error) {
      console.error(error);
    }
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
            resetForm();
          }}
        >
          Administrar Noticias
        </button>
        <button
          className={`tab-btn ${activeTab === "eventos" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("eventos");
            resetForm();
          }}
        >
          Administrar Eventos
        </button>
        {/* NUEVA PESTAÑA */}
        <button
          className={`tab-btn ${activeTab === "presidente" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("presidente");
            resetForm();
          }}
        >
          👤 Presidente
        </button>
      </div>

      {mensaje && (
        <div className={`message ${mensaje.type}`}>{mensaje.text}</div>
      )}

      {/* --- SECCIÓN NOTICIAS --- */}
      {activeTab === "noticias" && (
        <>
          <form className="upload-form" onSubmit={submitNoticia}>
            <h3>{editId ? "✏️ Editando Noticia" : "➕ Nueva Noticia"}</h3>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                name="titulo"
                className="form-input"
                required
                value={newsForm.titulo}
                onChange={handleNewsChange}
              />
            </div>
            <div className="form-group">
              <label>Resumen</label>
              <textarea
                name="resumen"
                className="form-textarea"
                required
                value={newsForm.resumen}
                onChange={handleNewsChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                name="fechaPublicacion"
                className="form-input"
                required
                value={newsForm.fechaPublicacion}
                onChange={handleNewsChange}
              />
            </div>
            <div className="form-group">
              <label>
                Imagen {editId && "(Dejar vacío para mantener la actual)"}
              </label>
              <input
                type="file"
                className="file-input"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "noticias")}
                required={!editId}
              />
            </div>
            <div className="btn-group">
              <button type="submit" className="submit-btn">
                {editId ? "Guardar Cambios" : "Publicar"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>

          <div className="items-list">
            <h3>Historial de Noticias</h3>
            {listaNoticias.map((item) => (
              <div key={item.id} className="list-item">
                <span>
                  {item.titulo} ({item.fechaPublicacion})
                </span>
                <div className="actions">
                  <button
                    className="edit-action"
                    onClick={() => handleEdit(item, "noticias")}
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

      {/* --- SECCIÓN EVENTOS --- */}
      {activeTab === "eventos" && (
        <>
          <form className="upload-form" onSubmit={submitEvento}>
            <h3>{editId ? "✏️ Editando Evento" : "➕ Nuevo Evento"}</h3>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                name="titulo"
                className="form-input"
                required
                value={eventForm.titulo}
                onChange={handleEventChange}
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                className="form-textarea"
                required
                value={eventForm.descripcion}
                onChange={handleEventChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                className="form-input"
                required
                value={eventForm.fecha}
                onChange={handleEventChange}
              />
            </div>
            <div className="form-group">
              <label>Lugar</label>
              <input
                type="text"
                name="lugar"
                className="form-input"
                required
                value={eventForm.lugar}
                onChange={handleEventChange}
              />
            </div>
            <div className="form-group">
              <label>
                Imagen {editId && "(Dejar vacío para mantener la actual)"}
              </label>
              <input
                type="file"
                className="file-input"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "eventos")}
                required={!editId}
              />
            </div>
            <div className="btn-group">
              <button type="submit" className="submit-btn">
                {editId ? "Guardar Cambios" : "Crear Evento"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>

          <div className="items-list">
            <h3>Historial de Eventos</h3>
            {listaEventos.map((item) => (
              <div key={item.id} className="list-item">
                <span>
                  {item.titulo} ({item.fecha})
                </span>
                <div className="actions">
                  <button
                    className="edit-action"
                    onClick={() => handleEdit(item, "eventos")}
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

      {/* --- NUEVA SECCIÓN: PRESIDENTE --- */}
      {activeTab === "presidente" && (
        <>
          <form className="upload-form" onSubmit={submitPresidente}>
            <h3>👤 Configurar Sección Presidente</h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#666",
                marginBottom: "20px",
              }}
            >
              Esta información aparecerá en la página "Nosotros".
            </p>

            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Ej: RUBÉN RAMÍREZ"
                value={presidentForm.nombre}
                onChange={handlePresidentChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cargo</label>
              <input
                type="text"
                name="cargo"
                className="form-input"
                placeholder="Ej: Presidente de CANACO"
                value={presidentForm.cargo}
                onChange={handlePresidentChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mensaje</label>
              <textarea
                name="mensaje"
                className="form-textarea"
                rows="6"
                placeholder="Escribe el mensaje de bienvenida..."
                value={presidentForm.mensaje}
                onChange={handlePresidentChange}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Fotografía Oficial</label>
              {currentPresidentImg && (
                <p style={{ color: "green", fontSize: "0.8rem" }}>
                  ✓ Imagen actual cargada
                </p>
              )}
              <input
                type="file"
                className="file-input"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "presidente")}
              />
            </div>

            <div className="btn-group">
              <button type="submit" className="submit-btn">
                Actualizar Información
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Dashboard;
