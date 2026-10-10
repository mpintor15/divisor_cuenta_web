import { useDivisor } from './useDivisor.js'
import { formatear } from './formateadorMoneda.js'

// Texto visible de cada modo; las claves salen del mapa estrategias que arma main.jsx.
const ETIQUETAS_MODO = { exacto: 'Exacto', arriba: 'Hacia arriba' }

// Qué hace: crea el manejador onChange de un campo que guarda el texto escrito con `guardar`.
// Por qué existe: evita repetir el mismo manejador en los cuatro campos.
// Recibe: guardar, función que recibe el nuevo texto (setMonto, setModo...).
// Devuelve: una función (evento) -> void. Errores: ninguno.
function alCambiar(guardar) {
  return (e) => guardar(e.target.value)
}

// Qué hace: dibuja una opción del selector de modo a partir de su clave.
// Por qué existe: las opciones salen de las claves de estrategias, sin conocer los modos concretos.
// Recibe: clave, nombre del modo (por ejemplo "exacto"). Devuelve: el elemento <option>.
// Errores: ninguno; si no hay etiqueta conocida, muestra la clave.
function opcionDeModo(clave) {
  return (
    <option key={clave} value={clave}>
      {ETIQUETAS_MODO[clave] ?? clave}
    </option>
  )
}

// Qué hace: dibuja la única pantalla: campos, botón "Calcular" y el importe por persona.
// Por qué existe: es la interfaz de FR-001/FR-002/FR-004.
// Recibe: props validarEntrada, calcularDivision y estrategias (las mismas que useDivisor).
// Devuelve: el elemento React. Errores: ninguno.
export default function PantallaDivisor({ validarEntrada, calcularDivision, estrategias }) {
  const d = useDivisor({ validarEntrada, calcularDivision, estrategias })

  return (
    <main className="divisor">
      <h1>Divisor de cuenta</h1>

      <label>
        Monto
        <input type="text" inputMode="decimal" value={d.monto} onChange={alCambiar(d.setMonto)} />
      </label>

      <label>
        Personas
        <input type="text" inputMode="numeric" value={d.personas} onChange={alCambiar(d.setPersonas)} />
      </label>

      <label>
        Propina (%)
        <input type="text" inputMode="decimal" value={d.propina} onChange={alCambiar(d.setPropina)} />
      </label>

      <label>
        Modo de redondeo
        <select value={d.modo} onChange={alCambiar(d.setModo)}>
          {Object.keys(estrategias).map(opcionDeModo)}
        </select>
      </label>

      <button type="button" onClick={d.calcular}>
        Calcular
      </button>

      {d.error && (
        <p role="alert" className="error">
          {d.error}
        </p>
      )}

      {!d.error && d.resultado && (
        <p className="resultado">
          Cada persona paga: <strong>{formatear(d.resultado.importePorPersona)}</strong>
        </p>
      )}
    </main>
  )
}
