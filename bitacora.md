# Bitácora — Deber 2 (Flutter → React, SDD)

## Datos generales

| Dato | Valor |
|---|---|
| Agente | Claude Code (el mismo del laboratorio) |
| Modelo / razonamiento | Sonnet 5.5 · Medium (igual que en el laboratorio; confirmar antes de empezar) |
| Node / npm | v24.19.0 / 11.17.0 |
| Spec Kit | 1.1.2, integración `claude`, script `sh` |
| Repo Flutter | `divisor_cuenta`, rama `sdd` — `flutter test`: All tests passed! (10 pruebas) |
| Repo React | `divisor_cuenta_web` |
| Feature | `specs/001-divisor-cuenta` (fijado en `.specify/feature.json`) |
| Commits previos | `7d7ef88` proyecto react base, sin tocar · `f528793` spec kit + la misma spec |
| Evidencia diff inicial de la spec | vacío (exit 0, 0 bytes); SHA-1 igual en ambos: `2d77cfcd33f1a2e2d17b8766612d035c66bb6475` |

## Reglas de medición (del enunciado)

- **Inicio:** al enviar el primer prompt `/speckit-plan` (Parte 5).
- **Primera compilación:** cuando `npm run build` termina bien por primera vez; el cronómetro sigue.
- **Fin:** cuando los 6 casos de aceptación pasan en React.
- **Iteración:** cada mensaje enviado al agente después del prompt inicial para corregir o cambiar algo. Lo que el agente ejecuta solo no cuenta.
- **Línea a mano:** línea que modifiqué directamente yo, no generada por el agente.
- El tiempo es una métrica descriptiva secundaria; no es medida de calidad.

## Registro de iteraciones (React)

| # | Hora | Mensaje enviado (resumen) | Motivo |
|---|---|---|---|
| 1 | 12:14:04 | Corregir `tests/` → `test/` en plan y artefactos del feature; quitar el comentario "Sync Impact Report" de la constitución | El plan no coincidía con las rutas del enunciado (`test/setup.js`, `test/casosDePrueba.js`…) |
| 2 | 9-oct 18:11:04 | Corregir B1 en el plan y las tareas: `redondeoHaciaArriba` con `Math.ceil(valor - 1e-9)`, caso 2.001 → 3, jest-dom en D9 (I1) | Hallazgo B1 de `/speckit-analyze`: el plan normalizaba a centavos y contradecía FR-009 |
| — | 9-oct 19:29:43 | Mismo mensaje de B1 reenviado por error | **No cuenta**: el agente comprobó que ya estaba aplicado y no cambió nada |
| 3 | 9-oct 19:30:11 | `/speckit-implement` para cerrar las tareas T038 y T039 que añadió `/speckit-converge` | Brechas de convergencia: comentarios faltantes (F1) y `public/icons.svg` sin uso (F2) |

Sin contar: `/speckit-tasks` (18:04:57), `/speckit-analyze` (18:06:41), `/speckit-implement` inicial (18:12:19), `/speckit-converge` (19:23:11). Un segundo `/speckit-converge` (19:30:38) se interrumpió y está pendiente de repetir.

Decisiones de conteo dudosas: el mensaje 1 lo propuso el asistente tras revisar el plan y el estudiante lo envió; cuenta como iteración (es un mensaje de corrección posterior al prompt inicial). `/speckit-constitution` (12:10:27) se envió antes del inicio del cronómetro y no cuenta.

Fuente de las horas: marcas de tiempo de la transcripción de la sesión de Claude Code, convertidas de UTC a hora local (UTC−5).

## Cronómetro (React)

| Evento | Hora del reloj | Minutos desde el inicio |
|---|---|---|
| Inicio (envío de `/speckit-plan`) | 12:11:14 | 0 |
| Primer `npm run build` exitoso | 9-oct 18:18:30 | 1807 min de reloj (30 h 07 m); ver nota |
| Los 6 casos en verde | 9-oct 18:18:22 (41 pruebas; las 45 pasan a las 18:18:42) | 1807 min de reloj (30 h 07 m); ver nota |

## Tabla de métricas

| Métrica | Flutter (laboratorio) | React (este deber) |
|---|---:|---:|
| Minutos hasta la primera versión que compila | no registrado | |
| **Minutos hasta que pasan los 6 casos** | no registrado (ver nota) | |
| Iteraciones con el agente | no registrado para `sdd` (la tabla del lab quedó vacía) | **3** |
| Líneas de código escritas a mano | no registrado | **0** |
| Enunciados modificados en la spec | — | 0 de 38 (diff vacío; `evidencia_parte8.md`) |
| Enunciados modificados en la Constitution | — | 9 de 17 reglas (8 adaptadas + 1 reemplazada); además 1 omitida y 1 añadida por el agente (ver `analisis_spec.md`) |
| Líneas modificadas en el plan | — | 126 líneas (65 añadidas, 61 eliminadas) sobre 105 → 109; casi todo el plan. Conteo por enunciados: pendiente |
| Casos de aceptación que pasan (0–6) | 6 (`flutter test`: 10/10 verde) | 6 (`npm test`: 45/45 verde) |

**Nota sobre el tiempo Flutter:** el laboratorio no registró cronómetro. Los commits de la rama
`sdd` solo dan una referencia indirecta (no es un tiempo medido por mí y no debe usarse para
comparar): constitución 10:20 → spec 10:27 → clarificaciones 10:57 → plan 11:00 → tareas 11:04 →
analyze 11:32 → implementación completa 11:44 (todos el 2026-10-08). Incluye pausas y
trabajo manual, y el agente conocía la spec de antemano (ver bitácora del laboratorio).

Datos del código Flutter para contexto (no son métricas de este deber): `lib/` tiene 12 archivos
`.dart` y 294 líneas.

## Seguimiento por parte

| Parte | Estado | Notas |
|---|---|---|
| 1 Ubicar artefactos | Hecha | Rutas en `analisis_spec.md` |
| 2 Separar QUÉ/CÓMO | Borrador hecho | `analisis_spec.md`; pendiente revisión del estudiante |
| 3 Proyecto React + Spec Kit + spec copiada | Hecha | Commits `7d7ef88` y `f528793`; se añadió `.specify/feature.json` |
| 4 Constitución | Hecha | Resultado real: 7 idénticas / 8 adaptadas / 1 reemplazada / 1 omitida. Gobernanza añadida por el agente (ver `respuestas.md`, pregunta 2) |
| 5 Plan, tareas, analyze | Hecha | ¿`/speckit-analyze` encontró contradicciones con la spec? |
| 6 Implement + converge | Hecha ("Converged", 19:35) | ¿Existe `/speckit-converge`? (sí aparece en `.claude/skills`) |
| 7 Vitest, 6 casos, pantalla, SOLID, build | Hecha | 45/45 pruebas; build y lint limpios; ajuste opcional de 7.3 no aplicado |
| 8 Diffs y métricas | Hecha | `evidencia_parte8.md` |

## Verificaciones (Parte 7.6)

| Verificación | Comando | Resultado |
|---|---|---|
| `domain/` sin React | `git grep -n "from 'react'" -- src/domain/` | |
| Concretas de redondeo solo en `main.jsx` | `git grep -n "redondeoExacto\|redondeoHaciaArriba" -- src/` | |
| Sin instanceof / modo en `calcularDivision` | `git grep -n "instanceof\|=== 'exacto'\|=== 'arriba'" -- src/domain/calcularDivision.js` | |
| Cálculo sin formatear ni validar | `git grep -n "toFixed\|inválido\|al menos una persona" -- src/domain/calcularDivision.js` | |
| `npm test` | | |
| `npm run build` | | |

## Los seis casos (React)

| # | Entrada | Esperado | Flutter | React |
|---|---|---|:-:|:-:|
| 1 | 100.00, 4 personas, 10 %, exacto | 27.50 | ✅ | ✅ |
| 2 | 90.00, 3 personas, 0 %, exacto | 30.00 | ✅ | ✅ |
| 3 | 50.00, 0 personas | "Debe haber al menos una persona", sin resultado | ✅ | ✅ |
| 4 | monto "abc" | "Monto inválido" | ✅ | ✅ |
| 5 | 10.00, 3 personas, 0 %, exacto | 3.33 | ✅ | ✅ |
| 6 | 10.00, 3 personas, 0 %, hacia arriba | 4.00 | ✅ | ✅ |

Recordatorio (hallazgo H2 de `analisis_spec.md`): la spec tiene 10 escenarios distintos, no 6. Coma
decimal, monto ≤ 0, propina inválida y personas inválido no tienen prueba en Flutter.

## Hallazgos para las respuestas

- _P3 / analyze_ (`/speckit-analyze`, 18:06 hora local del 9-oct, sesión nueva): 0 CRITICAL, 10 hallazgos (2 MEDIUM, 8 LOW), cobertura 100 % de 13 FR y 4 SC, 37 tareas, sin problemas con la constitución. Ningún hallazgo señala supuestos de Flutter ocultos en la spec. F1 (SC-001 dice "6 escenarios", hay 11) y B2 (la descripción dice "al entero más cercano" y FR-009 define `ceil`) son defectos de la propia spec, ya presentes en Flutter. B1: el plan (D5/T029) normaliza a centavos antes del `ceil`, por lo que 2.001 daría 2 y no 3; en Flutter se resolvió con `ceil(v - 1e-9)` (commit `e3294b7`), así que la decisión del código no viajó al plan.
- _`/speckit-tasks`_: enviado 18:04:57 (hora local del 9-oct).
- _P4 (casos Flutter vs React):_
- _P5 (partes del plan que ya no tienen sentido, mín. 3):_
- _P6 (artefacto más / menos reusable):_
- Desviaciones de método (p. ej. skills invocados a mano, ayuda del agente en la Parte 2): el borrador de `analisis_spec.md` (Parte 2) y `test/casosDePrueba.js` (Parte 7.2, que el enunciado pide escribir a mano) los creó el asistente de esta sesión, copiando el contenido del enunciado; no los escribió el estudiante. Debe declararse.

## Nota sobre el tiempo (React)

- **Tiempo de reloj** desde `/speckit-plan` (8-oct 12:11:14) hasta los 6 casos en verde (9-oct 18:18:22): **30 h 07 m**. Incluye una pausa de más de 24 h entre sesiones y no es una medida de esfuerzo.
- **Tiempo dentro de las sesiones del agente:** sesión 1 (8-oct 12:11:14 → 12:14:34) ≈ 3 m 20 s; sesión 2 (9-oct 18:04:57 → 18:18:22) ≈ 13 m 25 s. Suma ≈ **16 m 45 s**, con pausas cortas de lectura entre mensajes. Es una referencia descriptiva, no el criterio del enunciado.
- Criterio elegido para reportar: **ambas cifras** (reloj y sesiones), con la aclaración de la pausa; el tiempo no se usa como medida de calidad.
- Las horas salen de las marcas de tiempo de las transcripciones de Claude Code (UTC−5).
