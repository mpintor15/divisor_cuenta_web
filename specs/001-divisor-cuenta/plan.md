# Implementation Plan: Divisor de cuenta

**Branch**: `001-divisor-cuenta` (la spec menciona `sdd`; el directorio del feature es el que manda) | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-divisor-cuenta/spec.md` (solo lectura, no se modifica)

## Summary

App de una sola pantalla que divide la cuenta de un restaurante: monto + propina %, entre N
personas, con redondeo exacto o hacia arriba. Se implementa en React + Vite (JavaScript) con tres
capas (`presentation -> domain <- data`). El dominio es JavaScript puro: valida y convierte la
entrada, calcula y delega el redondeo a una estrategia (`aplicar(valor)`). Las estrategias viven
en `data` y se inyectan desde `src/main.jsx`. El estado de la pantalla es local (`useState`) dentro
del hook `useDivisor`, que recibe sus dependencias. Pruebas con Vitest.

## Technical Context

**Language/Version**: JavaScript (ES modules), React 19 (ya en `package.json`)

**Primary Dependencies**: React, ReactDOM, Vite. Sin librerías de estado externas.

**Storage**: N/A (sin red ni base de datos, FR-010)

**Testing**: Vitest (+ jsdom y @testing-library/react solo para probar el hook y la pantalla)

**Target Platform**: Navegador web moderno; funciona sin conexión

**Project Type**: web-app de una sola pantalla (frontend únicamente)

**Performance Goals**: cálculo instantáneo (operaciones aritméticas simples)

**Constraints**: offline, sin secretos en el repo, `src/domain/` sin imports de `react` ni DOM

**Scale/Scope**: 1 pantalla, 5 módulos de dominio, 2 estrategias de redondeo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cumplimiento en el plan | Estado |
|-----------|-------------------------|--------|
| I. SOLID: SRP | `validarEntrada` solo valida/convierte; `calcularDivision` solo calcula; `formateadorMoneda` solo formatea | OK |
| I. SOLID: OCP | Nueva regla de redondeo = nuevo archivo en `data/` + registrarla en `main.jsx`; `calcularDivision` no cambia | OK |
| I. SOLID: LSP | `redondeoExacto` y `redondeoHaciaArriba` cumplen el mismo contrato `aplicar(valor) -> number` | OK |
| I. SOLID: ISP | Contrato de estrategia = 1 método; el hook recibe solo las funciones que usa | OK |
| I. SOLID: DIP | `useDivisor` recibe `calcularDivision`, `validarEntrada` y las estrategias por parámetro; no importa `data` | OK |
| II. Capas y dependencias | `presentation` importa solo de `domain`; `data` importa solo de `domain`; `domain` no importa a nadie | OK |
| II. `domain` puro | Sin `react` ni DOM en `src/domain/` (se verifica con una prueba/lint de imports) | OK |
| II. Composición única | Solo `src/main.jsx` hace `new`/instancia las estrategias concretas | OK |
| III. Seguridad | Sin API keys ni secretos; no hay red | OK |
| IV. Pruebas | Cada criterio de aceptación de la spec → prueba Vitest | OK |
| V. Regla de la materia | Cada función con comentario breve: qué hace, por qué, recibe, devuelve, errores | OK |

Re-evaluación post-diseño: sin violaciones. No se requiere Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-divisor-cuenta/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── estrategia-redondeo.md
│   └── dominio-y-hook.md
└── tasks.md             # lo genera /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── domain/
│   ├── cuenta.js              # crearCuenta(...) / forma de la entidad Cuenta
│   ├── resultado.js           # crearResultado(importePorPersona)
│   ├── validarEntrada.js      # textos crudos -> Cuenta, o ErrorDeEntrada con el mensaje
│   ├── estrategiaRedondeo.js  # contrato: aplicar(valor) + verificación de forma
│   └── calcularDivision.js    # (cuenta, estrategia) -> Resultado
├── data/
│   ├── redondeoExacto.js      # aplicar: redondea a 2 decimales
│   └── redondeoHaciaArriba.js # aplicar: sube al siguiente entero
├── presentation/
│   ├── useDivisor.js          # hook con useState; recibe sus dependencias
│   ├── formateadorMoneda.js   # número -> "27.50" (sin símbolo)
│   └── PantallaDivisor.jsx    # única pantalla
└── main.jsx                   # ÚNICO punto de composición

test/
├── setup.js                   # configuración de Vitest (jest-dom / limpieza entre pruebas)
├── casosDePrueba.js           # datos compartidos: casos de los escenarios de la spec
├── division.test.js           # domain + data: validarEntrada, calcularDivision, estrategias
│                              #   (contrato LSP) y reglas de arquitectura (pureza de domain,
│                              #   dependencias entre capas)
└── pantalla.test.jsx          # presentation: formateadorMoneda, useDivisor y PantallaDivisor
                               #   (escenarios de aceptación tocando "Calcular")
```

**Structure Decision**: proyecto único de frontend con las tres capas de la constitución. Los
archivos de la plantilla Vite (`App.jsx`, `App.css`, `index.css`) se reemplazan/retiran al
implementar; `App.jsx` no se usa porque la pantalla es `PantallaDivisor.jsx`. Las pruebas viven en
`test/` (singular), en cuatro archivos: `setup.js`, `casosDePrueba.js`, `division.test.js` y
`pantalla.test.jsx`.

## Complexity Tracking

Sin violaciones de la constitución; tabla no aplica.
