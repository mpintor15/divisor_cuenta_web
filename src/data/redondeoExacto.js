// Estrategia de redondeo "exacto": deja el importe con 2 decimales (half-up).
// Por qué existe: es el modo por defecto (FR-008) y cumple el contrato EstrategiaRedondeo.
const redondeoExacto = {
  // Qué hace: redondea a 2 decimales.
  // Recibe: valor, importe por persona sin redondear (finito, >= 0).
  // Devuelve: el valor con a lo sumo 2 decimales. Errores: ninguno.
  aplicar(valor) {
    return Math.round(valor * 100) / 100
  },
}

export default redondeoExacto
