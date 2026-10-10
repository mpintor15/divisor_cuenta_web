// Qué hace: convierte un número en texto con 2 decimales, con punto y sin símbolo de moneda.
// Por qué existe: FR-004 pide "27.50"; toFixed no depende del idioma del navegador
// (toLocaleString cambiaría los separadores).
// Recibe: numero (number). Devuelve: string, por ejemplo 27.5 -> "27.50". Errores: ninguno.
export function formatear(numero) {
  return numero.toFixed(2)
}

export default { formatear }
