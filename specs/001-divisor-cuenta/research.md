# Research: Divisor de cuenta

No quedaron `NEEDS CLARIFICATION` en el Technical Context. Estas son las decisiones técnicas.

## D1. Dónde se convierte el texto a número
- **Decision**: `validarEntrada` (domain) recibe los textos crudos de los tres campos y devuelve
  una `Cuenta` con números, o lanza `ErrorDeEntrada` con el mensaje exacto de la spec.
- **Rationale**: Las reglas de validez (FR-006, 007, 011, 012, 013) son reglas de negocio, no de UI;
  así son probables sin React. El cálculo (`calcularDivision`) recibe ya números válidos y no valida.
- **Alternatives**: validar en el hook (mezcla UI y reglas); `Number()` directo (acepta `""` como 0
  y `"1e3"`, incorrecto aquí).

## D2. Cómo se parsean monto, propina y personas
- **Decision**: expresiones regulares estrictas tras `trim()`. Monto/propina: `^\d+([.,]\d+)?$`
  (la coma se cambia por punto antes de `Number`). Personas: `^\d+$`.
- **Rationale**: Rechaza vacío, negativos, "abc", decimales en personas y notación científica con
  una sola regla simple. Los negativos fallan la regex y caen en el mismo mensaje que exige la spec.
- **Alternatives**: `parseFloat` (acepta "12abc"); `<input type="number">` (varía el separador
  según navegador/idioma, y oculta el texto inválido). Se usa `type="text"` con `inputMode="decimal"`.

## D3. Orden de validación
- **Decision**: monto → número de personas → propina (el orden de los campos en FR-002). Se
  informa solo el primer error.
- **Rationale**: La spec no define prioridad cuando hay varios errores a la vez; este orden es
  determinista y coincide con la pantalla. Es una decisión de plan, no de spec.
- **Alternatives**: mostrar todos los errores (la spec habla de "el mensaje", singular).

## D4. Personas = 0 frente a personas inválido
- **Decision**: `"0"` (entero ≥ 0 que vale 0) produce "Debe haber al menos una persona"; el resto
  de entradas inválidas produce "Número de personas inválido" (FR-006 vs FR-012).
- **Rationale**: La spec lo exige: "el 0 conserva su mensaje propio".

## D5. Contrato de redondeo y precisión
- **Decision**: contrato `estrategia = { aplicar(valor) -> number }`. `redondeoExacto` aplica
  `Math.round(v * 100) / 100`. `redondeoHaciaArriba` aplica `Math.ceil(valor - 1e-9)`
  (mismo margen que la versión Flutter). El importe sin redondear es `monto * (1 + propina / 100) / personas`.
- **Rationale**: En punto flotante, 30.00 puede salir como 30.000000000000004 y `ceil` daría 31
  (violaría FR-009: "si ya es un entero, se mantiene"). Restar un margen de 1e-9 antes del `ceil`
  absorbe ese error sin perder valores reales como 2.001 → 3 (normalizar a centavos primero daría 2.00 → 2,
  incorrecto); los ejemplos 3.33→4.00, 2.40→3.00, 30.00→30.00 y 2.001→3 de FR-009 se vuelven pruebas.
- **Alternatives**: aritmética entera en centavos de punta a punta (más robusta, pero más código del
  que necesita una pantalla); librería decimal (dependencia innecesaria).
- **Nota**: "exacto" redondea half-up a 2 decimales; es la lectura de FR-008.

## D6. Estado y dependencias en la UI
- **Decision**: `useDivisor({ validarEntrada, calcularDivision, estrategias })` mantiene con
  `useState` los textos de los campos, el modo elegido (por defecto `exacto`), el resultado y el
  mensaje de error. `calcular()` actualiza resultado o error; cambiar el modo NO recalcula
  (edge case de la spec).
- **Rationale**: DIP + una pantalla; sin store externo. Inyectar por parámetro permite probar el
  hook con dobles sin tocar `data`.
- **Alternatives**: Context/Redux/Zustand (prohibido por el pedido y excesivo).

## D7. Formateo
- **Decision**: `formateadorMoneda.formatear(n)` → `n.toFixed(2)`; sin símbolo (clarificación).
  Siempre con punto decimal, independiente del idioma del navegador.
- **Rationale**: `toLocaleString` cambiaría separadores según la configuración regional y
  rompería los resultados esperados ("27.50").

## D8. Cómo se hace cumplir la regla de dependencias
- **Decision**: pruebas en `test/division.test.js` que leen los archivos de `src/domain/` y
  fallan si importan `react`, `react-dom` o usan `document`/`window`; comprueban además que
  `src/presentation/` no importa de `src/data/` y que solo `src/main.jsx` importa de `data`.
- **Rationale**: Convierte las reglas de arquitectura de la constitución en verificación ejecutable.

## D9. Herramientas de prueba
- **Decision**: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`,
  `@testing-library/jest-dom` como devDependencies; script `"test": "vitest run"`; entorno `jsdom` y `setupFiles: ['./test/setup.js']` configurados en `vite.config.js`;
  las pruebas viven en `test/` (`division.test.js`, `pantalla.test.jsx`) y comparten datos de
  `test/casosDePrueba.js`.
- **Rationale**: Probar el hook y los escenarios de pantalla (tocar "Calcular") sin navegador real.
