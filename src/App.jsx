import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STVDashboard } from './components/STVDashboard.jsx';
import { EscenarioEstructural } from './components/EscenarioEstructural.jsx';

function App() {
  // =========================================================
  // EL CEREBRO DE LA APLICACIÓN (LEVANTAMIENTO DE ESTADO)
  // =========================================================

  // Estados originales del módulo de Columnas
  const [cantidadPiezas, setCantidadPiezas] = useState(5);
  const [longitudPieza, setLongitudPieza] = useState(3.0);
  const [perfil, setPerfil] = useState('HSS 16x16 C. 3/8');

  // Nuevos estados para el módulo de Placas Base (Medidas lógicas de taller)
  const [areaPlaca, setAreaPlaca] = useState(25); // Inicia en 25x25 cm
  const [grosorPlaca, setGrosorPlaca] = useState(0.952); // Inicia en 3/8" (0.952 cm)

  // Estados de navegación de la UI
  const [moduloActivo, setModuloActivo] = useState('01 COLUMNS');
  const [menuExpandido, setMenuExpandido] = useState(false);

  const alternarAnillo = () => setMenuExpandido(!menuExpandido);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* CAPA 1: EL MOTOR 3D */}
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        camera={{ position: [0, 5, 20], fov: 50 }}
      >
        <OrbitControls makeDefault />

        {/* Le enviamos todos los datos de ingeniería al motor 3D */}
        <EscenarioEstructural
          cantidad={cantidadPiezas}
          longitud={longitudPieza}
          areaPlaca={areaPlaca}
          grosorPlaca={grosorPlaca}
        />
      </Canvas>

      {/* CAPA 2: EL PANEL HUD DE SINERGIA */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
        }}
      >
        {/* Pasamos estrictamente todas las propiedades que el Dashboard espera */}
        <STVDashboard
          cantidadPiezas={cantidadPiezas}
          setCantidadPiezas={setCantidadPiezas}
          longitudPieza={longitudPieza}
          setLongitudPieza={setLongitudPieza}
          perfil={perfil}
          setPerfil={setPerfil}
          moduloActivo={moduloActivo}
          setModuloActivo={setModuloActivo}
          menuExpandido={menuExpandido}
          alternarAnillo={alternarAnillo}
          // Nuestras nuevas conexiones de datos
          areaPlaca={areaPlaca}
          setAreaPlaca={setAreaPlaca}
          grosorPlaca={grosorPlaca}
          setGrosorPlaca={setGrosorPlaca}
        />
      </div>
    </div>
  );
}

export default App;
