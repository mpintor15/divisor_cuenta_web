import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PantallaDivisor from './presentation/PantallaDivisor.jsx'
import { validarEntrada } from './domain/validarEntrada.js'
import { calcularDivision } from './domain/calcularDivision.js'
import redondeoExacto from './data/redondeoExacto.js'
import redondeoHaciaArriba from './data/redondeoHaciaArriba.js'

// ÚNICO punto de composición: aquí se eligen las implementaciones concretas de data.
const estrategias = { exacto: redondeoExacto, arriba: redondeoHaciaArriba }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PantallaDivisor
      validarEntrada={validarEntrada}
      calcularDivision={calcularDivision}
      estrategias={estrategias}
    />
  </StrictMode>,
)
