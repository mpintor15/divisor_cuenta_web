# Data Model: Divisor de cuenta

Todo vive en memoria; no hay persistencia (FR-010).

## Cuenta (`src/domain/cuenta.js`)
Lo que el usuario ya ingresó y fue validado.

| Campo | Tipo | Regla |
|-------|------|-------|
| `monto` | number | > 0 |
| `personas` | number (entero) | ≥ 1 |
| `propinaPorcentaje` | number | ≥ 0 (0 es válido) |

El modo de redondeo NO es parte de `Cuenta`: se pasa como estrategia a `calcularDivision`
(así el dominio no conoce nombres de modos concretos; OCP). La spec lista el modo dentro de
"Cuenta" a nivel de concepto; en código se representa por la estrategia elegida.

## Resultado (`src/domain/resultado.js`)

| Campo | Tipo | Regla |
|-------|------|-------|
| `importePorPersona` | number | ya redondeado por la estrategia; se muestra con 2 decimales |

## ErrorDeEntrada (`src/domain/validarEntrada.js`)
Error con `message` igual a uno de los textos fijos de la spec.

| Condición | Mensaje |
|-----------|---------|
| monto no numérico, ≤ 0 | `Monto inválido` |
| personas = 0 | `Debe haber al menos una persona` |
| personas vacío, negativo, decimal, no numérico | `Número de personas inválido` |
| propina vacía, negativa, no numérica | `Propina inválida` |

## EstrategiaRedondeo (`src/domain/estrategiaRedondeo.js`)
Contrato: objeto con `aplicar(valor: number): number`. Ver
[contracts/estrategia-redondeo.md](contracts/estrategia-redondeo.md).

## Modos disponibles
Mapa que arma `main.jsx`: `{ exacto: redondeoExacto, arriba: redondeoHaciaArriba }`, con
`exacto` como modo por defecto.

## Estado de la pantalla (`useDivisor`, `useState`)

| Estado | Tipo | Inicial |
|--------|------|---------|
| `monto`, `personas`, `propina` | string | `""` |
| `modo` | string (clave de modos) | `"exacto"` |
| `resultado` | Resultado \| null | `null` |
| `error` | string \| null | `null` |

Transiciones al tocar "Calcular":
- Entrada válida → `resultado` = valor calculado, `error` = `null`.
- Entrada inválida → `error` = mensaje, `resultado` = `null`.
- Cambiar `modo` o editar un campo no modifica `resultado` ni `error` hasta el siguiente "Calcular".
