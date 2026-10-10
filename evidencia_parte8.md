# Evidencia de la Parte 8

Generado el 2026-10-09 con los comandos indicados. Rutas relativas a `divisor_cuenta_web/`.

## 8.1 Spec: diff Flutter vs React
```bash
git diff --no-index -- ../divisor_cuenta/specs/001-divisor-cuenta/spec.md specs/001-divisor-cuenta/spec.md
```
```text
(salida vacía; código de salida: 0)
2d77cfcd33f1a2e2d17b8766612d035c66bb6475  ../divisor_cuenta/specs/001-divisor-cuenta/spec.md
2d77cfcd33f1a2e2d17b8766612d035c66bb6475  specs/001-divisor-cuenta/spec.md
```

Historial de la spec en el repo React (un solo commit; nunca se modificó después):
```text
f528793 spec kit + la misma spec del proyecto flutter
```

## 8.2 Casos de prueba: Flutter vs React
Valores extraídos de `test/casos_de_prueba.dart` y `test/casosDePrueba.js` (normalizados) y comparados:
```text
--- Flutter
nombre: '1. reparto normal'
monto: 100.00 personas: 4 propina: 10 modo: 'exacto'
esperado: 27.50
nombre: '2. sin propina'
monto: 90.00 personas: 3 propina: 0 modo: 'exacto'
esperado: 30.00
nombre: '3. cero personas'
monto: 50.00 personas: 0 propina: 0 modo: 'exacto'
errorEsperado: 'Debe haber al menos una persona'
nombre: '4. monto no numerico'
monto: NaN personas: 4 propina: 0 modo: 'exacto'
errorEsperado: 'Monto inválido'
nombre: '5. redondeo exacto'
monto: 10.00 personas: 3 propina: 0 modo: 'exacto'
esperado: 3.33
nombre: '6. redondeo hacia arriba'
monto: 10.00 personas: 3 propina: 0 modo: 'arriba'
esperado: 4.00
--- React
nombre: '1. reparto normal'
monto: 100.00 personas: 4 propina: 10 modo: 'exacto' esperado: 27.50
nombre: '2. sin propina'
monto: 90.00 personas: 3 propina: 0 modo: 'exacto' esperado: 30.00
nombre: '3. cero personas'
monto: 50.00 personas: 0 propina: 0 modo: 'exacto'
errorEsperado: 'Debe haber al menos una persona'
nombre: '4. monto no numerico'
monto: NaN personas: 4 propina: 0 modo: 'exacto'
errorEsperado: 'Monto inválido'
nombre: '5. redondeo exacto'
monto: 10.00 personas: 3 propina: 0 modo: 'exacto' esperado: 3.33
nombre: '6. redondeo hacia arriba'
monto: 10.00 personas: 3 propina: 0 modo: 'arriba' esperado: 4.00
```

## 8.3 Plan: diff Flutter vs React
```bash
git diff --no-index --stat -- ../divisor_cuenta/specs/001-divisor-cuenta/plan.md specs/001-divisor-cuenta/plan.md
```
```text
 .../specs => specs}/001-divisor-cuenta/plan.md     | 126 +++++++++++----------
 1 file changed, 65 insertions(+), 61 deletions(-)
```

Diff completo:
```diff
diff --git a/../divisor_cuenta/specs/001-divisor-cuenta/plan.md b/specs/001-divisor-cuenta/plan.md
index cc5eccc..ed5408f 100644
--- a/../divisor_cuenta/specs/001-divisor-cuenta/plan.md
+++ b/specs/001-divisor-cuenta/plan.md
@@ -1,58 +1,57 @@
 # Implementation Plan: Divisor de cuenta
 
-**Branch**: `sdd` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)
+**Branch**: `001-divisor-cuenta` (la spec menciona `sdd`; el directorio del feature es el que manda) | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)
 
-**Input**: Feature specification from `/specs/001-divisor-cuenta/spec.md`
+**Input**: Feature specification from `/specs/001-divisor-cuenta/spec.md` (solo lectura, no se modifica)
 
 ## Summary
 
-App Flutter de una sola pantalla que calcula cuánto paga cada persona: (monto + propina sobre el
-monto) ÷ personas, con dos modos de redondeo intercambiables (exacto y hacia arriba). El cálculo
-vive en un `domain` de Dart puro; el redondeo es una interfaz de un solo método con dos
-implementaciones; la pantalla recibe sus dependencias por constructor y `main.dart` es el único
-punto de composición. Sin paquetes externos ni red.
+App de una sola pantalla que divide la cuenta de un restaurante: monto + propina %, entre N
+personas, con redondeo exacto o hacia arriba. Se implementa en React + Vite (JavaScript) con tres
+capas (`presentation -> domain <- data`). El dominio es JavaScript puro: valida y convierte la
+entrada, calcula y delega el redondeo a una estrategia (`aplicar(valor)`). Las estrategias viven
+en `data` y se inyectan desde `src/main.jsx`. El estado de la pantalla es local (`useState`) dentro
+del hook `useDivisor`, que recibe sus dependencias. Pruebas con Vitest.
 
 ## Technical Context
 
-**Language/Version**: Dart / Flutter, SDK estable (instalado: Flutter 3.47.1)
+**Language/Version**: JavaScript (ES modules), React 19 (ya en `package.json`)
 
-**Primary Dependencies**: ninguna externa; solo el SDK de Flutter
+**Primary Dependencies**: React, ReactDOM, Vite. Sin librerías de estado externas.
 
-**Storage**: N/A (sin red ni base de datos; FR-010)
+**Storage**: N/A (sin red ni base de datos, FR-010)
 
-**Testing**: `flutter_test` (pruebas de `domain` en Dart puro y pruebas de widget)
+**Testing**: Vitest (+ jsdom y @testing-library/react solo para probar el hook y la pantalla)
 
-**Target Platform**: Android e iOS (la comprobación de construcción es `flutter build apk --debug`)
+**Target Platform**: Navegador web moderno; funciona sin conexión
 
-**Project Type**: mobile-app (una sola pantalla)
+**Project Type**: web-app de una sola pantalla (frontend únicamente)
 
-**Performance Goals**: N/A; un cálculo aritmético por toque
+**Performance Goals**: cálculo instantáneo (operaciones aritméticas simples)
 
-**Constraints**: offline; sin paquetes externos; estado local con `setState`; `lib/domain/` sin
-`package:flutter`
+**Constraints**: offline, sin secretos en el repo, `src/domain/` sin imports de `react` ni DOM
 
-**Scale/Scope**: 1 pantalla, 2 modos de redondeo, 13 requisitos funcionales
+**Scale/Scope**: 1 pantalla, 5 módulos de dominio, 2 estrategias de redondeo
 
 ## Constitution Check
 
 *GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*
 
-| Principio | Cómo lo cumple el plan | Estado |
-|---|---|---|
-| I. SRP | `ValidarEntrada` solo valida; `CalcularDivision` solo calcula; `FormateadorMoneda` solo formatea; `LectorNumeros` solo convierte texto en números | Pasa |
-| I. OCP | Un redondeo nuevo es una clase nueva que implementa `EstrategiaRedondeo` más una línea en `main.dart`; no se edita ninguna clase existente | Pasa |
-| I. LSP | `CalcularDivision` usa la interfaz sin `is`/`as`; ambas estrategias son intercambiables | Pasa |
-| I. ISP | `EstrategiaRedondeo` tiene un solo método | Pasa |
-| I. DIP | `DivisorController` recibe abstracciones/`domain` por constructor; no nombra clases de `data` | Pasa |
-| II. Capas | `presentation -> domain <- data`; `domain` sin `package:flutter` | Pasa |
-| II. Composición | Solo `main.dart` instancia `RedondeoExacto()` y `RedondeoHaciaArriba()` | Pasa |
-| III. Seguridad | No hay secretos, claves ni red | Pasa |
-| IV. Pruebas | Los 6 escenarios son pruebas ejecutables; más pruebas de widget y de LSP | Pasa |
-| V. Regla de la materia | Clases pequeñas con un propósito claro, explicables una a una | Pasa |
-
-Sin violaciones; no se requiere la sección Complexity Tracking.
-
-**Re-evaluación tras el diseño (Phase 1)**: sin cambios; todos los principios siguen cumpliéndose.
+| Principio | Cumplimiento en el plan | Estado |
+|-----------|-------------------------|--------|
+| I. SOLID: SRP | `validarEntrada` solo valida/convierte; `calcularDivision` solo calcula; `formateadorMoneda` solo formatea | OK |
+| I. SOLID: OCP | Nueva regla de redondeo = nuevo archivo en `data/` + registrarla en `main.jsx`; `calcularDivision` no cambia | OK |
+| I. SOLID: LSP | `redondeoExacto` y `redondeoHaciaArriba` cumplen el mismo contrato `aplicar(valor) -> number` | OK |
+| I. SOLID: ISP | Contrato de estrategia = 1 método; el hook recibe solo las funciones que usa | OK |
+| I. SOLID: DIP | `useDivisor` recibe `calcularDivision`, `validarEntrada` y las estrategias por parámetro; no importa `data` | OK |
+| II. Capas y dependencias | `presentation` importa solo de `domain`; `data` importa solo de `domain`; `domain` no importa a nadie | OK |
+| II. `domain` puro | Sin `react` ni DOM en `src/domain/` (se verifica con una prueba/lint de imports) | OK |
+| II. Composición única | Solo `src/main.jsx` hace `new`/instancia las estrategias concretas | OK |
+| III. Seguridad | Sin API keys ni secretos; no hay red | OK |
+| IV. Pruebas | Cada criterio de aceptación de la spec → prueba Vitest | OK |
+| V. Regla de la materia | Cada función con comentario breve: qué hace, por qué, recibe, devuelve, errores | OK |
+
+Re-evaluación post-diseño: sin violaciones. No se requiere Complexity Tracking.
 
 ## Project Structure
 
@@ -60,46 +59,51 @@ Sin violaciones; no se requiere la sección Complexity Tracking.
 
 ```text
 specs/001-divisor-cuenta/
-├── plan.md              # Este archivo
-├── research.md          # Decisiones y alternativas
-├── data-model.md        # Entidades, reglas de validación y la interfaz
-├── quickstart.md        # Cómo ejecutar y verificar
-└── tasks.md             # Lo genera /speckit-tasks (no este comando)
+├── plan.md
+├── research.md
+├── data-model.md
+├── quickstart.md
+├── contracts/
+│   ├── estrategia-redondeo.md
+│   └── dominio-y-hook.md
+└── tasks.md             # lo genera /speckit-tasks
 ```
 
-No hay `contracts/`: la app no expone interfaces externas (sin red ni API).
-
 ### Source Code (repository root)
 
 ```text
-lib/
+src/
 ├── domain/
-│   ├── cuenta.dart                    # entidad: monto, personas, propina
-│   ├── resultado.dart                 # entidad: importe por persona
-│   ├── estrategia_redondeo.dart       # interfaz de un método
-│   ├── calcular_division.dart         # caso de uso: calcula
-│   └── validar_entrada.dart           # caso de uso: valida y devuelve el mensaje
+│   ├── cuenta.js              # crearCuenta(...) / forma de la entidad Cuenta
+│   ├── resultado.js           # crearResultado(importePorPersona)
+│   ├── validarEntrada.js      # textos crudos -> Cuenta, o ErrorDeEntrada con el mensaje
+│   ├── estrategiaRedondeo.js  # contrato: aplicar(valor) + verificación de forma
+│   └── calcularDivision.js    # (cuenta, estrategia) -> Resultado
 ├── data/
-│   ├── redondeo_exacto.dart           # implementación
-│   └── redondeo_hacia_arriba.dart     # implementación
+│   ├── redondeoExacto.js      # aplicar: redondea a 2 decimales
+│   └── redondeoHaciaArriba.js # aplicar: sube al siguiente entero
 ├── presentation/
-│   ├── divisor_controller.dart        # recibe sus dependencias por constructor
-│   ├── formateador_moneda.dart        # solo formatea (dos decimales, sin símbolo)
-│   ├── lector_numeros.dart            # solo convierte texto en números (punto o coma)
-│   └── pantalla_divisor.dart          # solo dibuja
-└── main.dart                          # único punto de composición
+│   ├── useDivisor.js          # hook con useState; recibe sus dependencias
+│   ├── formateadorMoneda.js   # número -> "27.50" (sin símbolo)
+│   └── PantallaDivisor.jsx    # única pantalla
+└── main.jsx                   # ÚNICO punto de composición
 
 test/
-├── casos_de_prueba.dart               # los 6 casos de la spec (tabla de datos)
-├── division_test.dart                 # recorre la tabla + prueba de LSP (sin widgets)
-└── pantalla_test.dart                 # pruebas de widget
+├── setup.js                   # configuración de Vitest (jest-dom / limpieza entre pruebas)
+├── casosDePrueba.js           # datos compartidos: casos de los escenarios de la spec
+├── division.test.js           # domain + data: validarEntrada, calcularDivision, estrategias
+│                              #   (contrato LSP) y reglas de arquitectura (pureza de domain,
+│                              #   dependencias entre capas)
+└── pantalla.test.jsx          # presentation: formateadorMoneda, useDivisor y PantallaDivisor
+                               #   (escenarios de aceptación tocando "Calcular")
 ```
 
-**Structure Decision**: tres capas como en la constitución. Se sigue el reparto de archivos del
-plan del curso, con una clase adicional en `presentation` (`LectorNumeros`), necesaria para cumplir
-FR-013 y las respuestas de clarificación sin darle al `domain` la responsabilidad de interpretar
-texto. Ver `research.md`, decisión 3.
+**Structure Decision**: proyecto único de frontend con las tres capas de la constitución. Los
+archivos de la plantilla Vite (`App.jsx`, `App.css`, `index.css`) se reemplazan/retiran al
+implementar; `App.jsx` no se usa porque la pantalla es `PantallaDivisor.jsx`. Las pruebas viven en
+`test/` (singular), en cuatro archivos: `setup.js`, `casosDePrueba.js`, `division.test.js` y
+`pantalla.test.jsx`.
 
 ## Complexity Tracking
 
-Sin violaciones de la constitución que justificar.
+Sin violaciones de la constitución; tabla no aplica.
```

## Constitución: diff Flutter vs React
```text
 .../.specify => .specify}/memory/constitution.md   | 64 ++++++++++------------
 1 file changed, 28 insertions(+), 36 deletions(-)
```

## Pruebas, build y verificaciones SOLID (estado del commit 8b1d066)
```text
 Test Files  2 passed (2)
      Tests  45 passed (45)
✓ built in 66ms
git grep from 'react' en src/domain:
(nada)
implementaciones concretas fuera de src/data:
src/main.jsx:7:import redondeoExacto from './data/redondeoExacto.js'
src/main.jsx:8:import redondeoHaciaArriba from './data/redondeoHaciaArriba.js'
src/main.jsx:11:const estrategias = { exacto: redondeoExacto, arriba: redondeoHaciaArriba }
instanceof/modo en calcularDivision:
(nada)
toFixed/mensajes en calcularDivision:
(nada)
```
