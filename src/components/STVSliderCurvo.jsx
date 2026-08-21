import React, { useRef, useState, useEffect } from 'react';

// =========================================================
// MOTOR MATEMÁTICO SVG Y TRIGONOMETRÍA INTERACTIVA
// =========================================================

// Convierte un ángulo a coordenadas X, Y en la pantalla
const polaresACartesianas = (cx, cy, r, anguloGrados) => {
  const radianes = (anguloGrados - 90) * (Math.PI / 180.0);
  return { x: cx + r * Math.cos(radianes), y: cy + r * Math.sin(radianes) };
};

// Genera la ruta (path) del dibujo SVG
const describirArco = (cx, cy, r, anguloInicio, anguloFin) => {
  const inicio = polaresACartesianas(cx, cy, r, anguloFin);
  const fin = polaresACartesianas(cx, cy, r, anguloInicio);
  const arcoLargo = anguloFin - anguloInicio <= 180 ? '0' : '1';
  return [
    'M',
    inicio.x,
    inicio.y,
    'A',
    r,
    r,
    0,
    arcoLargo,
    0,
    fin.x,
    fin.y,
  ].join(' ');
};

export const STVSliderCurvo = ({
  valor,
  setValor,
  min,
  max,
  radio = 140,
  color = '#FFBF00',
  esSuperior = true, // Define si dibuja el arco arriba o abajo
  paso = 1, // Para redondear a enteros o decimales
  etiqueta = '',
}) => {
  const svgRef = useRef(null);
  const [estaArrastrando, setEstaArrastrando] = useState(false);

  // Configuramos los ángulos dependiendo de si es el dial superior o inferior
  // Superior: de -90 a 90 grados (media luna de arriba)
  // Inferior: de 90 a 270 grados (media luna de abajo)
  const anguloBase = esSuperior ? -90 : 90;
  const rangoAngular = 180;

  // Calcula qué tan lleno está el arco basado en el valor actual
  const porcentaje = (valor - min) / (max - min);
  const anguloActual = anguloBase + porcentaje * rangoAngular;

  // EL CEREBRO: Detectar el arrastre del ratón o el dedo
  const manejarInteraccion = (evento) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    // Encontramos el centro exacto del SVG (300x300 = centro en 150,150)
    const centroX = rect.left + 150;
    const centroY = rect.top + 150;

    // Posición del toque o ratón
    const x = evento.clientX || (evento.touches && evento.touches[0].clientX);
    const y = evento.clientY || (evento.touches && evento.touches[0].clientY);

    // Trigonométria: Math.atan2 nos da el ángulo en radianes desde el centro
    let anguloRadianes = Math.atan2(y - centroY, x - centroX);
    let anguloGrados = anguloRadianes * (180 / Math.PI);

    // Normalización del ángulo para que coincida con nuestros arcos superiores/inferiores
    // Hacemos que el origen (0) coincida con el inicio de nuestro arco
    let gradosRelativos = anguloGrados - (esSuperior ? 180 : 0);
    if (gradosRelativos < 0) gradosRelativos += 360;

    // Limitamos para no dar la vuelta completa
    if (gradosRelativos > rangoAngular && gradosRelativos < 360 - 45) return;
    let nuevoPorcentaje = Math.max(
      0,
      Math.min(1, gradosRelativos / rangoAngular)
    );

    // Convertimos el porcentaje de vuelta al valor estructural (Cantidad o Longitud)
    let nuevoValor = min + nuevoPorcentaje * (max - min);

    // Redondeo basado en la propiedad "paso" (ej. enteros o decimales)
    nuevoValor = Math.round(nuevoValor / paso) * paso;

    setValor(nuevoValor);
  };

  // Escuchadores de eventos globales para cuando el dedo se mueve fuera del círculo
  useEffect(() => {
    const alMover = (e) => {
      if (estaArrastrando) manejarInteraccion(e);
    };
    const alSoltar = () => setEstaArrastrando(false);

    if (estaArrastrando) {
      window.addEventListener('mousemove', alMover);
      window.addEventListener('mouseup', alSoltar);
      window.addEventListener('touchmove', alMover, { passive: false });
      window.addEventListener('touchend', alSoltar);
    }
    return () => {
      window.removeEventListener('mousemove', alMover);
      window.removeEventListener('mouseup', alSoltar);
      window.removeEventListener('touchmove', alMover);
      window.removeEventListener('touchend', alSoltar);
    };
  }, [estaArrastrando]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      <svg
        ref={svgRef}
        width="300"
        height="300"
        viewBox="0 0 300 300"
        style={{ pointerEvents: 'auto', touchAction: 'none' }}
        onMouseDown={(e) => {
          setEstaArrastrando(true);
          manejarInteraccion(e);
        }}
        onTouchStart={(e) => {
          setEstaArrastrando(true);
          manejarInteraccion(e);
        }}
      >
        {/* Carril de fondo oscuro */}
        <path
          d={describirArco(
            150,
            150,
            radio,
            anguloBase,
            anguloBase + rangoAngular
          )}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Línea Brillante Interactiva */}
        <path
          d={describirArco(150, 150, radio, anguloBase, anguloActual)}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0px 0px 8px ${color})` }} // El efecto Neón
        />

        {/* Nodo de arrastre (El "Pulgar") */}
        <circle
          cx={polaresACartesianas(150, 150, radio, anguloActual).x}
          cy={polaresACartesianas(150, 150, radio, anguloActual).y}
          r="8"
          fill={color}
          style={{
            cursor: 'pointer',
            filter: `drop-shadow(0px 0px 5px ${color})`,
          }}
        />
      </svg>

      {/* Etiqueta de Texto Flotante en el centro del arco */}
      <div
        style={{
          position: 'absolute',
          width: '100px',
          textAlign: 'center',
          top: esSuperior ? '20px' : 'auto',
          bottom: !esSuperior ? '20px' : 'auto',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#FFFFFF',
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          textShadow: `0 0 10px ${color}`,
        }}
      >
        {etiqueta}: {esSuperior ? valor : valor.toFixed(2)}
      </div>
    </div>
  );
};
