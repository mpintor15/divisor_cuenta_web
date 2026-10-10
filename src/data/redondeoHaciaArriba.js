// Estrategia de redondeo "hacia arriba": sube el importe al siguiente entero (FR-009).
// Por qué existe: permite pagar en billetes enteros; cumple el contrato EstrategiaRedondeo.
const redondeoHaciaArriba = {
  // Qué hace: devuelve Math.ceil(valor - 1e-9). El margen absorbe el error de punto flotante
  // (30.000000000000004 -> 30) sin perder valores reales (2.001 -> 3); un entero se mantiene.
  // Recibe: valor, importe por persona sin redondear (finito, >= 0).
  // Devuelve: un entero. Errores: ninguno.
  aplicar(valor) {
    return Math.ceil(valor - 1e-9)
  },
}

export default redondeoHaciaArriba
