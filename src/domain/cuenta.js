// Qué hace: arma la entidad Cuenta con los datos ya validados.
// Por qué existe: da una forma única a lo que usa el cálculo (la Cuenta del modelo de datos).
// Recibe: { monto (number > 0), personas (entero >= 1), propinaPorcentaje (number >= 0) }.
// Devuelve: el objeto Cuenta { monto, personas, propinaPorcentaje }.
// Errores: ninguno; no valida (eso lo hace validarEntrada).
export function crearCuenta({ monto, personas, propinaPorcentaje }) {
  return { monto, personas, propinaPorcentaje }
}
