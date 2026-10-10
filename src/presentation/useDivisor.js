import { useState } from 'react'
import { ErrorDeEntrada } from '../domain/validarEntrada.js'

// Qué hace: guarda el estado de la pantalla (campos, modo, resultado, error) y expone calcular().
// Por qué existe: separa la lógica de la pantalla de su dibujo y recibe sus dependencias por
// parámetro (DIP), sin importar nada de data.
// Recibe: { validarEntrada, calcularDivision, estrategias } con estrategias = { clave: estrategia }.
// Devuelve: { monto, personas, propina, modo, resultado, error, setMonto, setPersonas,
// setPropina, setModo, calcular }.
// Errores: calcular() no lanza: captura ErrorDeEntrada y lo expone en `error`.
export function useDivisor({ validarEntrada, calcularDivision, estrategias }) {
  const [monto, setMonto] = useState('')
  const [personas, setPersonas] = useState('')
  const [propina, setPropina] = useState('')
  const [modo, setModo] = useState('exacto')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState(null)

  // Qué hace: valida, calcula con la estrategia elegida y guarda el resultado.
  // Por qué existe: es la acción del botón "Calcular"; editar campos o el modo no recalcula.
  // Recibe: nada. Devuelve: nada.
  // Errores: ErrorDeEntrada se guarda en `error` (y resultado = null); otros errores se relanzan.
  function calcular() {
    try {
      const cuenta = validarEntrada({ monto, personas, propina })
      setResultado(calcularDivision(cuenta, estrategias[modo]))
      setError(null)
    } catch (e) {
      if (!(e instanceof ErrorDeEntrada)) throw e
      setResultado(null)
      setError(e.message)
    }
  }

  return { monto, personas, propina, modo, resultado, error, setMonto, setPersonas, setPropina, setModo, calcular }
}
