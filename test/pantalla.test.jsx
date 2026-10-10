// Pruebas de presentation: formateadorMoneda y PantallaDivisor (tocando "Calcular").
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { casos } from './casosDePrueba.js'
import { formatear } from '../src/presentation/formateadorMoneda.js'
import PantallaDivisor from '../src/presentation/PantallaDivisor.jsx'
import { validarEntrada } from '../src/domain/validarEntrada.js'
import { calcularDivision } from '../src/domain/calcularDivision.js'
import redondeoExacto from '../src/data/redondeoExacto.js'
import redondeoHaciaArriba from '../src/data/redondeoHaciaArriba.js'

const estrategias = { exacto: redondeoExacto, arriba: redondeoHaciaArriba }

async function calcular({ monto, personas, propina, modo }) {
  const user = userEvent.setup()
  render(
    <PantallaDivisor
      validarEntrada={validarEntrada}
      calcularDivision={calcularDivision}
      estrategias={estrategias}
    />,
  )
  if (monto) await user.type(screen.getByLabelText('Monto'), monto)
  if (personas) await user.type(screen.getByLabelText('Personas'), personas)
  if (propina) await user.type(screen.getByLabelText('Propina (%)'), propina)
  if (modo) await user.selectOptions(screen.getByLabelText('Modo de redondeo'), modo)
  await user.click(screen.getByRole('button', { name: 'Calcular' }))
}

describe('formateadorMoneda', () => {
  it('muestra 2 decimales con punto y sin símbolo', () => {
    expect(formatear(27.5)).toBe('27.50')
    expect(formatear(30)).toBe('30.00')
  })
})

describe('PantallaDivisor: escenarios de US1', () => {
  const textos = (c) => ({
    monto: String(c.monto),
    personas: String(c.personas),
    propina: String(c.propina),
  })

  for (const c of casos.filter((c) => c.modo === 'exacto' && c.esperado !== undefined)) {
    it(c.nombre, async () => {
      await calcular(textos(c))
      expect(screen.getByText(c.esperado.toFixed(2))).toBeInTheDocument()
    })
  }

  it('monto con coma decimal: 10,50 / 1 / 0 → 10.50', async () => {
    await calcular({ monto: '10,50', personas: '1', propina: '0' })
    expect(screen.getByText('10.50')).toBeInTheDocument()
  })
})

// ---------- US2: entradas inválidas en la pantalla ----------
describe('PantallaDivisor: entradas inválidas (US2)', () => {
  const invalidas = [
    ['50', '0', '0', 'Debe haber al menos una persona'],
    ['abc', '2', '0', 'Monto inválido'],
    ['0', '2', '0', 'Monto inválido'],
    ['-50', '2', '0', 'Monto inválido'],
    ['50', '2', '', 'Propina inválida'],
    ['50', '2', '-5', 'Propina inválida'],
    ['50', '2', 'abc', 'Propina inválida'],
    ['50', '', '0', 'Número de personas inválido'],
    ['50', '-3', '0', 'Número de personas inválido'],
    ['50', '2.5', '0', 'Número de personas inválido'],
    ['50', 'abc', '0', 'Número de personas inválido'],
  ]

  for (const [monto, personas, propina, msg] of invalidas) {
    it(`monto "${monto}", personas "${personas}", propina "${propina}" → ${msg}`, async () => {
      await calcular({ monto, personas, propina })
      expect(screen.getByRole('alert')).toHaveTextContent(msg)
      expect(screen.queryByText(/Cada persona paga/)).not.toBeInTheDocument()
    })
  }

  it('tras un error y un cálculo válido desaparece el mensaje y se muestra el importe', async () => {
    await calcular({ monto: '90', personas: '0', propina: '0' })
    expect(screen.getByRole('alert')).toBeInTheDocument()
    const user = userEvent.setup()
    const personas = screen.getByLabelText('Personas')
    await user.clear(personas)
    await user.type(personas, '3')
    await user.click(screen.getByRole('button', { name: 'Calcular' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('30.00')).toBeInTheDocument()
  })

  it('un error después de un resultado oculta el importe (nunca ambos)', async () => {
    await calcular({ monto: '90', personas: '3', propina: '0' })
    expect(screen.getByText('30.00')).toBeInTheDocument()
    const user = userEvent.setup()
    await user.clear(screen.getByLabelText('Monto'))
    await user.type(screen.getByLabelText('Monto'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Calcular' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Monto inválido')
    expect(screen.queryByText('30.00')).not.toBeInTheDocument()
  })
})

// ---------- US3: modo de redondeo en la pantalla ----------
describe('PantallaDivisor: modo de redondeo (US3)', () => {
  const base = { monto: '10', personas: '3', propina: '0' }

  it('el modo por defecto es Exacto', () => {
    render(
      <PantallaDivisor validarEntrada={validarEntrada} calcularDivision={calcularDivision} estrategias={estrategias} />,
    )
    expect(screen.getByLabelText('Modo de redondeo')).toHaveValue('exacto')
    expect(screen.getByRole('option', { name: 'Exacto' }).selected).toBe(true)
  })

  it('Hacia arriba muestra 4.00', async () => {
    await calcular({ ...base, modo: 'arriba' })
    expect(screen.getByText('4.00')).toBeInTheDocument()
  })

  it('Exacto muestra 3.33', async () => {
    await calcular({ ...base, modo: 'exacto' })
    expect(screen.getByText('3.33')).toBeInTheDocument()
  })

  it('cambiar el modo después de calcular no cambia el resultado hasta volver a calcular', async () => {
    await calcular(base)
    expect(screen.getByText('3.33')).toBeInTheDocument()
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText('Modo de redondeo'), 'arriba')
    expect(screen.getByText('3.33')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Calcular' }))
    expect(screen.getByText('4.00')).toBeInTheDocument()
  })
})
