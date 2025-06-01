import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const obtenerRanking = async () => {
      const snapshot = await getDocs(collection(db, 'elecciones'));
      const elecciones = snapshot.docs.map((doc) => doc.data());

      // Contar votos por foto (url + nombre)
      const conteo = {};
      elecciones.forEach(({ foto, nombre }) => {
        if (!foto || !nombre) return; // Ignora si falta alguno
        const clave = `${foto}|${nombre}`;
        conteo[clave] = (conteo[clave] || 0) + 1;
      });

      // Transformar en array ordenado
      const rankingFinal = Object.entries(conteo)
        .map(([clave, votos]) => {
          const [url, nombre] = clave.split('|');
          return { url, nombre, votos };
        })
        .sort((a, b) => b.votos - a.votos);

      setRanking(rankingFinal);
    };

    obtenerRanking();
  }, []);

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>📊 Ranking de Fotos Más Votadas</h2>
      {ranking.length === 0 ? (
        <p>No hay votos aún.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {ranking.map((foto, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <img
                src={foto.url}
                alt={foto.nombre}
                style={{ width: 200, height: 200, border: '2px solid #aaa' }}
              />
              <p><strong>{foto.nombre}</strong></p>
              <p>🗳️ {foto.votos} votos</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Ranking;
