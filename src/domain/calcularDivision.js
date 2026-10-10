import { crearResultado } from './resultado.js'

// Qué hace: calcula cuánto paga cada persona: monto * (1 + propina/100) / personas,
// y delega el redondeo a la estrategia recibida.
// Por qué existe: es la regla de negocio central (FR-005); al recibir la estrategia por
// parámetro, un modo de redondeo nuevo no obliga a cambiar esta función (OCP/DIP).
// Recibe: cuenta (Cuenta ya validada) y estrategia (objeto con aplicar(valor)).
// Devuelve: un Resultado. Errores: ninguno propio; no valida ni formatea.
export function calcularDivision(cuenta, estrategia) {
  const sinRedondear = (cuenta.monto * (1 + cuenta.propinaPorcentaje / 100)) / cuenta.personas
  return crearResultado(estrategia.aplicar(sinRedondear))
}
