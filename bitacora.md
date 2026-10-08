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
| | | | |

Decisiones de conteo dudosas: _anotarlas aquí_.

## Cronómetro (React)

| Evento | Hora del reloj | Minutos desde el inicio |
|---|---|---|
| Inicio (envío de `/speckit-plan`) | | 0 |
| Primer `npm run build` exitoso | | |
| Los 6 casos en verde | | |

## Tabla de métricas

| Métrica | Flutter (laboratorio) | React (este deber) |
|---|---:|---:|
| Minutos hasta la primera versión que compila | no registrado | |
| **Minutos hasta que pasan los 6 casos** | no registrado (ver nota) | |
| Iteraciones con el agente | no registrado para `sdd` (la tabla del lab quedó vacía) | |
| Líneas de código escritas a mano | no registrado | |
| Enunciados modificados en la spec | — | _Parte 8_ (hoy: 0) |
| Enunciados modificados en la Constitution | — | _Parte 8_ |
| Líneas modificadas en el plan | — | _Parte 8_ |
| Casos de aceptación que pasan (0–6) | 6 (`flutter test`: 10/10 verde) | _Parte 7_ |

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
| 4 Constitución | | Comparar con la de Flutter: 8 idénticas / 8 adaptadas / 1 reemplazada (esperado). Revisar si aparece Gobernanza inventada |
| 5 Plan, tareas, analyze | | ¿`/speckit-analyze` encontró contradicciones con la spec? |
| 6 Implement + converge | | ¿Existe `/speckit-converge`? (sí aparece en `.claude/skills`) |
| 7 Vitest, 6 casos, pantalla, SOLID, build | | |
| 8 Diffs y métricas | | |

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
| 1 | 100.00, 4 personas, 10 %, exacto | 27.50 | ✅ | |
| 2 | 90.00, 3 personas, 0 %, exacto | 30.00 | ✅ | |
| 3 | 50.00, 0 personas | "Debe haber al menos una persona", sin resultado | ✅ | |
| 4 | monto "abc" | "Monto inválido" | ✅ | |
| 5 | 10.00, 3 personas, 0 %, exacto | 3.33 | ✅ | |
| 6 | 10.00, 3 personas, 0 %, hacia arriba | 4.00 | ✅ | |

Recordatorio (hallazgo H2 de `analisis_spec.md`): la spec tiene 10 escenarios distintos, no 6. Coma
decimal, monto ≤ 0, propina inválida y personas inválido no tienen prueba en Flutter.

## Hallazgos para las respuestas

- _P3 / analyze:_
- _P4 (casos Flutter vs React):_
- _P5 (partes del plan que ya no tienen sentido, mín. 3):_
- _P6 (artefacto más / menos reusable):_
- Desviaciones de método (p. ej. skills invocados a mano, ayuda del agente en la Parte 2):
