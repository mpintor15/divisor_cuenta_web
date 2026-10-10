// Pruebas de domain + data. Los casos base vienen de test/casosDePrueba.js (campos numéricos):
// se convierten a texto con String(...) antes de llamar a validarEntrada, como llegan del formulario.
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { casos } from './casosDePrueba.js'
import { validarEntrada, ErrorDeEntrada } from '../src/domain/validarEntrada.js'
import { calcularDivision } from '../src/domain/calcularDivision.js'
import redondeoExacto from '../src/data/redondeoExacto.js'
import redondeoHaciaArriba from '../src/data/redondeoHaciaArriba.js'
import { esEstrategiaValida } from '../src/domain/estrategiaRedondeo.js'

const aTextos = (c) => ({
  monto: String(c.monto),
  personas: String(c.personas),
  propina: String(c.propina),
})

describe('validarEntrada (camino válido)', () => {
  it('convierte los textos a una Cuenta con números', () => {
    expect(validarEntrada({ monto: '100', personas: '4', propina: '10' })).toEqual({
      monto: 100,
      personas: 4,
      propinaPorcentaje: 10,
    })
  })

  it('acepta coma y punto como separador decimal, con el mismo significado', () => {
    const conComa = validarEntrada({ monto: '10,50', personas: '1', propina: '0' })
    const conPunto = validarEntrada({ monto: '10.50', personas: '1', propina: '0' })
    expect(conComa).toEqual(conPunto)
    expect(conComa.monto).toBe(10.5)
    expect(validarEntrada({ monto: '10', personas: '1', propina: '2,5' }).propinaPorcentaje).toBe(2.5)
  })

  it('hace trim de los textos', () => {
    expect(validarEntrada({ monto: ' 20 ', personas: ' 2 ', propina: ' 0 ' })).toEqual({
      monto: 20,
      personas: 2,
      propinaPorcentaje: 0,
    })
  })
})

describe('calcularDivision', () => {
  const identidad = { aplicar: (v) => v }

  it('calcula monto * (1 + propina/100) / personas y delega el redondeo a la estrategia', () => {
    const r = calcularDivision({ monto: 100, personas: 4, propinaPorcentaje: 10 }, identidad)
    expect(r.importePorPersona).toBeCloseTo(27.5, 10)
  })

  it('usa la estrategia recibida', () => {
    const fija = { aplicar: () => 7 }
    expect(calcularDivision({ monto: 1, personas: 1, propinaPorcentaje: 0 }, fija).importePorPersona).toBe(7)
  })
})

describe('redondeoExacto', () => {
  it('redondea a 2 decimales', () => {
    expect(redondeoExacto.aplicar(3.3333)).toBe(3.33)
    expect(redondeoExacto.aplicar(27.5)).toBe(27.5)
  })
})

describe('casos de la spec en modo exacto (domain + data)', () => {
  for (const c of casos.filter((c) => c.modo === 'exacto' && c.esperado !== undefined)) {
    it(c.nombre, () => {
      const cuenta = validarEntrada(aTextos(c))
      expect(calcularDivision(cuenta, redondeoExacto).importePorPersona).toBe(c.esperado)
    })
  }
})

// ---------- US2: entradas inválidas ----------
describe('validarEntrada (entradas inválidas)', () => {
  const ok = { monto: '50', personas: '2', propina: '0' }
  const mensaje = (entrada) => {
    try {
      validarEntrada(entrada)
    } catch (e) {
      expect(e).toBeInstanceOf(ErrorDeEntrada)
      return e.message
    }
    return null
  }

  it('casos de la spec con errorEsperado (campos numéricos convertidos con String)', () => {
    for (const c of casos.filter((c) => c.errorEsperado)) {
      expect(mensaje(aTextos(c)), c.nombre).toBe(c.errorEsperado)
    }
  })

  it('monto 0, negativo o no numérico → "Monto inválido"', () => {
    for (const monto of ['abc', '0', '-50', '', '0,00']) {
      expect(mensaje({ ...ok, monto }), monto).toBe('Monto inválido')
    }
  })

  it('personas "0" → "Debe haber al menos una persona" (mensaje propio)', () => {
    expect(mensaje({ ...ok, personas: '0' })).toBe('Debe haber al menos una persona')
  })

  it('personas vacío, negativo, decimal o no numérico → "Número de personas inválido"', () => {
    for (const personas of ['', '-3', '2.5', 'abc']) {
      expect(mensaje({ ...ok, personas }), personas).toBe('Número de personas inválido')
    }
  })

  it('propina vacía, negativa o no numérica → "Propina inválida"; 0 es válido', () => {
    for (const propina of ['', '-5', 'abc']) {
      expect(mensaje({ ...ok, propina }), propina).toBe('Propina inválida')
    }
    expect(mensaje({ ...ok, propina: '0' })).toBeNull()
  })

  it('con varios errores a la vez gana el primero: monto → personas → propina', () => {
    expect(mensaje({ monto: 'abc', personas: 'x', propina: 'y' })).toBe('Monto inválido')
    expect(mensaje({ monto: '50', personas: 'x', propina: 'y' })).toBe('Número de personas inválido')
    expect(mensaje({ monto: '50', personas: '0', propina: 'y' })).toBe('Debe haber al menos una persona')
  })
})

// ---------- US3: modo de redondeo ----------
describe('redondeoHaciaArriba (ejemplos de FR-009)', () => {
  it('sube al siguiente entero y mantiene los enteros', () => {
    expect(redondeoHaciaArriba.aplicar(3.33)).toBe(4)
    expect(redondeoHaciaArriba.aplicar(2.4)).toBe(3)
    expect(redondeoHaciaArriba.aplicar(2.001)).toBe(3)
    expect(redondeoHaciaArriba.aplicar(30)).toBe(30)
    expect(redondeoHaciaArriba.aplicar(30.000000000000004)).toBe(30)
  })

  it('caso 6 de la spec: 10 / 3 personas / 0 % en modo arriba → 4', () => {
    const c = casos.find((c) => c.modo === 'arriba')
    const cuenta = validarEntrada(aTextos(c))
    expect(calcularDivision(cuenta, redondeoHaciaArriba).importePorPersona).toBe(c.esperado)
  })
})

describe('contrato EstrategiaRedondeo (LSP)', () => {
  for (const [nombre, estrategia] of [
    ['redondeoExacto', redondeoExacto],
    ['redondeoHaciaArriba', redondeoHaciaArriba],
  ]) {
    it(`${nombre} cumple el contrato`, () => {
      expect(esEstrategiaValida(estrategia)).toBe(true)
      const a = estrategia.aplicar(3.3333)
      expect(typeof a).toBe('number')
      expect(estrategia.aplicar(3.3333)).toBe(a)
    })
  }
})

// ---------- Reglas de arquitectura (constitución II) ----------
describe('arquitectura en capas', () => {
  const raiz = join(process.cwd(), 'src')
  const archivos = (dir) =>
    readdirSync(join(raiz, dir)).map((f) => ({ ruta: `${dir}${f}`, texto: readFileSync(join(raiz, dir, f), 'utf8') }))
  const imports = (texto) => [...texto.matchAll(/^\s*import\s[^'"]*['"]([^'"]+)['"]/gm)].map((m) => m[1])

  it('src/domain no importa react, react-dom ni otras capas, ni usa document/window', () => {
    for (const { ruta, texto } of archivos('domain/')) {
      for (const origen of imports(texto)) {
        expect(origen, ruta).not.toMatch(/react|\/data\/|\/presentation\//)
      }
      expect(texto, ruta).not.toMatch(/\b(document|window)\b/)
    }
  })

  it('src/data solo importa de domain', () => {
    for (const { ruta, texto } of archivos('data/')) {
      for (const origen of imports(texto)) {
        expect(origen, ruta).toMatch(/^\.\.\/domain\//)
      }
    }
  })

  it('src/presentation no importa de src/data', () => {
    for (const { ruta, texto } of archivos('presentation/')) {
      for (const origen of imports(texto)) {
        expect(origen, ruta).not.toMatch(/\/data\//)
      }
    }
  })

  it('solo src/main.jsx importa implementaciones de data', () => {
    expect(imports(readFileSync(join(raiz, 'main.jsx'), 'utf8')).some((o) => o.includes('/data/'))).toBe(true)
    for (const dir of ['domain/', 'presentation/']) {
      for (const { ruta, texto } of archivos(dir)) {
        expect(imports(texto).some((o) => o.includes('/data/')), ruta).toBe(false)
      }
    }
  })
})
