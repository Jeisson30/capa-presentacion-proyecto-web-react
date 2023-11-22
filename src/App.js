import './App.css';
import Usuarios from './componentes/usuarios/usuarios';
import UsuarioConsulta from './componentes/usuarioConsulta/usuarioConsulta';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Usuarios />} />
        <Route path='/usuarioConsulta' element={<UsuarioConsulta />} />  
      </Routes> 
    </Router>
  );
}

export default App;
