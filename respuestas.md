# respuestas.md — Deber 2: Flutter → React con SDD

> **BORRADOR para revisión del estudiante.** Lo redactó el asistente a partir del repositorio
> (diffs, pruebas, historial de Git y transcripciones de la sesión). Cada cifra puede
> comprobarse con los comandos indicados. El estudiante debe leerlo, ajustar la interpretación
> y declarar qué partes del trabajo hizo el agente (ver «Declaración de método» al final).
> Evidencia completa y diffs: [`evidencia_parte8.md`](evidencia_parte8.md). Clasificación
> enunciado por enunciado: [`analisis_spec.md`](analisis_spec.md). Bitácora: [`bitacora.md`](bitacora.md).

## Resumen de métricas (bitácora)

| Métrica | Flutter (laboratorio) | React (este deber) |
|---|---:|---:|
| Minutos hasta la primera versión que compila | no registrado | 1807 min de reloj (30 h 07 m, incluye una pausa de más de 24 h); ≈ 16 min 45 s dentro de las sesiones del agente |
| Minutos hasta que pasan los 6 casos | no registrado | igual que arriba (9-oct 18:18:22; las 45 pruebas, 18:18:42) |
| Iteraciones con el agente | no registrado para `sdd` | 2 seguras (12:14 y 18:11) y 2 en discusión (ver bitácora) |
| Líneas escritas a mano | no registrado | _completar: el estudiante no editó código a mano que yo sepa_ |
| Enunciados modificados en la spec | — | **0 de 38** |
| Enunciados modificados en la Constitution | — | **9 de 17** (8 adaptadas + 1 reemplazada) |
| Líneas modificadas en el plan | — | **126** (65 añadidas, 61 eliminadas) |
| Casos de aceptación que pasan (0–6) | 6 | **6** (`npm test`: 45/45) |

El tiempo es un dato descriptivo secundario; no se usa para concluir qué enfoque es mejor.

---

## 1. ¿Qué porcentaje de la spec viajó intacto, con adaptación y no reutilizable?

Se analizaron **38 enunciados atómicos** (criterios de conteo y tabla completa en `analisis_spec.md`).

| Lectura | Intacto | Con adaptación | No viaja | % CÓMO |
|---|---:|---:|---:|---:|
| **B — estricta por redacción (cifra principal)** | **24 (63 %)** | **14 (37 %)** | 0 (0 %) | **0 %** |
| A — solo por contenido (contraste) | 38 (100 %) | 0 | 0 | 0 % |

Se adopta la lectura B como cifra principal por ser la conservadora: cuenta como adaptación todo
enunciado cuya redacción habría que cambiar al pasar de móvil a web, aunque su contenido no cambie.

- Los 14 enunciados con adaptación (lectura B) son los que usan vocabulario táctil/móvil
  («toca», «un solo toque», «dispositivo»). Es vocabulario de **plataforma** (móvil), no de
  Flutter: ningún enunciado nombra Flutter, Dart, widgets ni librerías.
- El umbral pedagógico de 30 % **no se supera** (0 %). Es un umbral de este deber, no una regla
  universal de SDD.
- Evidencia de que lo reutilizado fue literal: la spec se copió sin cambios y nunca se modificó.

```text
$ git diff --no-index -- ../divisor_cuenta/specs/001-divisor-cuenta/spec.md specs/001-divisor-cuenta/spec.md
(salida vacía; código de salida 0)
$ shasum ../divisor_cuenta/specs/001-divisor-cuenta/spec.md specs/001-divisor-cuenta/spec.md
2d77cfcd33f1a2e2d17b8766612d035c66bb6475  (ambos)
$ git log --oneline -- specs/001-divisor-cuenta/spec.md
f528793 spec kit + la misma spec del proyecto flutter      (un solo commit)
```

Tiempo, como contexto (no como criterio de calidad): desde `/speckit-plan` (8-oct 12:11:14) hasta los 6 casos en verde (9-oct 18:18:22) pasaron **30 h 07 m de reloj**, que incluyen una pausa de más de 24 h entre sesiones; dentro de las sesiones del agente fueron ≈ **16 min 45 s**. Ninguna de las dos cifras mide la calidad de la reutilización; la de Flutter no se registró, así que no hay comparación.

## 2. Constitution: idéntica / adaptada / reemplazada

Se compararon las 17 reglas de la constitución Flutter (`.specify/memory/constitution.md` v1.0.0
del laboratorio) con la generada para React.

| Clasificación | Reglas | Evidencia |
|---|---:|---|
| **Idéntica** | 7 | Todos los principios no tecnológicos: SOLID como exigencia comprobable, secretos, pruebas críticas, criterios → pruebas, regla de la materia, la constitución prevalece y las enmiendas con versión. Ej.: Flutter «Los secretos y las API keys MUST NOT guardarse en el repositorio» → React «Los secretos y API keys MUST NOT guardarse nunca en el repositorio». |
| **Adaptada en redacción** | 8 | SRP, OCP, LSP, ISP y DIP («clase» → «función o módulo», «interfaz» → contrato `aplicar(valor)`); capas (`lib/` → `src/`); dominio puro («`lib/domain/` MUST ser Dart puro: no importa `package:flutter`» → «`src/domain/` MUST NOT importar `react` ni nada del DOM: es JavaScript puro»); composición única (`main.dart` → `main.jsx`). La idea es la misma. |
| **Reemplazada** | 1 | «Antes de dar por terminado un cambio MUST ejecutarse `flutter analyze` y `flutter test`, y las verificaciones por `grep`» → en React solo queda «Las specs, planes y revisiones MUST verificar el cumplimiento de estos principios», sin comandos. Los comandos de Flutter no se pueden conservar (no existen en React); la regla «verificar antes de cerrar» se debilitó. |
| **Omitida** | 1 | «La guía de trabajo del agente está en `CLAUDE.md`»: el proyecto web no tiene `CLAUDE.md` y el prompt del enunciado no lo pedía. |

- **Reglas nuevas inventadas por el agente:** ninguna con contenido propio. El agente añadió una
  sección «Governance» que el prompt no incluía; equivale a las reglas de gobernanza de Flutter,
  con la regla de verificación reducida (fila «Reemplazada»).
- **Observación:** la constitución Flutter no contenía ninguna librería (no hay Riverpod ni
  similares), así que no hubo reglas tecnológicas «permanentes» que reemplazar.
- Nota: las líneas `Verificación: grep …` de la versión Flutter no están en la React; se
  sustituyen por los `git grep` de la Parte 7.6 (todos limpios, ver `evidencia_parte8.md`).

## 3. ¿Hubo que modificar la spec para implementar React?

**No.** La spec no se modificó en ningún momento (un solo commit, diff vacío; ver pregunta 1).

**Qué permitió reutilizarla sin cambios.** La spec describe comportamiento observable y
mensajes literales («Debe haber al menos una persona», «Monto inválido», «27.50»…), reglas de
negocio (fórmula, dos modos de redondeo) y restricciones («sin red ni base de datos»), y no
nombra framework, librería, carpeta ni widget. Eso hizo posible que el plan React se escribiera
sin tocar el QUÉ.

**`/speckit-analyze` no encontró supuestos de Flutter escondidos.** Resultado: 0 críticos, 10
hallazgos (2 MEDIUM, 8 LOW), cobertura del 100 % de los 13 FR y los 4 SC, 37 tareas. Los
hallazgos relacionados con la spec no dependen de Flutter, ya existían en el laboratorio y se
**dejaron sin corregir** a propósito para no alterar la copia:

- **F1:** SC-001 dice «6 escenarios» pero la spec tiene 11 (10 distintos).
- **B2:** la descripción original dice «al entero más cercano» y FR-009 define «subir al siguiente
  entero».

Otras observaciones relevantes:

- **I2 / H3:** la spec trae el metadato `Feature Branch: sdd`; el plan React lo señaló y aclaró que
  «el directorio del feature es el que manda». Es contexto de Git, no del QUÉ ni del CÓMO.
- **Vocabulario táctil (H1):** el agente lo copió a los documentos del plan («tocar "Calcular"»),
  sin que bloqueara nada.
- **B1** (no es de la spec): el plan inicial normalizaba a centavos antes del `ceil`, lo que daba 2
  para 2.001 y contradecía FR-009. Se corrigió en el plan (iteración 2) antes de implementar.

No hay versión «antes / después» de la spec porque no hubo cambio.

## 4. Los seis casos de aceptación: ¿cambió algo?

**No cambió ningún caso**: ni nombres, ni entradas, ni valores esperados, ni mensajes. Comparación
normalizada de `test/casos_de_prueba.dart` y `test/casosDePrueba.js` (`evidencia_parte8.md`, 8.2):
las únicas diferencias del diff son saltos de línea del formato.

| # | Entrada | Esperado | Flutter | React |
|---|---|---|:-:|:-:|
| 1 | 100.00 / 4 / 10 % / exacto | 27.50 | ✅ | ✅ |
| 2 | 90.00 / 3 / 0 % / exacto | 30.00 | ✅ | ✅ |
| 3 | 50.00 / 0 personas | «Debe haber al menos una persona», sin resultado | ✅ | ✅ |
| 4 | monto no numérico | «Monto inválido» | ✅ | ✅ |
| 5 | 10.00 / 3 / 0 % / exacto | 3.33 | ✅ | ✅ |
| 6 | 10.00 / 3 / 0 % / hacia arriba | 4.00 | ✅ | ✅ |

```text
$ npm test
 Test Files  2 passed (2)
      Tests  45 passed (45)
```

Diferencias que sí hubo, **por la tecnología** y no por el QUÉ:

- Los casos tienen campos numéricos (`NaN` en el caso 4), pero en React `validarEntrada` recibe
  los textos del formulario; las pruebas convierten con `String(...)` (`String(NaN)` → «NaN» y
  falla la validación, como se espera).
- El resultado del caso 4 en la pantalla se prueba con la entrada «abc».

Cobertura: los 6 casos son un **subconjunto** de la spec (la spec tiene 10 escenarios distintos).
Coma decimal, monto ≤ 0, propina inválida y personas inválido no tenían pruebas en Flutter. En
React sí están cubiertos (45 pruebas), por lo que «6/6» no equivale a «toda la spec cumplida»;
lo que se comprobó además es el resto de escenarios y la verificación manual de `quickstart.md`.

## 5. ¿Qué partes del plan Flutter dejaron de tener sentido en React?

El plan cambió casi por completo: **126 líneas modificadas** (65 añadidas, 61 eliminadas) sobre
105 → 109 líneas. Por bloques (estimación del asistente, 35 enunciados: 5 sin cambio, 30
modificados, ≈ 86 %), todo lo que describe tecnología cambió; solo se conservó lo neutral
(almacenamiento N/A, fecha, enlace a la spec, «sin violaciones»).

```text
$ git diff --no-index --stat -- ../divisor_cuenta/specs/001-divisor-cuenta/plan.md specs/001-divisor-cuenta/plan.md
 .../specs => specs}/001-divisor-cuenta/plan.md | 126 +++++++++++----------
 1 file changed, 65 insertions(+), 61 deletions(-)
```

Ejemplos concretos (más de tres):

1. **Plataforma y compilación.** «Target Platform: Android e iOS; comprobación de construcción
   `flutter build apk --debug`» → «Navegador web moderno» y `npm run build`. Dejó de tener sentido
   todo lo relativo a móvil.
2. **Estado.** «estado local con `setState`» → `useState` dentro del hook `useDivisor`.
3. **Pruebas.** `flutter_test` con pruebas de widget → Vitest + jsdom + Testing Library.
4. **Contrato de redondeo.** «el redondeo es una interfaz de un solo método con dos implementaciones»
   (`EstrategiaRedondeo`, `implements`) → en JavaScript no hay interfaces: el contrato es un
   objeto con `aplicar(valor)` y una función `esEstrategiaValida`.
5. **Estructura de archivos.** `lib/**/*.dart` en `snake_case` → `src/**/*.js(x)` en `camelCase`;
   `main.dart` → `main.jsx`.
6. **Dónde vive la lectura del texto.** El plan Flutter ponía `LectorNumeros` en `presentation`
   (convertir texto → número, «sin darle al `domain` la responsabilidad de interpretar texto»). En React la
   conversión quedó en `domain` (`validarEntrada` recibe los textos, decisión D1 de `research.md`).
7. **Documentación.** Flutter: «No hay `contracts/`». React: carpeta `contracts/` con dos archivos.
8. **Regla de arquitectura ejecutable.** React añadió pruebas Vitest que leen los archivos y fallan
   si `domain` importa `react` (research D8); en Flutter la verificación era por `grep`.
9. **Decisión que vivía en el código.** En Flutter el redondeo hacia arriba se arregló con un
   margen `ceil(v - 1e-9)` (commit `e3294b7`), pero esa decisión **no estaba en el plan**; el plan
   React la reinventó distinto (normalizar a centavos) y `/speckit-analyze` lo detectó (B1).

Cómo se adaptaron: cada fila de la tabla «Constitution Check» del plan se reescribió con la
terminología de React (módulos y funciones en lugar de clases; `main.jsx` en lugar de
`main.dart`), y las tareas siguieron el mismo reparto por historias de usuario.

## 6. Artefacto más y menos reutilizable

**Más reutilizable: la spec y los casos de prueba.**
- Spec: 0 de 38 enunciados modificados; diff vacío; un solo commit.
- Casos: los 6 casos idénticos en valores y mensajes; solo cambió la sintaxis del archivo.
- La constitución también viajó bien (7 idénticas y 8 adaptadas de 17, y 0 con librerías).

**Menos reutilizable: el código, seguido del plan y de las tareas.**
- Código: 0 líneas reutilizadas (Dart → JavaScript/JSX); la lógica se reescribió módulo por módulo
  (263 líneas en `src/` frente a 294 en `lib/`).
- Plan: 126 líneas modificadas; ≈ 86 % de sus enunciados cambiaron.
- Tareas: ≈ 210 líneas modificadas sobre 194 → 200 (el archivo se regeneró entero); 29 tareas en
  Flutter frente a 39 en React.

```text
$ git diff --no-index --stat -- <flutter>/tasks.md specs/001-divisor-cuenta/tasks.md
 1 file changed, 108 insertions(+), 102 deletions(-)
$ git diff --no-index --stat -- <flutter>/research.md specs/001-divisor-cuenta/research.md
 1 file changed, 60 insertions(+), 60 deletions(-)
```

**Matiz importante.** La hipótesis «el QUÉ viaja y el CÓMO se rehace» se cumplió, pero hubo
conocimiento que quedó **solo en el código** y no viajó con los artefactos: el margen `1e-9` del
redondeo hacia arriba. Lo detectó `/speckit-analyze` (B1) porque el plan React lo había resuelto
de otra forma; sin ese paso, el cambio de comportamiento habría pasado a código. Y la spec trae
sus propios defectos (F1, B2), que migrar a otra tecnología no arregla ni empeora.

---

## Salidas (para pegar en la entrega)

Ver `evidencia_parte8.md` (diffs de spec, casos, plan y constitución; pruebas, build y `git grep`).

```text
$ npm test            →  Test Files 2 passed (2) · Tests 45 passed (45)
$ npm run build       →  ✓ built in 66ms
$ npm run lint        →  (sin avisos)
$ git grep -n "from 'react'" -- src/domain/                              →  (nada)
$ git grep -n "redondeoExacto\|redondeoHaciaArriba" -- src/ | fuera de src/data  →  solo src/main.jsx
$ git grep -n "instanceof\|=== 'exacto'\|=== 'arriba'" -- src/domain/calcularDivision.js  →  (nada)
$ git grep -n "toFixed\|inválido\|al menos una persona" -- src/domain/calcularDivision.js  →  (nada)
```

`/speckit-converge` (19:35): «Converged», 0 brechas. Verificación manual (T036) de todas las filas de
`quickstart.md` en el navegador: correcta; la página solo pidió archivos a `localhost` (no se
desconectó la red físicamente).

## Declaración de método

- **Hecho por el agente:** constitución, plan, tareas, implementación y pruebas (flujo Spec Kit);
  además, el borrador de `analisis_spec.md`, la copia de `test/casosDePrueba.js` desde el
  enunciado (Parte 7.2, que pedía escribirlo a mano) y este borrador de `respuestas.md`.
- **Decidió el estudiante:** cuándo avanzar cada paso, los prompts enviados y la aceptación de las
  correcciones propuestas (iteraciones 1 y 2).
- **Pendiente de decidir:** si las iteraciones 3 y 4 cuentan, el criterio de reporte del tiempo
  y la revisión final de `analisis_spec.md` y de este documento.
- Las tareas `T009` y `T037` se omitieron a propósito (instrucción del estudiante en el prompt de
  `/speckit-implement`).
