# analisis_spec.md — ¿Qué viaja de Flutter a React?

> Elaborado con ayuda de un agente de código (Claude Code) a partir de los archivos del laboratorio;
> ver la «Declaración de método» en `respuestas.md`.
> Rutas de la Parte 1 relativas a `../divisor_cuenta` (repo Flutter).

## Parte 1 — Artefactos localizados (rama `sdd` de `divisor_cuenta`)

| Artefacto | Ruta exacta |
|---|---|
| Constitución | `divisor_cuenta/.specify/memory/constitution.md` (v1.0.0) |
| Feature | `divisor_cuenta/specs/001-divisor-cuenta/` |
| Spec | `divisor_cuenta/specs/001-divisor-cuenta/spec.md` |
| Plan | `divisor_cuenta/specs/001-divisor-cuenta/plan.md` |
| Tareas | `divisor_cuenta/specs/001-divisor-cuenta/tasks.md` |
| Otros del feature | `research.md`, `data-model.md`, `quickstart.md`, `checklists/requirements.md` |
| Casos de prueba | `divisor_cuenta/test/casos_de_prueba.dart` (6 casos), `division_test.dart`, `pantalla_test.dart` |

Estado previo verificado: `flutter test` → `All tests passed!` (10 pruebas: 6 escenarios,
1 LSP, 3 de pantalla).

Para la Parte 3.4 el `spec.md` a copiar es `specs/001-divisor-cuenta/spec.md` (el único).

---

## Parte 2A — Spec: QUÉ / CÓMO / MIXTO

### Método de conteo

- Se cuenta **un enunciado por requisito, regla o criterio independiente**.
- **No se cuentan** los metadatos (`Feature Branch`, `Created`, `Status`) ni el párrafo `Input`.
- **No se cuentan** las *Clarifications* ni los *Edge Cases* que repiten un FR o un escenario
  (mismo contenido dicho dos veces); sí se cuentan los 2 edge cases que añaden información.
- El escenario 3.2 es idéntico al 1.3 (monto 10, 3 personas, 0 %, exacto → 3.33): se cuenta una vez.
- Se separa FR-004 en dos ideas independientes (a: mostrar importe con dos decimales; b: sin símbolo).
- Criterio de clasificación: la pregunta del enunciado, *¿sigue valiendo si la app es React?*

### Tabla (38 enunciados)

| # | Enunciado de la spec | Tipo | ¿Viaja? | Justificación |
|---|---|---|---|---|
| 1 | FR-001 La app tiene una sola pantalla | QUÉ | Intacto | Una vista única; el propio plan React la llama `PantallaDivisor.jsx` |
| 2 | FR-002 El usuario ingresa monto, personas y propina | QUÉ | Intacto | Comportamiento |
| 3 | FR-003 Elegir entre modo exacto y hacia arriba | QUÉ | Intacto | Comportamiento |
| 4 | FR-004a Al accionar "Calcular" se muestra el importe por persona con dos decimales | QUÉ | Intacto | Comportamiento (el verbo "tocar" se trata en el hallazgo H1) |
| 5 | FR-004b El importe se muestra solo como número, sin símbolo de moneda | QUÉ | Intacto | Regla de presentación verificable |
| 6 | FR-005 Importe = (monto + propina sobre el monto) / personas | QUÉ | Intacto | Regla de negocio |
| 7 | FR-006 0 personas → "Debe haber al menos una persona", sin resultado | QUÉ | Intacto | Regla funcional |
| 8 | FR-007 Monto no numérico o ≤ 0 → "Monto inválido", sin resultado | QUÉ | Intacto | Regla funcional |
| 9 | FR-008 Modo exacto: redondeo a dos decimales | QUÉ | Intacto | Regla de negocio |
| 10 | FR-009 Modo hacia arriba: sube al siguiente entero (3.33→4.00, 2.40→3.00, 30.00→30.00) | QUÉ | Intacto | Regla con ejemplos verificables |
| 11 | FR-010 Funciona sin conexión: sin red ni base de datos | QUÉ | Intacto | Restricción de comportamiento |
| 12 | FR-011 Propina vacía/negativa/no numérica → "Propina inválida" | QUÉ | Intacto | Regla funcional |
| 13 | FR-012 Personas vacío/negativo/decimal/no numérico → "Número de personas inválido" | QUÉ | Intacto | Regla funcional |
| 14 | FR-013 Monto y propina aceptan punto o coma decimal | QUÉ | Intacto | Regla funcional (ver riesgo R1) |
| 15 | Esc. 1.1: 100.00, 4 p., 10 %, exacto → 27.50 | QUÉ | Intacto | Criterio verificable |
| 16 | Esc. 1.2: 90.00, 3 p., 0 %, exacto → 30.00 | QUÉ | Intacto | Criterio verificable |
| 17 | Esc. 1.3 (= 3.2): 10.00, 3 p., 0 %, exacto → 3.33 | QUÉ | Intacto | Criterio verificable |
| 18 | Esc. 1.4: "10,50", 1 p., 0 % → 10.50 igual que con punto | QUÉ | Intacto | Criterio verificable |
| 19 | Esc. 2.1: 50.00 y 0 personas → mensaje, sin resultado | QUÉ | Intacto | Criterio verificable |
| 20 | Esc. 2.2: monto "abc" → "Monto inválido" | QUÉ | Intacto | Criterio verificable |
| 21 | Esc. 2.3: monto 0 o negativo → "Monto inválido", sin resultado | QUÉ | Intacto | Criterio verificable |
| 22 | Esc. 2.4: propina vacía/-5/"abc" → "Propina inválida" | QUÉ | Intacto | Criterio verificable |
| 23 | Esc. 2.5: personas vacío/-3/2.5/"abc" → "Número de personas inválido" | QUÉ | Intacto | Criterio verificable |
| 24 | Esc. 3.1: 10.00, 3 p., 0 %, hacia arriba → 4.00 | QUÉ | Intacto | Criterio verificable |
| 25 | Edge: cambiar el modo tras calcular no actualiza el resultado hasta volver a calcular | QUÉ | Intacto | Comportamiento (ojo: en React exige no recalcular en cada render) |
| 26 | Edge: tras un error y un cálculo válido, el mensaje desaparece | QUÉ | Intacto | Comportamiento |
| 27 | SC-001 Los escenarios de aceptación producen el resultado indicado | QUÉ | Intacto | Criterio de éxito (ver hallazgo H2: dice "6") |
| 28 | SC-002 El importe se obtiene en una sola acción, sin pasos intermedios | QUÉ | Intacto | Criterio de usabilidad (ver H1) |
| 29 | SC-003 Ante entrada inválida, mensaje explicativo y nunca importe incorrecto | QUÉ | Intacto | Criterio de éxito |
| 30 | SC-004 La función se completa sin conexión | QUÉ | Intacto | Criterio de éxito (ver H1: "dispositivo") |
| 31 | Supuesto: la propina se aplica sobre el monto total | QUÉ | Intacto | Regla de negocio |
| 32 | Supuesto: propina es un % numérico; 0 % es válido | QUÉ | Intacto | Regla de negocio |
| 33 | Supuesto: una sola moneda, sin conversión | QUÉ | Intacto | Alcance |
| 34 | Supuesto: modo por defecto al abrir es exacto | QUÉ | Intacto | Comportamiento |
| 35 | Supuesto: lo no contemplado no está definido | QUÉ | Intacto | Alcance |
| 36 | Supuesto: mensajes de error en español, literales | QUÉ | Intacto | Regla de presentación |
| 37 | Entidad Cuenta: monto, personas, propina, modo | QUÉ | Intacto | Dominio |
| 38 | Entidad Resultado: importe por persona con dos decimales | QUÉ | Intacto | Dominio |

### Resultado: dos lecturas

**Lectura A — por contenido (la que usa la tabla):** 38 QUÉ, 0 CÓMO, 0 MIXTO.
- % CÓMO = 0 / 38 = **0 %** (muy por debajo del umbral pedagógico de 30 %).
- Intacto 100 % · adaptación 0 % · no viaja 0 %.

**Lectura B — estricta por redacción:** el vocabulario táctil/móvil ("toca", "toque",
"dispositivo") aparece en 14 de los 38 enunciados (#4, #15–#24, #25, #28, #30). Si se cuentan como
**MIXTO** (la idea viaja, la palabra cambia a "clic"/"dispositivo→navegador"):
- 24 intactos (63 %) · 14 con adaptación (37 %) · 0 no viajan · % CÓMO = **0 %**.

Decisión del estudiante: se reporta la Lectura B como cifra principal (conservadora) y se menciona la A
como contraste. En ambas lecturas el % CÓMO es 0 %.

### Hallazgos

- **H1 — Vocabulario de plataforma, no de framework.** Ningún enunciado menciona Flutter, Dart,
  widgets ni librerías. Lo que sí hay es lenguaje de **app móvil** ("toca", "toque", "dispositivo",
  "app"). Eso no es una decisión de implementación, pero es redacción que cambia al pasar a web.
  Cambio mínimo si algún día se adapta: "toca" → "acciona"/"hace clic". **No se modifica ahora.**
- **H2 — Inconsistencia interna de la spec (no tiene que ver con Flutter).** SC-001 habla de
  "los 6 escenarios de aceptación", pero la spec tiene **11 escenarios** (10 distintos, porque 1.3 =
  3.2). Los 6 casos de `casos_de_prueba.dart` cubren solo una parte: no cubren la coma decimal,
  monto 0/negativo, propina inválida ni personas inválido. Verificado en el código Flutter:
  `validar_entrada.dart` y `lector_numeros.dart` implementan esas reglas, pero ninguna prueba
  (`division_test.dart` y `pantalla_test.dart` solo usan los 6 casos y 3 de pantalla) las
  ejercita. Implicación para el deber:
  "los 6 casos" del enunciado son un subconjunto de los criterios de la spec. Conviene decirlo en la
  pregunta 4 y no presentar "6/6" como "toda la spec cumplida".
- **H3 — Metadato de proceso.** `Feature Branch: sdd (…se trabaja en la rama sdd)` no es QUÉ ni
  CÓMO de la app; es contexto de Git del laboratorio. En el repo React quedará desactualizado.
  Se excluyó del conteo; vale la pena mencionarlo.

### Riesgos para la implementación React (no son cambios a la spec)

- **R1 — Coma decimal (FR-013, esc. 1.4).** `<input type="number">` rechaza o normaliza la coma
  según navegador/idioma, y no deja escribir "abc", con lo que el esc. 2.2 sería inalcanzable en
  el navegador. Hará falta `<input type="text" inputMode="decimal">` y parseo propio. Esto es una
  decisión de **plan**, y la spec no necesita cambiar.
- **R2 — Edge "cambiar modo no actualiza el resultado" (#25).** En React hay que guardar el
  resultado en estado al calcular y no derivarlo en cada render.
- **R3 — Prueba de pantalla 2 del deber** exige que no aparezca "ningún resultado numérico"; en
  `jsdom` hay que definir con precisión qué elemento representa el resultado.

### Enunciados de la spec que habría que cambiar para React

**Ninguno.** No se encontró ninguna decisión técnica mezclada con el QUÉ. Si `/speckit-analyze`
señala lo contrario, se documenta aquí antes de tocar nada (protocolo de la Parte 8.1).

---

## Parte 2B — Constitución: idéntica / adaptada / reemplazada

Fuente: `.specify/memory/constitution.md` v1.0.0. Comparada con los principios que el enunciado
pide para React (Parte 4). 17 reglas:

| # | Regla (Flutter) | Clasificación | Qué pasa en React / justificación |
|---|---|---|---|
| 1 | I. El código MUST respetar los cinco principios SOLID, cada uno comprobable | **Idéntica** | Principio independiente del lenguaje |
| 2 | SRP: una clase, una razón de cambio; el cálculo no valida ni formatea (grep `toStringAsFixed`…) | **Adaptada** | "clase" → "función o módulo"; `toStringAsFixed` → `toFixed`; ruta `lib/domain/…dart` → `src/domain/calcularDivision.js` |
| 3 | OCP: una regla de redondeo nueva no obliga a editar clases existentes | **Adaptada** | "clase que implemente la interfaz" → módulo que cumple el contrato `aplicar(valor)` (JS no tiene interfaces formales) |
| 4 | LSP: implementaciones sustituibles sin preguntar el tipo (grep `is Redondeo`) | **Adaptada** | `is/as` → `instanceof` o comparar el modo con `=== 'exacto'` |
| 5 | ISP: interfaces pequeñas | **Adaptada** | "métodos" → "funciones"; contrato de una sola función |
| 6 | DIP: presentation depende de abstracciones del domain, nunca de clases concretas de data | **Adaptada** | Misma idea; "clases concretas" → "implementaciones concretas" |
| 7 | II. Tres capas `lib/presentation|domain|data`, regla `presentation → domain ← data` | **Adaptada** | `lib/` → `src/`; la regla de dependencia no cambia |
| 8 | `lib/domain/` es Dart puro: no importa `package:flutter` (grep) | **Adaptada** | → JavaScript puro, no importa `react` ni DOM (`git grep "from 'react'"`) |
| 9 | `main.dart` es el único lugar donde se instancian implementaciones concretas | **Adaptada** | `main.dart` → `main.jsx`; el grep de `RedondeoExacto()` pasa a las funciones de `redondeoExacto`/`redondeoHaciaArriba` |
| 10 | III. Nunca guardar secretos/API keys en el repo | **Idéntica** | Restricción de seguridad |
| 11 | IV. Toda funcionalidad crítica tiene pruebas | **Idéntica** | Independiente del framework |
| 12 | IV. Los criterios de aceptación se convierten en pruebas ejecutables | **Idéntica** | Independiente del framework |
| 13 | V. Toda función generada por el agente la puede explicar el estudiante | **Idéntica** | Regla de la materia |
| 14 | Gobernanza: la constitución prevalece sobre otras prácticas | **Idéntica** | No depende de tecnología |
| 15 | Gobernanza: enmiendas registradas con versión MAJOR/MINOR/PATCH | **Idéntica** | No depende de tecnología |
| 16 | Gobernanza: antes de terminar, `flutter analyze`, `flutter test` y los grep | **Reemplazada** | `flutter analyze/test` no existen en React; equivalentes `npm test`, `npm run build` y `git grep`. No se puede conservar el comando, sí la regla "verificar antes de cerrar" |
| 17 | Gobernanza: la guía del agente está en `CLAUDE.md` | **Idéntica** | Mismo agente (Claude Code) |

Resumen (previsión): **8 idénticas (47 %) · 8 adaptadas (47 %) · 1 reemplazada (6 %)**.

**Resultado real con la constitución React generada (`.specify/memory/constitution.md`):** 7 idénticas · 8 adaptadas · 1 reemplazada (la 16: el agente la sustituyó por «las specs, planes y revisiones MUST verificar el cumplimiento», sin comandos) · 1 omitida (la 17, la referencia a `CLAUDE.md`, que no existe en el proyecto web). Regla nueva sin equivalente generada por el agente: ninguna aparte de la redacción de la 16. No hay ninguna regla
Riverpod ni de otra librería: la constitución de Flutter ya era casi agnóstica.

### Aviso para la Parte 4

El prompt de constitución que da el enunciado **no incluye** la sección de Gobernanza (reglas
14–17). `/speckit-constitution` probablemente genere una por su cuenta. Al comparar, si aparece,
hay que decidir si es "regla nueva sin equivalente inventada por el agente" o equivalente de
las reglas 14–17. Además, las líneas `Verificación: grep …` de la versión Flutter no están en
el prompt React: se reemplazan por los `git grep` de la Parte 7.6.

---

## Resumen para `respuestas.md` (preguntas 1–3)

- P1: spec 100 % intacta por contenido; 63 % intacta / 37 % con adaptación de vocabulario táctil
  si se aplica la lectura estricta; 0 % no viaja; 0 % CÓMO (umbral 30 % no superado).
- P2: constitución 8 idénticas / 8 adaptadas / 1 reemplazada.
- P3 (provisional, a confirmar tras `/speckit-plan` y `/speckit-analyze`): no se espera
  modificar la spec; lo que permitió reutilizarla es que describe comportamiento y mensajes
  literales sin nombrar framework, librería, carpeta ni widget.
