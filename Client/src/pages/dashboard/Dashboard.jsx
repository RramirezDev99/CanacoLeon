import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const API_URL = 'http://localhost:5286/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('noticias'); // 'noticias' o 'eventos'
  const [mensaje, setMensaje] = useState(null);
  
  // Lista de datos cargados del servidor
  const [listaNoticias, setListaNoticias] = useState([]);
  const [listaEventos, setListaEventos] = useState([]);

  // Modo edición: null = creando nuevo | número = id del que editamos
  const [editId, setEditId] = useState(null); 

  // Formularios
  const [newsForm, setNewsForm] = useState({ titulo: '', resumen: '', fechaPublicacion: '', imagen: null });
  const [eventForm, setEventForm] = useState({ titulo: '', descripcion: '', fecha: '', lugar: '', imagen: null });

  // --- CARGAR DATOS AL INICIO ---
  const cargarDatos = () => {
    fetch(`${API_URL}/noticias`).then(res => res.json()).then(data => setListaNoticias(data));
    fetch(`${API_URL}/eventos`).then(res => res.json()).then(data => setListaEventos(data));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- PREPARAR FORMULARIO PARA EDITAR ---
  const handleEdit = (item, type) => {
    setEditId(item.id);
    setMensaje(null);
    if (type === 'noticias') {
      setNewsForm({ 
        titulo: item.titulo, 
        resumen: item.resumen, 
        fechaPublicacion: item.fechaPublicacion, 
        imagen: null // La imagen no se precarga, solo se reemplaza si suben otra
      });
      setActiveTab('noticias');
    } else {
      setEventForm({ 
        titulo: item.titulo, 
        descripcion: item.descripcion || '', 
        fecha: item.fecha, 
        lugar: item.lugar || '', 
        imagen: null 
      });
      setActiveTab('eventos');
    }
    // Hacemos scroll arriba para ver el form
    window.scrollTo(0, 0);
  };

  // --- CANCELAR EDICIÓN (LIMPIAR) ---
  const resetForm = () => {
    setEditId(null);
    setNewsForm({ titulo: '', resumen: '', fechaPublicacion: '', imagen: null });
    setEventForm({ titulo: '', descripcion: '', fecha: '', lugar: '', imagen: null });
  };

  // --- BORRAR ITEM ---
  const handleDelete = async (id, type) => {
    if(!window.confirm("¿Seguro que quieres eliminar esto?")) return;

    try {
      await fetch(`${API_URL}/${type}/${id}`, { method: 'DELETE' });
      cargarDatos(); // Recargar lista
      setMensaje({ type: 'success', text: 'Eliminado correctamente' });
    } catch (error) {
      console.error(error);
    }
  };

  // --- MANEJADORES DE INPUTS ---
  const handleNewsChange = (e) => setNewsForm({ ...newsForm, [e.target.name]: e.target.value });
  const handleEventChange = (e) => setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  const handleFileChange = (e, type) => {
    if (type === 'noticias') setNewsForm({ ...newsForm, imagen: e.target.files[0] });
    else setEventForm({ ...eventForm, imagen: e.target.files[0] });
  };

  // --- ENVIAR NOTICIA (POST O PUT) ---
  const submitNoticia = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', newsForm.titulo);
    formData.append('resumen', newsForm.resumen);
    formData.append('fechaPublicacion', newsForm.fechaPublicacion);
    if (newsForm.imagen) formData.append('imagen', newsForm.imagen);

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/noticias/${editId}` : `${API_URL}/noticias`;

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        setMensaje({ type: 'success', text: editId ? 'Noticia actualizada' : 'Noticia creada' });
        resetForm();
        cargarDatos();
      } else {
        setMensaje({ type: 'error', text: 'Error al guardar noticia' });
      }
    } catch (error) { console.error(error); }
  };

  // --- ENVIAR EVENTO (POST O PUT) ---
  const submitEvento = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', eventForm.titulo);
    formData.append('descripcion', eventForm.descripcion);
    formData.append('fecha', eventForm.fecha);
    formData.append('lugar', eventForm.lugar);
    if (eventForm.imagen) formData.append('imagen', eventForm.imagen);

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/eventos/${editId}` : `${API_URL}/eventos`;

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        setMensaje({ type: 'success', text: editId ? 'Evento actualizado' : 'Evento creado' });
        resetForm();
        cargarDatos();
      } else {
        setMensaje({ type: 'error', text: 'Error al guardar evento' });
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de Administración</h1>

      {/* PESTAÑAS */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'noticias' ? 'active' : ''}`} onClick={() => { setActiveTab('noticias'); resetForm(); }}>
          Administrar Noticias
        </button>
        <button className={`tab-btn ${activeTab === 'eventos' ? 'active' : ''}`} onClick={() => { setActiveTab('eventos'); resetForm(); }}>
          Administrar Eventos
        </button>
      </div>

      {mensaje && <div className={`message ${mensaje.type}`}>{mensaje.text}</div>}

      {/* --- SECCIÓN NOTICIAS --- */}
      {activeTab === 'noticias' && (
        <>
          <form className="upload-form" onSubmit={submitNoticia}>
            <h3>{editId ? '✏️ Editando Noticia' : '➕ Nueva Noticia'}</h3>
            <div className="form-group">
              <label>Título</label>
              <input type="text" name="titulo" className="form-input" required value={newsForm.titulo} onChange={handleNewsChange} />
            </div>
            <div className="form-group">
              <label>Resumen</label>
              <textarea name="resumen" className="form-textarea" required value={newsForm.resumen} onChange={handleNewsChange}></textarea>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" name="fechaPublicacion" className="form-input" required value={newsForm.fechaPublicacion} onChange={handleNewsChange} />
            </div>
            <div className="form-group">
              <label>Imagen {editId && '(Dejar vacío para mantener la actual)'}</label>
              <input type="file" className="file-input" accept="image/*" onChange={(e) => handleFileChange(e, 'noticias')} required={!editId} />
            </div>
            <div className="btn-group">
                <button type="submit" className="submit-btn">{editId ? 'Guardar Cambios' : 'Publicar'}</button>
                {editId && <button type="button" className="cancel-btn" onClick={resetForm}>Cancelar Edición</button>}
            </div>
          </form>

          {/* LISTA DE NOTICIAS EXISTENTES */}
          <div className="items-list">
             <h3>Historial de Noticias</h3>
             {listaNoticias.map(item => (
                 <div key={item.id} className="list-item">
                     <span>{item.titulo} ({item.fechaPublicacion})</span>
                     <div className="actions">
                         <button className="edit-action" onClick={() => handleEdit(item, 'noticias')}>Editar</button>
                         <button className="delete-action" onClick={() => handleDelete(item.id, 'noticias')}>Borrar</button>
                     </div>
                 </div>
             ))}
          </div>
        </>
      )}

      {/* --- SECCIÓN EVENTOS --- */}
      {activeTab === 'eventos' && (
        <>
          <form className="upload-form" onSubmit={submitEvento}>
            <h3>{editId ? '✏️ Editando Evento' : '➕ Nuevo Evento'}</h3>
            <div className="form-group">
              <label>Título</label>
              <input type="text" name="titulo" className="form-input" required value={eventForm.titulo} onChange={handleEventChange} />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea name="descripcion" className="form-textarea" required value={eventForm.descripcion} onChange={handleEventChange}></textarea>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" name="fecha" className="form-input" required value={eventForm.fecha} onChange={handleEventChange} />
            </div>
            <div className="form-group">
              <label>Lugar</label>
              <input type="text" name="lugar" className="form-input" required value={eventForm.lugar} onChange={handleEventChange} />
            </div>
            <div className="form-group">
              <label>Imagen {editId && '(Dejar vacío para mantener la actual)'}</label>
              <input type="file" className="file-input" accept="image/*" onChange={(e) => handleFileChange(e, 'eventos')} required={!editId} />
            </div>
            <div className="btn-group">
                <button type="submit" className="submit-btn">{editId ? 'Guardar Cambios' : 'Crear Evento'}</button>
                {editId && <button type="button" className="cancel-btn" onClick={resetForm}>Cancelar Edición</button>}
            </div>
          </form>

          {/* LISTA DE EVENTOS EXISTENTES */}
          <div className="items-list">
             <h3>Historial de Eventos</h3>
             {listaEventos.map(item => (
                 <div key={item.id} className="list-item">
                     <span>{item.titulo} ({item.fecha})</span>
                     <div className="actions">
                         <button className="edit-action" onClick={() => handleEdit(item, 'eventos')}>Editar</button>
                         <button className="delete-action" onClick={() => handleDelete(item.id, 'eventos')}>Borrar</button>
                     </div>
                 </div>
             ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;