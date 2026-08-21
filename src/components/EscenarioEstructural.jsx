import React from 'react';

// Recibimos las 4 variables de ingeniería desde App.jsx
export const EscenarioEstructural = ({
  cantidad,
  longitud,
  areaPlaca,
  grosorPlaca,
}) => {
  // Constante para la separación física entre columnas en metros
  const separacion = 2.0;

  // Conversión de datos del Dashboard (cm) a Metros para el motor 3D
  const areaMetros = areaPlaca / 100;
  const grosorMetros = grosorPlaca / 100;

  // Calculamos el punto de inicio para centrar toda la estructura en la pantalla
  const inicioX = ((cantidad - 1) * separacion) / 2;

  // Creamos un arreglo vacío para iterar según la "cantidad" de piezas
  const piezas = Array.from({ length: cantidad });

  return (
    <>
      {/* Luces del entorno para resaltar el volumen y el metal */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Mapeo de la estructura: iteramos por cada columna requerida */}
      {piezas.map((_, index) => {
        // Calculamos la posición en X para esta columna específica
        const posX = -inicioX + index * separacion;

        return (
          <group key={index} position={[posX, 0, 0]}>
            {/* ELEMENTO 1: COLUMNA HSS */}
            {/* La posición en Y es longitud/2 para que la base toque el suelo (Y=0) */}
            <mesh position={[0, longitud / 2, 0]}>
              {/* Geometría: Ancho, Alto (longitud), Profundidad */}
              <boxGeometry args={[0.16, longitud, 0.16]} />
              <meshStandardMaterial
                color="#2a2a2a"
                metalness={0.4}
                roughness={0.6}
              />
            </mesh>

            {/* ELEMENTO 2: PLACA BASE */}
            {/* La ubicamos justo debajo de la columna, bajando la mitad de su grosor */}
            <mesh position={[0, -grosorMetros / 2, 0]}>
              <boxGeometry args={[areaMetros, grosorMetros, areaMetros]} />
              <meshStandardMaterial
                color="#111111" // Acero negro mate
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
};
