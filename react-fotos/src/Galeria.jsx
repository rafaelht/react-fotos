import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

function Galeria({ usuario }) {
  const [todasLasFotos, setTodasLasFotos] = useState([]);
  const [fotosAleatorias, setFotosAleatorias] = useState([]);
  const [seleccion, setSeleccion] = useState(null);

  // Cargar todas las imágenes desde Firestore
  useEffect(() => {
    const cargarFotos = async () => {
      const snapshot = await getDocs(collection(db, 'imagenes'));
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodasLasFotos(datos);
      elegirFotosAleatorias(datos); // Elegir las primeras 2 al cargar
    };

    cargarFotos();
  }, []);

  // Elegir dos fotos distintas al azar
  const elegirFotosAleatorias = (lista) => {
    if (lista.length < 2) return;

    let copia = [...lista];
    const elegidas = [];

    while (elegidas.length < 2) {
      const index = Math.floor(Math.random() * copia.length);
      elegidas.push(copia.splice(index, 1)[0]);
    }

    setFotosAleatorias(elegidas);
    setSeleccion(null);
  };

  const elegirFoto = async (index) => {
  const seleccionada = fotosAleatorias[index];
  setSeleccion(index);

  if (!seleccionada || !seleccionada.url || !seleccionada.nombre) {
    alert('Imagen inválida. Intenta de nuevo.');
    return;
  }

  try {
    await addDoc(collection(db, 'elecciones'), {
      uid: usuario.uid,
      correo: usuario.email,
      foto: seleccionada.url,
      nombre: seleccionada.nombre,
      fecha: serverTimestamp(),
    });
    alert(`Has elegido: ${seleccionada.nombre}`);
    elegirFotosAleatorias(todasLasFotos);
  } catch (error) {
    alert('Error al guardar en la base de datos');
  }
};

  return (
    <div>
      <h2>Hola, {usuario.email}</h2>
      <p>Elige tu foto favorita:</p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {fotosAleatorias.map((foto, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <img
              src={foto.url}
              alt={foto.nombre}
              style={{
                border: seleccion === index ? '4px solid green' : '2px solid gray',
                cursor: 'pointer',
                width: 200,
                height: 200,
              }}
              onClick={() => elegirFoto(index)}
            />
            <p>{foto.nombre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Galeria;
