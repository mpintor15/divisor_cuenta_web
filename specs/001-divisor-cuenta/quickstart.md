# Quickstart: validar el Divisor de cuenta

## Prerrequisitos
- Node.js instalado y `npm install` ejecutado.
- Herramientas de prueba (`vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`)
  instaladas como devDependencies y script `npm test` definido (ver [research.md](research.md) D9).

## 1. Pruebas automáticas
```bash
npm test
```
Resultado esperado: todas pasan. Cubren los escenarios de la spec (SC-001), las entradas inválidas
(SC-003) y la regla de dependencias entre capas.

## 2. Verificación manual
```bash
npm run dev
```
Abrir la URL que imprime Vite y comprobar:

| Monto | Personas | Propina | Modo | Esperado |
|-------|----------|---------|------|----------|
| 100.00 | 4 | 10 | Exacto | 27.50 |
| 90.00 | 3 | 0 | Exacto | 30.00 |
| 10.00 | 3 | 0 | Exacto | 3.33 |
| 10,50 | 1 | 0 | Exacto | 10.50 |
| 10.00 | 3 | 0 | Hacia arriba | 4.00 |
| 50.00 | 0 | 0 | cualquiera | "Debe haber al menos una persona", sin importe |
| abc / 0 / -50 | 2 | 0 | cualquiera | "Monto inválido", sin importe |
| 50 | 2 | vacío / -5 / abc | cualquiera | "Propina inválida", sin importe |
| 50 | vacío / -3 / 2.5 / abc | 0 | cualquiera | "Número de personas inválido", sin importe |

Comprobar además: cambiar el modo tras calcular no cambia el resultado hasta volver a tocar
"Calcular"; tras un error y un cálculo válido desaparece el mensaje; con la red desactivada la app
sigue funcionando (SC-004).

## 3. Verificación de arquitectura
```bash
npm test -- test/division.test.js
```
Incluye las pruebas de arquitectura. Falla si `src/domain/` importa `react`/DOM, si `presentation` importa de `data`, o si algo fuera
de `src/main.jsx` importa implementaciones concretas de `data`.
