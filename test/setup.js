// Configuración de Vitest: matchers de jest-dom y limpieza del DOM entre pruebas.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
