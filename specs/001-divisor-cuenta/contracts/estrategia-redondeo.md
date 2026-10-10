# Contrato: EstrategiaRedondeo

Definido en `src/domain/estrategiaRedondeo.js`. Implementado en `src/data/`.

```text
aplicar(valor: number) -> number
```

- **Entrada**: `valor` finito y ≥ 0 (importe por persona sin redondear).
- **Salida**: número con a lo sumo 2 decimales.
- **Errores**: no lanza para entradas del dominio; no valida (eso es de `validarEntrada`).
- **Sustituibilidad (LSP)**: quien la usa solo llama `aplicar`; no pregunta el tipo.

## Implementaciones

| Módulo | Regla | Ejemplos |
|--------|-------|----------|
| `redondeoExacto` | a 2 decimales | 3.3333 → 3.33; 27.5 → 27.5 |
| `redondeoHaciaArriba` | `Math.ceil(valor - 1e-9)`: sube al siguiente entero; entero se mantiene | 3.33 → 4; 2.40 → 3; 2.001 → 3; 30 → 30; 30.000000000000004 → 30 |

## Cómo se prueba
Un conjunto de pruebas de contrato recorre todas las implementaciones registradas y verifica:
tiene `aplicar`, devuelve `number`, es determinista. Agregar una regla nueva = agregarla a esa lista.
