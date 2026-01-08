import './App.css'
import logo from './assets/logo.png' // Aquí importaremos tu logo

function App() {
  return (
    <div className="container">
      <div className="content">
        {/* Aquí va el logo */}
        <img src={logo} alt="Logo" className="logo" />
        
        {/* Aquí va el texto */}
        <h1>Próxima página...</h1>
      </div>
    </div>
  )
}

export default App