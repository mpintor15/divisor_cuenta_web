# Divisor de Cuenta Web Constitution

## Core Principles

### I. Calidad de código (SOLID)
El código MUST respetar SOLID:
- **SRP**: una función o módulo tiene una sola razón de cambio. El cálculo no valida ni
  formatea.
- **OCP**: agregar una nueva regla de redondeo MUST NOT obligar a editar los módulos que ya
  existen.
- **LSP**: cualquier implementación de la interfaz de redondeo MUST poder sustituir a otra sin
  que quien la usa pregunte de qué tipo es.
- **ISP**: las interfaces son pequeñas; ningún módulo depende de funciones que no usa.
- **DIP**: `presentation` depende de abstracciones del `domain`, nunca de implementaciones
  concretas de `data`.

### II. Arquitectura en capas
El código se organiza en `src/presentation`, `src/domain` y `src/data`.
- La regla de dependencia es `presentation -> domain <- data`.
- `src/domain/` MUST NOT importar `react` ni nada del DOM: es JavaScript puro.
- `src/main.jsx` es el ÚNICO lugar donde se instancian implementaciones concretas.

### III. Seguridad
Los secretos y API keys MUST NOT guardarse nunca en el repositorio.

### IV. Calidad y pruebas
- Toda funcionalidad crítica MUST tener pruebas.
- Los criterios de aceptación de la spec MUST convertirse en pruebas ejecutables.

### V. Regla de la materia
Toda función generada por el agente MUST poder ser explicada por el estudiante: qué hace, por
qué existe, qué recibe, qué devuelve y qué errores produce.

## Governance

Esta constitución prevalece sobre otras prácticas del proyecto. Las enmiendas se documentan
en este archivo y actualizan la versión según versionado semántico: MAJOR para eliminar o
redefinir principios de forma incompatible, MINOR para agregar principios o ampliar guía de
forma material, PATCH para aclaraciones de redacción. Las specs, planes y revisiones MUST
verificar el cumplimiento de estos principios.

**Version**: 1.0.0 | **Ratified**: 2026-10-08 | **Last Amended**: 2026-10-08
