# Contratos: dominio y hook

## `validarEntrada({ monto, personas, propina }) -> Cuenta`
- **Recibe**: tres strings crudos del formulario.
- **Devuelve**: `Cuenta` `{ monto, personas, propinaPorcentaje }` con números.
- **Errores**: lanza `ErrorDeEntrada` con el mensaje de [data-model.md](../data-model.md).
- **Orden**: monto → personas → propina; solo el primer error.
- Acepta `.` y `,` como separador decimal en monto y propina.

## `calcularDivision(cuenta, estrategia) -> Resultado`
- **Recibe**: `Cuenta` válida y un objeto con `aplicar(valor)`.
- **Devuelve**: `Resultado` con `estrategia.aplicar(monto * (1 + propinaPorcentaje / 100) / personas)`.
- **Errores**: ninguno propio; no valida ni formatea.

## `formateadorMoneda.formatear(numero) -> string`
- Devuelve el número con dos decimales y punto, sin símbolo: `27.5` → `"27.50"`.

## `useDivisor({ validarEntrada, calcularDivision, estrategias }) -> estado + acciones`
- **Recibe** (inyectado desde `main.jsx` vía props de la pantalla): las dos funciones de dominio y
  el mapa `{ clave: estrategia }`.
- **Devuelve**: `{ monto, personas, propina, modo, resultado, error, setMonto, setPersonas,
  setPropina, setModo, calcular }`.
- `calcular()` no lanza: captura `ErrorDeEntrada` y lo expone en `error`.

## `PantallaDivisor` (contrato de UI)
- Props: las mismas dependencias que el hook (`validarEntrada`, `calcularDivision`, `estrategias`).
- Elementos: campos "Monto", "Personas", "Propina (%)", selector de modo (Exacto / Hacia arriba,
  por defecto Exacto), botón "Calcular".
- Muestra, después de calcular, o bien el importe por persona (solo número con 2 decimales) o bien
  el mensaje de error, nunca ambos. El mensaje de error se anuncia con `role="alert"`.
