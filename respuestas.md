# respuestas.md — Deber 2: Flutter → React con SDD

> **BORRADOR para revisión del estudiante.** Lo redactó el asistente a partir del repositorio
> (diffs, pruebas, historial de Git y transcripciones de la sesión). Cada cifra puede
> comprobarse con los comandos indicados. El estudiante debe leerlo, ajustar la interpretación
> y declarar qué partes del trabajo hizo el agente (ver «Declaración de método» al final).
> **Repositorios:** [divisor_cuenta (Flutter, rama `sdd`)](https://github.com/mpintor15/divisor_cuenta/tree/sdd) ·
> [divisor_cuenta_web (React)](https://github.com/mpintor15/divisor_cuenta_web)
>
> Evidencia completa y diffs: [`evidencia_parte8.md`](evidencia_parte8.md). Clasificación
> enunciado por enunciado: [`analisis_spec.md`](analisis_spec.md). Bitácora: [`bitacora.md`](bitacora.md).

## Resumen de métricas (bitácora)

| Métrica | Flutter (laboratorio) | React (este deber) |
|---|---:|---:|
| Minutos hasta la primera versión que compila | no registrado | 1807 min de reloj (30 h 07 m, incluye una pausa de más de 24 h); ≈ 16 min 45 s dentro de las sesiones del agente |
| Minutos hasta que pasan los 6 casos | no registrado | igual que arriba (9-oct 18:18:22; las 45 pruebas, 18:18:42) |
| Iteraciones con el agente | no registrado para `sdd` | **3** (8-oct 12:14; 9-oct 18:11 y 19:30). El reenvío del 19:29 no cuenta: no produjo cambios |
| Líneas escritas a mano | no registrado | **0** |
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

**Evidencia lado a lado de las 8 reglas adaptadas** (Flutter `v1.0.0` → React):

| Regla | Constitución Flutter | Constitución React |
|---|---|---|
| SRP | «una clase, una razón de cambio. El cálculo MUST NOT validar ni formatear» | «una función o módulo tiene una sola razón de cambio. El cálculo no valida ni formatea» |
| OCP | «MUST NOT obligar a editar las clases que ya existen; basta con crear una clase nueva que implemente la interfaz» | «MUST NOT obligar a editar los módulos que ya existen» |
| LSP | «cualquier implementación de una interfaz MUST poder sustituir a otra» | «cualquier implementación de la interfaz de redondeo MUST poder sustituir a otra» |
| ISP | «las interfaces MUST ser pequeñas; nadie depende de métodos que no usa» | «las interfaces son pequeñas; ningún módulo depende de funciones que no usa» |
| DIP | «nunca de clases concretas de `data`» | «nunca de implementaciones concretas de `data`» |
| Capas | «`lib/presentation`, `lib/domain` y `lib/data`» | «`src/presentation`, `src/domain` y `src/data`» |
| Dominio puro | «`lib/domain/` MUST ser Dart puro: no importa `package:flutter`» | «`src/domain/` MUST NOT importar `react` ni nada del DOM: es JavaScript puro» |
| Composición | «`main.dart` MUST ser el ÚNICO lugar donde se instancian implementaciones concretas» | «`src/main.jsx` es el ÚNICO lugar donde se instancian implementaciones concretas» |

**Por qué se adaptan y no se reemplazan:** cada regla protege lo mismo (una sola responsabilidad,
dependencias hacia el dominio, composición en un único punto). Cambian los nombres que dependen del
lenguaje (clase/módulo, interfaz/contrato, `lib/`/`src/`, `package:flutter`/`react`). Una observación
de detalle: en varias reglas React el agente usó una formulación menos normativa que Flutter (por
ejemplo «es» en lugar de «MUST ser» en la composición, «son pequeñas» en lugar de «MUST ser
pequeñas» en ISP). Esa redacción viene del prompt de la Parte 4, no de una decisión del agente, y
no cambia la idea, pero sí el rigor con que está dicha.

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

**Por qué F1 y B2 no se corrigieron.** El protocolo de la Parte 8.1 (documentar, commit separado,
antes y después) solo aplica cuando un enunciado **bloquea** planificar React. Ni F1 ni B2 bloquearon
nada: son defectos de la propia spec, presentes igual en la versión Flutter, y las tareas ya cubrían
los 11 escenarios. Corregirlos habría bajado el porcentaje de la spec reutilizada sin cambios por una
razón ajena a la tecnología, así que se reportan como hallazgos y la copia queda intacta. La migración
no los arregla ni los empeora.

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

Dos matices sobre cómo se ejecutan los 6 casos en React:

- **Un `it()` por caso solo en parte.** Los casos 1, 2 y 5 tienen su propia prueba (con `caso.nombre`);
  los casos 3 y 4 (los de error) se recorren dentro de una sola prueba y el 6 tiene una prueba
  aparte. No se aplicó el ajuste opcional de la Parte 7.3 (un `it()` por cada uno y una prueba de
  LSP con el mismo `calcularDivision` y las dos estrategias); en su lugar hay pruebas de contrato
  por estrategia. Los seis siguen pasando; la diferencia es de organización de las pruebas.
- **El único cambio de comportamiento que casi ocurre no afecta a los 6 casos.** El plan inicial
  daba 2 para 2.001 en modo «hacia arriba» (hallazgo B1). Los valores esperados de los 6 casos no
  se veían afectados (ninguno usa esa entrada), y el error de diseño del plan se corrigió antes de
  implementar y se fijó con una prueba (2.001 → 3). Fue un error de diseño del plan, no una
  necesidad de la tecnología.

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

Cinco ejemplos concretos, con la cita de cada plan:

| # | Qué dejó de tener sentido | Plan Flutter | Plan React | Cómo se adaptó |
|---|---|---|---|---|
| 1 | **Plataforma y compilación móvil** | «Target Platform: Android e iOS (la comprobación de construcción es `flutter build apk --debug`)»; «Project Type: mobile-app» | «Target Platform: Navegador web moderno; funciona sin conexión»; «Project Type: web-app de una sola pantalla (frontend únicamente)» | Desaparece todo lo móvil. El plan React ya no menciona un comando de construcción; `npm run build` solo aparece después, como tarea T035. |
| 2 | **Gestión del estado** | «estado local con `setState`» (restricción) | «El estado de la pantalla es local (`useState`) dentro del hook `useDivisor`» | El estado pasa a un hook que recibe sus dependencias por parámetro. |
| 3 | **Herramienta de pruebas** | «`flutter_test` (pruebas de `domain` en Dart puro y pruebas de widget)» | «Vitest (+ jsdom y @testing-library/react solo para probar el hook y la pantalla)» | Cambia el runner, las librerías y el entorno (`jsdom`); las pruebas de dominio siguen siendo puras. |
| 4 | **Contrato de redondeo** | «el redondeo es una interfaz de un solo método con dos implementaciones» (`EstrategiaRedondeo`, `implements`) | «Contrato de estrategia = 1 método»; `estrategiaRedondeo.js`: «contrato: aplicar(valor) + verificación de forma» | JavaScript no tiene interfaces: el contrato es un objeto con `aplicar(valor)` y una función que comprueba su forma. |
| 5 | **Dónde se lee el texto escrito** | `lector_numeros.dart` en `presentation`: «solo convierte texto en números (punto o coma)», justificado como «una clase adicional en `presentation` (`LectorNumeros`)» | «El dominio es JavaScript puro: valida y convierte la entrada»; `validarEntrada.js`: «textos crudos -> Cuenta, o ErrorDeEntrada con el mensaje» | La conversión pasó a `domain` y se eliminó la clase intermedia. Es un cambio de **diseño**, no solo de sintaxis. |

Cómo se adaptó el resto: cada fila de la tabla «Constitution Check» del plan se reescribió con la
terminología de React (módulos y funciones en lugar de clases; `main.jsx` en lugar de `main.dart`),
y la estructura de archivos pasó de `lib/**/*.dart` en `snake_case` a `src/**/*.js(x)` en `camelCase`.
Las tareas siguieron el mismo reparto por historias de usuario.

Un efecto menos obvio: una decisión que estaba **solo en el código Flutter** (el margen `1e-9` del
redondeo hacia arriba, commit `e3294b7`) no estaba en el plan, y por eso el plan React propuso otra
(hallazgo B1). Esto se desarrolla en la pregunta 6.

## 6. Artefacto más y menos reutilizable

Medida usada: líneas modificadas por `git diff --no-index --stat` entre el artefacto de Flutter y el
de React (inserciones + eliminaciones), junto con la lectura de qué cambió.

| Artefacto | Líneas modificadas | Lectura |
|---|---:|---|
| **Spec** (`spec.md`) | **0** | Viaja intacta (diff vacío, SHA-1 igual). |
| **Casos de prueba** | **0 en valores** | Los 6 casos son idénticos en nombres, entradas, esperados y mensajes; solo cambia la sintaxis del archivo (`.dart` → `.js`). |
| **Constitución** | 28 + 36 = 64 | 7 reglas idénticas y 8 adaptadas de 17; solo 1 reemplazada y 1 omitida. Conserva los principios. |
| `quickstart.md` | 31 + 24 = 55 | Se reescribe lo tecnológico (comandos, herramientas). |
| `data-model.md` | 52 + 57 = 109 | Cambia el lenguaje de las entidades y la estructura de la validación. |
| **Plan** (`plan.md`) | 65 + 61 = **126** | ≈ 86 % de sus enunciados cambiaron (estimación). |
| `research.md` | 60 + 60 = 120 | Decisiones técnicas rehechas casi todas. |
| **Tareas** (`tasks.md`) | 108 + 102 = **210** | Se regeneró entero: 29 tareas en Flutter frente a 39 en React. |
| **Código** | **todo** | Dart → JavaScript/JSX: 0 líneas reutilizadas (263 en `src/` frente a 294 en `lib/`). |

**Más reutilizable: la spec y los casos de prueba.** Son el QUÉ: describen comportamiento, mensajes
y reglas, y no nombran ninguna tecnología. La constitución viene justo después: los principios
viajan y solo se reescriben nombres dependientes del lenguaje.

**Menos reutilizable: el código, seguido de las tareas y del plan.** Son el CÓMO. Las tareas son lo
que más cambia en líneas porque se regeneran enteras a partir del plan.

```text
$ git diff --no-index --stat -- <flutter>/tasks.md specs/001-divisor-cuenta/tasks.md
 1 file changed, 108 insertions(+), 102 deletions(-)
$ git diff --no-index --stat -- <flutter>/research.md specs/001-divisor-cuenta/research.md
 1 file changed, 60 insertions(+), 60 deletions(-)
```

**Matiz importante.** La hipótesis «el QUÉ viaja y el CÓMO se rehace» se cumplió, pero hubo
conocimiento que quedó **solo en el código** y no viajó con los artefactos: el margen `1e-9` del
redondeo hacia arriba (`ceil(v - 1e-9)`, commit `e3294b7` de la rama `sdd` de Flutter). El plan
React lo resolvió de otra forma (normalizar a centavos antes del `ceil`), que daba 2 para 2.001 y
contradecía FR-009. Lo detectó `/speckit-analyze` (hallazgo B1) y se corrigió antes de
implementar. Sin ese paso, el cambio de comportamiento habría pasado al código sin que nadie lo
notara. Es evidencia de que la separación QUÉ/CÓMO funciona, pero también de que el plan debe
registrar las decisiones que se descubren al implementar, o se pierden al migrar.

Y la spec trae sus propios defectos (F1 y B2, ver pregunta 3), que migrar a otra tecnología no
arregla ni empeora.

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
- **Decisiones del estudiante sobre la medición:** cuentan 3 iteraciones (la del reenvío de B1 sin efecto
  no cuenta), 0 líneas escritas a mano y se reportan los dos tiempos (reloj y sesiones).
- Las tareas `T009` y `T037` se omitieron a propósito (instrucción del estudiante en el prompt de
  `/speckit-implement`).
