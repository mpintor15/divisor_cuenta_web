---

description: "Lista de tareas del Divisor de cuenta"
---

# Tasks: Divisor de cuenta

**Input**: Documentos de diseño en `/specs/001-divisor-cuenta/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: SÍ se incluyen. La constitución (principio IV) exige que los criterios de aceptación de la spec sean pruebas ejecutables y el plan fija Vitest. Las pruebas de cada historia se escriben primero y deben FALLAR antes de implementar.

**Organization**: Tareas agrupadas por historia de usuario. Código en español (nombres de módulos y funciones como en el plan).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede ejecutar en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: US1, US2, US3 (solo en fases de historia)

## Path Conventions

Proyecto único de frontend en la raíz del repo: `src/domain/`, `src/data/`, `src/presentation/`, `src/main.jsx`, `test/`.

**Regla de la materia (constitución V)**: TODA función nueva lleva un comentario breve en español que diga: qué hace, por qué existe, qué recibe, qué devuelve y qué errores produce.

**Reglas de capas (constitución II)**: `src/domain/` no importa `react`, `react-dom` ni DOM ni nada de otras capas; `src/data/` e `src/presentation/` importan solo de `domain`; `presentation` NO importa de `data`; solo `src/main.jsx` instancia/importa las estrategias concretas de `data`.

---

## Phase 1: Setup

**Purpose**: Herramientas de prueba y limpieza de la plantilla Vite

- [X] T001 Instalar devDependencies `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event` y `@testing-library/jest-dom` con `npm install -D` y agregar el script `"test": "vitest run"` en `package.json`
- [X] T002 Configurar Vitest en `vite.config.js`: añadir `test: { environment: 'jsdom', setupFiles: ['./test/setup.js'], globals: true }` conservando el plugin de React
- [X] T003 [P] Crear `test/setup.js`: importar `@testing-library/jest-dom/vitest` y registrar `afterEach(cleanup)` de `@testing-library/react`
- [X] T004 [P] Cambiar el `<html lang="en">` a `lang="es"` y el `<title>` a `Divisor de cuenta` en `index.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Contratos y entidades de dominio que usan todas las historias

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta terminar esta fase

- [X] T005 [P] Crear `src/domain/cuenta.js` con `crearCuenta({ monto, personas, propinaPorcentaje })` que devuelve el objeto `Cuenta` (monto number > 0, personas entero ≥ 1, propinaPorcentaje number ≥ 0); sin imports
- [X] T006 [P] Crear `src/domain/resultado.js` con `crearResultado(importePorPersona)` que devuelve `{ importePorPersona }` (number ya redondeado por la estrategia); sin imports
- [X] T007 [P] Crear `src/domain/estrategiaRedondeo.js`: documentar el contrato `aplicar(valor: number) -> number` (valor finito ≥ 0, salida con a lo sumo 2 decimales, no lanza) y exportar `esEstrategiaValida(obj)` que verifica que `obj.aplicar` es función
- [X] T008 [P] Crear `src/domain/validarEntrada.js` con SOLO la clase `ErrorDeEntrada extends Error` (el `message` es el texto exacto de la spec); la función `validarEntrada` se agrega en US1/US2
- [ ] T009 [P] (OMITIDA por pedido del usuario: `test/casosDePrueba.js` ya existe, copiado del enunciado (Parte 7.2) con campos numéricos; los tests usan `String(...)`; los casos extra están en línea en los tests) Crear `test/casosDePrueba.js` con los datos compartidos de los escenarios de la spec: válidos (100/4/10 → 27.50; 90/3/0 → 30.00; 10/3/0 exacto → 3.33; "10,50"/1/0 → 10.50; 10/3/0 arriba → 4.00) e inválidos con su mensaje exacto ("Debe haber al menos una persona", "Monto inválido" para "abc"/"0"/"-50", "Propina inválida" para ""/"-5"/"abc", "Número de personas inválido" para ""/"-3"/"2.5"/"abc"), más los ejemplos de FR-009 (3.33→4, 2.40→3, 30→30, 2.001→3, 30.000000000000004→30)

**Checkpoint**: Base lista; las historias pueden comenzar

---

## Phase 3: User Story 1 - Calcular cuánto paga cada persona (Priority: P1) 🎯 MVP

**Goal**: Con monto, personas y propina válidos y modo exacto, tocar "Calcular" muestra el importe por persona con 2 decimales (sin símbolo), aceptando coma o punto decimal.

**Independent Test**: Escenarios 1–4 de la US1: 100/4/10 → "27.50"; 90/3/0 → "30.00"; 10/3/0 → "3.33"; "10,50"/1/0 → "10.50".

### Tests for User Story 1 ⚠️ (escribir primero, deben fallar)

- [X] T010 [P] [US1] En `test/division.test.js` agregar pruebas de `validarEntrada` (camino válido: convierte textos a `Cuenta`, acepta `,` y `.` como separador, hace `trim`), de `calcularDivision` (`aplicar(monto * (1 + propina/100) / personas)` usando una estrategia doble) y de `redondeoExacto` (3.3333→3.33, 27.5→27.5), usando `test/casosDePrueba.js`
- [X] T011 [P] [US1] En `test/pantalla.test.jsx` agregar pruebas de `formateadorMoneda.formatear` (27.5→"27.50", 30→"30.00") y de `PantallaDivisor` con `@testing-library/user-event`: escribir en "Monto", "Personas", "Propina (%)", tocar "Calcular" y verificar el importe mostrado para los 4 escenarios de US1; inyectar `validarEntrada`, `calcularDivision` y `estrategias` reales con solo `exacto`

### Implementation for User Story 1

- [X] T012 [P] [US1] Crear `src/data/redondeoExacto.js`: objeto con `aplicar(valor)` que devuelve `Math.round(valor * 100) / 100`; importa solo de `domain` si lo necesita (nada de `react`)
- [X] T013 [P] [US1] Crear `src/presentation/formateadorMoneda.js` con `formatear(numero)` que devuelve `numero.toFixed(2)` (siempre punto decimal, sin símbolo, sin `toLocaleString`)
- [X] T014 [US1] Agregar a `src/domain/validarEntrada.js` la función `validarEntrada({ monto, personas, propina })`: `trim()` de cada texto; monto y propina con regex `^\d+([.,]\d+)?$` (cambiar `,` por `.` antes de `Number`); personas con `^\d+$`; devuelve `crearCuenta(...)` de `cuenta.js` (las reglas de rechazo y mensajes se completan en US2)
- [X] T015 [US1] Crear `src/domain/calcularDivision.js` con `calcularDivision(cuenta, estrategia)` que devuelve `crearResultado(estrategia.aplicar(cuenta.monto * (1 + cuenta.propinaPorcentaje / 100) / cuenta.personas))`; no valida ni formatea
- [X] T016 [US1] Crear `src/presentation/useDivisor.js`: hook `useDivisor({ validarEntrada, calcularDivision, estrategias })` con `useState` para `monto`, `personas`, `propina` (string, inicial `""`), `modo` (inicial `"exacto"`), `resultado` (null), `error` (null); `calcular()` valida, calcula con `estrategias[modo]` y guarda `resultado`; cambiar campos o modo NO recalcula; devuelve `{ monto, personas, propina, modo, resultado, error, setMonto, setPersonas, setPropina, setModo, calcular }`. No importa de `data`
- [X] T017 [US1] Crear `src/presentation/PantallaDivisor.jsx`: props `validarEntrada`, `calcularDivision`, `estrategias`; campos con etiquetas "Monto", "Personas", "Propina (%)" (`type="text"`, `inputMode="decimal"` en monto y propina), botón "Calcular" y el importe por persona formateado con `formateadorMoneda` cuando hay `resultado`
- [X] T018 [US1] Reescribir `src/main.jsx` como ÚNICO punto de composición: importar `redondeoExacto`, armar `estrategias = { exacto: redondeoExacto }`, renderizar `<PantallaDivisor validarEntrada calcularDivision estrategias />` dentro de `StrictMode`; quitar el import de `App.jsx`
- [X] T019 [US1] Borrar archivos de la plantilla Vite que ya no se usan: `src/App.jsx`, `src/App.css` y `src/assets/` (hero.png, react.svg, vite.svg); dejar `src/index.css` con estilos mínimos de la pantalla
- [X] T020 [US1] Ejecutar `npm test` y confirmar que pasan las pruebas T010 y T011

**Checkpoint**: US1 funciona y se prueba sola (MVP)

---

## Phase 4: User Story 2 - Rechazar entradas inválidas con un mensaje claro (Priority: P1)

**Goal**: Cualquier entrada inválida muestra el mensaje exacto de la spec y ningún importe; tras un error y un cálculo válido el mensaje desaparece.

**Independent Test**: Cada fila inválida de `quickstart.md` muestra su mensaje (con `role="alert"`) y no muestra importe.

### Tests for User Story 2 ⚠️ (escribir primero, deben fallar)

- [X] T021 [P] [US2] En `test/division.test.js` agregar pruebas de `validarEntrada` para cada caso inválido de `test/casosDePrueba.js`: lanza `ErrorDeEntrada` con el mensaje exacto; "0" personas → "Debe haber al menos una persona" (no "Número de personas inválido"); monto 0, "-50" y "abc" → "Monto inválido"; con varios errores a la vez gana el primero en orden monto → personas → propina
- [X] T022 [P] [US2] En `test/pantalla.test.jsx` agregar pruebas de `PantallaDivisor`: cada entrada inválida muestra el mensaje en un elemento `role="alert"` y NO muestra importe; error seguido de un cálculo válido borra el mensaje y muestra el importe; resultado y error nunca aparecen a la vez

### Implementation for User Story 2

- [X] T023 [US2] En `src/domain/validarEntrada.js` completar `validarEntrada` lanzando `ErrorDeEntrada` en este orden: (1) monto que no cumple la regex o es ≤ 0 → "Monto inválido"; (2) personas que no cumple `^\d+$` → "Número de personas inválido", y si vale 0 → "Debe haber al menos una persona"; (3) propina que no cumple la regex (vacía, negativa o no numérica) → "Propina inválida" (0 es válido)
- [X] T024 [US2] En `src/presentation/useDivisor.js` hacer que `calcular()` capture `ErrorDeEntrada` (no lanza hacia afuera): al fallar guarda `error = err.message` y `resultado = null`; al tener éxito guarda `resultado` y `error = null`
- [X] T025 [US2] En `src/presentation/PantallaDivisor.jsx` mostrar `error` en un elemento con `role="alert"` y no renderizar el importe cuando hay error (nunca ambos)
- [X] T026 [US2] Ejecutar `npm test` y confirmar que pasan T010, T011, T021 y T022

**Checkpoint**: US1 y US2 funcionan de forma independiente

---

## Phase 5: User Story 3 - Elegir el modo de redondeo (Priority: P2)

**Goal**: El usuario elige entre Exacto (por defecto) y Hacia arriba; el modo determina el importe al tocar "Calcular".

**Independent Test**: 10.00 / 3 personas / 0 %: Exacto → "3.33"; Hacia arriba → "4.00".

### Tests for User Story 3 ⚠️ (escribir primero, deben fallar)

- [X] T027 [P] [US3] En `test/division.test.js` agregar pruebas de `redondeoHaciaArriba` con los ejemplos de FR-009 (3.33→4, 2.40→3, 30→30, 2.001→3, 30.000000000000004→30) y una prueba de contrato LSP que recorra la lista `[redondeoExacto, redondeoHaciaArriba]` verificando que cada una tiene `aplicar`, devuelve `number` y es determinista
- [X] T028 [P] [US3] En `test/pantalla.test.jsx` agregar pruebas: el modo por defecto es "Exacto"; con 10/3/0 y "Hacia arriba" se muestra "4.00"; con "Exacto" se muestra "3.33"; cambiar el modo después de calcular NO cambia el resultado hasta volver a tocar "Calcular"

### Implementation for User Story 3

- [X] T029 [US3] Crear `src/data/redondeoHaciaArriba.js`: objeto con `aplicar(valor)` que devuelve `Math.ceil(valor - 1e-9)` (mismo margen que la versión Flutter): sube al siguiente entero, absorbe el error de punto flotante (30.000000000000004 → 30) y no pierde valores reales (2.001 → 3)
- [X] T030 [US3] En `src/main.jsx` importar `redondeoHaciaArriba` y registrar `estrategias = { exacto: redondeoExacto, arriba: redondeoHaciaArriba }`; `useDivisor` conserva `"exacto"` como modo inicial
- [X] T031 [US3] En `src/presentation/PantallaDivisor.jsx` agregar el selector de modo con las opciones "Exacto" y "Hacia arriba" (valores `exacto` y `arriba`, por defecto Exacto), enlazado a `modo`/`setModo` del hook; las opciones salen de las claves de `estrategias`, sin importar nada de `data`
- [X] T032 [US3] Ejecutar `npm test` y confirmar que pasan todas las pruebas, incluidas T027 y T028

**Checkpoint**: Las tres historias funcionan de forma independiente

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T033 [P] En `test/division.test.js` agregar pruebas de arquitectura (research D8): los archivos de `src/domain/` no importan `react`, `react-dom` ni usan `document`/`window`; `src/domain/` no importa de `data` ni `presentation`; `src/presentation/` no importa de `src/data/`; solo `src/main.jsx` importa de `src/data/`; leer los archivos con `fs` y revisar sus líneas `import`
- [X] T034 [P] Revisar que TODAS las funciones de `src/` tengan el comentario de la regla de la materia (qué hace, por qué, recibe, devuelve, errores) y que no haya secretos ni llamadas de red (`fetch`, `XMLHttpRequest`) en `src/`
- [X] T035 [P] Ejecutar `npm run lint` y `npm run build` y corregir lo que reporten
- [X] T036 Recorrer `specs/001-divisor-cuenta/quickstart.md`: `npm test` en verde y verificación manual con `npm run dev` de la tabla completa (incluido modo sin red, SC-004)
- [ ] T037 (OMITIDA por pedido del usuario: no editar `bitacora.md`) Actualizar `bitacora.md` con el registro de la implementación (qué se generó, qué se verificó)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Fase 1)**: sin dependencias; T001 → T002 → T003 (T004 en paralelo)
- **Foundational (Fase 2)**: depende de Setup; bloquea todas las historias
- **US1 (Fase 3)** → **US2 (Fase 4)** → **US3 (Fase 5)**: US2 y US3 extienden archivos que crea US1 (`validarEntrada.js`, `useDivisor.js`, `PantallaDivisor.jsx`, `main.jsx`), por lo que se hacen en orden de prioridad; cada una sigue siendo comprobable por separado con sus pruebas
- **Polish (Fase 6)**: depende de las historias deseadas

### Within Each Story

- Pruebas primero y en rojo → dominio/data → presentation → composición → ejecutar `npm test`
- Tareas que tocan el mismo archivo (`division.test.js`, `pantalla.test.jsx`, `validarEntrada.js`, `useDivisor.js`, `PantallaDivisor.jsx`, `main.jsx`) NO son [P] entre sí

### Parallel Opportunities

- Fase 2: T005, T006, T007, T008, T009 (archivos distintos)
- US1: T010 ∥ T011; T012 ∥ T013
- US2: T021 ∥ T022
- US3: T027 ∥ T028
- Polish: T033, T034, T035

## Parallel Example: User Story 1

```text
# Pruebas a la vez (archivos distintos):
Task: "Pruebas de dominio y redondeo exacto en test/division.test.js"
Task: "Pruebas de formateador y PantallaDivisor en test/pantalla.test.jsx"

# Implementación independiente a la vez:
Task: "Crear src/data/redondeoExacto.js"
Task: "Crear src/presentation/formateadorMoneda.js"
```

## Implementation Strategy

### MVP First (solo US1)

1. Fase 1 Setup → Fase 2 Foundational
2. Fase 3 (US1) → **PARAR y validar** con los escenarios 1–4
3. Demo si está listo

### Incremental Delivery

1. Setup + Foundational → base lista
2. US1 → probar → MVP
3. US2 → probar (entradas inválidas)
4. US3 → probar (modo hacia arriba)
5. Polish (arquitectura, comentarios, lint/build, quickstart)

## Notes

- `specs/001-divisor-cuenta/spec.md` es de solo lectura; no se modifica
- Commit después de cada tarea o grupo lógico
- Evitar: tareas vagas, conflictos de archivo y dependencias entre capas que rompan la regla `presentation -> domain <- data`

---

## Phase 7: Convergence

- [X] T038 Agregar el comentario de la regla de la materia (qué hace, por qué, recibe, devuelve, errores) a los manejadores en línea de `src/presentation/PantallaDivisor.jsx` (los `onChange` de Monto, Personas, Propina y modo, y el `map` de opciones), o extraerlos a funciones nombradas con su comentario, per Constitution V (partial)
- [X] T039 Revisar y borrar `public/icons.svg` (sprite de la plantilla Vite; no lo referencia `src/`, `index.html` ni la spec) per plan: Structure Decision, retiro de archivos de la plantilla (unrequested)
