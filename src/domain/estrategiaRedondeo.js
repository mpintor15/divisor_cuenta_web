// Contrato EstrategiaRedondeo: un objeto con aplicar(valor: number) -> number.
// Entrada: valor finito >= 0 (importe por persona sin redondear).
// Salida: número con a lo sumo 2 decimales. No lanza ni valida.
// Las implementaciones viven en src/data/ y se registran solo en src/main.jsx.

// Qué hace: comprueba que un objeto cumple la forma del contrato.
// Por qué existe: permite verificar cualquier estrategia nueva sin conocer su tipo (LSP).
// Recibe: obj, cualquier valor.
// Devuelve: true si obj tiene un método aplicar, false si no.
// Errores: ninguno.
export function esEstrategiaValida(obj) {
  return obj != null && typeof obj.aplicar === 'function'
}
