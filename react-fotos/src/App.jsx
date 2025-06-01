import { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Galeria from './Galeria';
import Ranking from './Ranking';
import './App.css';

function App() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [esNuevo, setEsNuevo] = useState(false);
  const [verRanking, setVerRanking] = useState(false);

  const manejarLogin = async () => {
    try {
      const userCredential = esNuevo
        ? await createUserWithEmailAndPassword(auth, correo, clave)
        : await signInWithEmailAndPassword(auth, correo, clave);
      setUsuario(userCredential.user);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="App">
      {!usuario ? (
        <div>
          <h2>{esNuevo ? 'Registro' : 'Login'}</h2>
          <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          <input type="password" placeholder="Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} />
          <button onClick={manejarLogin}>{esNuevo ? 'Registrarse' : 'Entrar'}</button>
          <p onClick={() => setEsNuevo(!esNuevo)} style={{ cursor: 'pointer', color: 'blue' }}>
            {esNuevo ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </p>
        </div>
      ) : (
        <div>
          <button onClick={() => setVerRanking(!verRanking)} style={{ marginBottom: 20 }}>
            {verRanking ? 'Ver Galería' : 'Ver Ranking'}
          </button>
          {verRanking ? <Ranking /> : <Galeria usuario={usuario} />}
        </div>
      )}
    </div>
  );
}

export default App;
