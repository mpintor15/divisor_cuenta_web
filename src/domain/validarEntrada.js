import { crearCuenta } from './cuenta.js'

// Qué hace: error de dominio para entradas del formulario que no permiten calcular.
// Por qué existe: la pantalla distingue estos errores esperados de fallos inesperados.
// Recibe: message, el texto exacto que ve el usuario.
// Devuelve: una instancia de Error con name "ErrorDeEntrada".
// Errores: es el error mismo; se lanza desde validarEntrada.
export class ErrorDeEntrada extends Error {
  constructor(message) {
    super(message)
    this.name = 'ErrorDeEntrada'
  }
}

const REGEX_DECIMAL = /^\d+([.,]\d+)?$/
const REGEX_ENTERO = /^\d+$/

// Qué hace: convierte un texto decimal (con punto o coma) en número.
// Por qué existe: FR-013 acepta ambos separadores con el mismo significado.
// Recibe: texto ya sin espacios que cumple REGEX_DECIMAL. Devuelve: number. Errores: ninguno.
function aNumero(texto) {
  return Number(texto.replace(',', '.'))
}

// Qué hace: convierte los textos crudos del formulario en una Cuenta con números.
// Por qué existe: las reglas de validez son de negocio y deben probarse sin React.
// Recibe: { monto, personas, propina } como strings.
// Devuelve: una Cuenta { monto, personas, propinaPorcentaje }.
// Errores: lanza ErrorDeEntrada con el mensaje de la spec; solo informa el primero,
// en el orden monto -> personas -> propina.
export function validarEntrada({ monto, personas, propina }) {
  const textoMonto = monto.trim()
  const textoPersonas = personas.trim()
  const textoPropina = propina.trim()

  if (!REGEX_DECIMAL.test(textoMonto) || aNumero(textoMonto) <= 0) {
    throw new ErrorDeEntrada('Monto inválido')
  }
  if (!REGEX_ENTERO.test(textoPersonas)) {
    throw new ErrorDeEntrada('Número de personas inválido')
  }
  if (Number(textoPersonas) === 0) {
    throw new ErrorDeEntrada('Debe haber al menos una persona')
  }
  if (!REGEX_DECIMAL.test(textoPropina)) {
    throw new ErrorDeEntrada('Propina inválida')
  }

  return crearCuenta({
    monto: aNumero(textoMonto),
    personas: Number(textoPersonas),
    propinaPorcentaje: aNumero(textoPropina),
  })
}
