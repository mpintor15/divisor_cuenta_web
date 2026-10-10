// Qué hace: arma la entidad Resultado con el importe que paga cada persona.
// Por qué existe: separa el valor calculado de su presentación (el formateo es de otra capa).
// Recibe: importePorPersona (number ya redondeado por la estrategia).
// Devuelve: el objeto Resultado { importePorPersona }.
// Errores: ninguno.
export function crearResultado(importePorPersona) {
  return { importePorPersona }
}
