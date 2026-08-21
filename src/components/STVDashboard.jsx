import React from 'react';
import { STVSliderCurvo } from './STVSliderCurvo.jsx';

// 1. Diccionario de medidas reales de fabricación (fuera del componente)
const GROSORES_COMERCIALES = [
  { etiqueta: '1/4"', valorCm: 0.635 },
  { etiqueta: '5/16"', valorCm: 0.794 },
  { etiqueta: '3/8"', valorCm: 0.952 },
  { etiqueta: '1/2"', valorCm: 1.27 },
  { etiqueta: '5/8"', valorCm: 1.587 },
  { etiqueta: '3/4"', valorCm: 1.905 },
  { etiqueta: '1"', valorCm: 2.54 },
];

export const STVDashboard = ({
  cantidadPiezas,
  setCantidadPiezas,
  longitudPieza,
  setLongitudPieza,
  perfil,
  setPerfil,
  moduloActivo,
  setModuloActivo,
  menuExpandido,
  alternarAnillo,
  // Recibimos las nuevas propiedades para las placas base
  grosorPlaca,
  setGrosorPlaca,
  areaPlaca,
  setAreaPlaca,
}) => {
  // ==========================================
  // FUNCIONES DE CONTROL (SNAPPING)
  // ==========================================
  const manejarCambioGrosor = (valorRaton) => {
    const grosorCercano = GROSORES_COMERCIALES.reduce((prev, actual) => {
      return Math.abs(actual.valorCm - valorRaton) <
        Math.abs(prev.valorCm - valorRaton)
        ? actual
        : prev;
    });
    setGrosorPlaca(grosorCercano.valorCm);
  };

  const manejarCambioArea = (valorRaton) => {
    const areaAjustada = Math.round(valorRaton / 5) * 5;
    setAreaPlaca(areaAjustada);
  };

  // Buscamos la etiqueta actual para mostrarla en el botón central si estamos en placas
  const grosorActualEtiqueta =
    GROSORES_COMERCIALES.find((g) => g.valorCm === grosorPlaca)?.etiqueta || '';

  return (
    <>
      <div className="hud-container">
        {/* ZONA 1: TOP CENTER */}
        <div className="hud-top-center">
          <div className="hud-title-group">
            <h3 className="hud-subtitle">{moduloActivo}</h3>
            <h1 className="hud-title">
              {moduloActivo === '01 COLUMNS' ? 'COLUMN ENGINE' : 'PLATE ENGINE'}
            </h1>
            <div className="hud-divider">
              <span className="hud-divider-text">FABRICATION</span>
            </div>
          </div>

          <div className="hud-orbital-system">
            {menuExpandido && moduloActivo === '01 COLUMNS' && (
              <>
                <STVSliderCurvo
                  valor={cantidadPiezas}
                  setValor={setCantidadPiezas}
                  min={1}
                  max={50}
                  radio={135}
                  color="#FFBF00"
                  esSuperior={true}
                  paso={1}
                  etiqueta="QTY"
                />
                <STVSliderCurvo
                  valor={longitudPieza}
                  setValor={setLongitudPieza}
                  min={1.0}
                  max={15.0}
                  radio={135}
                  color="#BFFF00"
                  esSuperior={false}
                  paso={0.1}
                  etiqueta="LEN"
                />
              </>
            )}

            {menuExpandido && moduloActivo === '02 BASE PLATES' && (
              <>
                <STVSliderCurvo
                  valor={areaPlaca}
                  setValor={manejarCambioArea} // Usamos nuestra función con saltos de 5cm
                  min={15}
                  max={60}
                  radio={135}
                  color="#FFBF00"
                  esSuperior={true}
                  paso={1}
                  etiqueta="AREA"
                />
                <STVSliderCurvo
                  valor={grosorPlaca}
                  setValor={manejarCambioGrosor} // Usamos nuestra función de calibres reales
                  min={0.5}
                  max={3.0}
                  radio={135}
                  color="#BFFF00"
                  esSuperior={false}
                  paso={0.01}
                  etiqueta="THCK"
                />
              </>
            )}

            <div
              className={`hud-outer-ring ${menuExpandido ? 'expanded' : ''}`}
            ></div>

            <button
              className={`hud-btn-main glow-neon ${
                menuExpandido ? 'core-active' : ''
              }`}
              onClick={alternarAnillo}
            >
              {moduloActivo === '01 COLUMNS'
                ? perfil
                : `${areaPlaca}x${areaPlaca}cm | ${grosorActualEtiqueta}`}
            </button>
          </div>
        </div>

        {/* ZONA 2: BOTTOM LEFT */}
        <div className="hud-bottom-left">
          <div className="hud-radial-base">
            <div className="hud-radial-center"></div>
            <button
              className={`hud-radial-btn pos-1 ${
                moduloActivo === '01 COLUMNS' ? 'active' : ''
              }`}
              onClick={() => setModuloActivo('01 COLUMNS')}
            >
              <span className="btn-icon">I</span>
              <span>01 COLUMNS</span>
            </button>
            <button
              className={`hud-radial-btn pos-2 ${
                moduloActivo === '02 BASE PLATES' ? 'active' : ''
              }`}
              onClick={() => setModuloActivo('02 BASE PLATES')}
            >
              <span>02 BASE PLATES</span>
            </button>
          </div>
        </div>

        {/* ZONA 3: BOTTOM RIGHT */}
        <div className="hud-bottom-right">
          <button className="hud-action-circle">
            <span className="action-small">EXPORT D.U.B</span>
            <span className="action-large">
              FABRICATION
              <br />
              DATA READY
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .hud-container { position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; overflow: hidden; color: var(--accent-cyan); }
        .hud-container button, .hud-container input, .hud-container svg { pointer-events: auto; font-family: 'Orbitron', sans-serif; }
        .hud-top-center { position: absolute; top: 30px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; }
        .hud-title-group { text-align: center; margin-bottom: 30px; }
        .hud-subtitle { font-size: 10px; font-weight: 700; letter-spacing: 4px; margin: 0; color: var(--text-main); }
        .hud-title { font-size: 28px; font-weight: 900; letter-spacing: 6px; margin: 5px 0; text-shadow: 0 0 15px var(--accent-cyan); }
        .hud-orbital-system { position: relative; width: 300px; height: 300px; display: flex; align-items: center; justify-content: center; }
        .hud-btn-main { position: relative; z-index: 10; padding: 15px 30px; border-radius: 30px; font-weight: 900; letter-spacing: 2px; font-size: 14px; background: var(--bg-panel); border: 2px solid var(--accent-neon); color: var(--accent-neon); cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(204, 255, 0, 0.3); }
        .hud-btn-main:hover { background: rgba(204, 255, 0, 0.1); box-shadow: 0 0 30px rgba(204, 255, 0, 0.5); }
        .hud-outer-ring { position: absolute; width: 280px; height: 280px; border-radius: 50%; border: 1px dashed rgba(0, 240, 255, 0.4); background: radial-gradient(circle, rgba(11,17,22,0) 40%, rgba(0,240,255,0.08) 100%); box-shadow: 0 0 25px rgba(0, 240, 255, 0.15) inset; opacity: 0; transform: scale(0.5); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; }
        .hud-outer-ring.expanded { opacity: 1; transform: scale(1); pointer-events: auto; }
        .hud-bottom-left { position: absolute; bottom: -50px; left: -50px; width: 300px; height: 300px; }
        .hud-radial-base { position: relative; width: 100%; height: 100%; border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 50%; }
        .hud-radial-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100px; height: 100px; border-radius: 50%; border: 2px solid var(--accent-cyan); box-shadow: 0 0 20px rgba(0, 240, 255, 0.3) inset; }
        .hud-radial-btn { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 90px; height: 70px; border-radius: 10px; font-size: 10px; font-weight: 700; clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%); background: var(--bg-panel); border: 1px solid var(--accent-cyan); color: var(--accent-cyan); }
        .hud-radial-btn.active { border-color: var(--accent-neon); color: var(--accent-neon); background: rgba(204, 255, 0, 0.05); }
        .pos-1 { top: 10%; right: 10%; } .pos-2 { top: 40%; right: -20%; }
        .hud-bottom-right { position: absolute; bottom: 40px; right: 40px; }
        .hud-action-circle { width: 130px; height: 130px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border: 2px solid var(--accent-cyan); box-shadow: 0 0 20px rgba(0, 240, 255, 0.4) inset; background: var(--bg-panel); color: var(--accent-cyan); }
        .hud-action-circle:hover { border-color: var(--accent-neon); color: var(--accent-neon); box-shadow: 0 0 25px rgba(204, 255, 0, 0.4) inset; }
        .action-small { font-size: 9px; font-weight: 500; margin-bottom: 5px; letter-spacing: 1px;} 
        .action-large { font-size: 12px; font-weight: 900; letter-spacing: 1px; }
      `}</style>
    </>
  );
};
