import { Credit } from 'src/configs/constants'
import { UserData } from '../layouts/HipotecarLayout'
import { parseMoney } from './string'

export interface CreditEvaluationResult {
  creditosCompatibles: { credit: Credit; loan: number }[]
  razonesDeLosRestantes: string[]
}

export const getBiggestLoanBasedOnSalary = (
  credits: Credit[],
  userData: UserData,
  UVA = 922
): CreditEvaluationResult => {
  const salary = userData.salary
  if (!salary) return { creditosCompatibles: [], razonesDeLosRestantes: ['No se ha ingresado un salario.'] }

  const compatibles = getCompatibleCredits(credits, userData)

  return {
    creditosCompatibles: compatibles.creditosCompatibles.map(creditObject => {
      const credit = creditObject.credit
      let maxLoan = 0

      if (credit['Ingresos Minimos'] && credit['Ingresos Minimos'] > salary) {
        maxLoan = 0
      }

      if (credit['Relacion Cuota Ingreso'] && credit['Relacion Cuota Ingreso'] > 0) {
        const maxCuotaMensual = (salary * credit['Relacion Cuota Ingreso']) / 100
        maxLoan = calcularMontoPrestamo(maxCuotaMensual, credit.Tasa, credit.Duracion)
      }

      if (credit['Monto Maximo en UVAs'] && maxLoan > credit['Monto Maximo en UVAs'] * UVA) {
        maxLoan = credit['Monto Maximo en UVAs'] * UVA
      }

      return {
        loan: Math.floor(maxLoan),
        credit
      }
    }),

    razonesDeLosRestantes: compatibles.razonesDeLosRestantes
  }
}

export const createCreditSlug = (credit: Credit) => {
  return `${credit.Nombre}-${credit.Tipo}-${credit.Banco}-${credit['Sueldo En Banco'] === 'TRUE' ? 'sueldo-en-banco' : 'externo'}`
    .replace(/ /g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

export const bankNameToSlug = (bankName: string) => {
  return bankName
    .replace(/ /g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

export const getCreditBySlug = (credits: Credit[], slug: string) => {
  return credits.find(credit => createCreditSlug(credit) === slug)
}

export const getBankBySlug = (banks: string[], slug: string) => {
  return banks.find(bank => bankNameToSlug(bank).localeCompare(slug) === 0)
}

export const getCompatibleCredits = (credits: Credit[], userData: UserData, UVA = 922): CreditEvaluationResult => {
  const creditosCompatibles: CreditEvaluationResult['creditosCompatibles'] = []
  const razonesDeLosRestantes: string[] = []

  credits.forEach(credit => {
    const reasons = []
    let isCompatible = true

    if (userData?.salary && credit['Ingresos Minimos'] && credit['Ingresos Minimos'] >= userData.salary) {
      reasons.push(
        `El ingreso mínimo requerido de ${credit['Ingresos Minimos']} es mayor que su salario actual de ${userData.salary}.`
      )
      isCompatible = false
    }

    if (userData?.duration && credit['Duracion'] < userData.duration) {
      reasons.push(
        `El plazo máximo ofrecido de ${credit['Duracion']} años es menor que el plazo deseado de ${userData.duration} años.`
      )
      isCompatible = false
    }

    if (userData.loanType === 'personalizado') {
      if (
        userData?.loanAmount &&
        credit['Monto Maximo en UVAs'] &&
        credit['Monto Maximo en UVAs'] * UVA < userData.loanAmount
      ) {
        reasons.push(
          `El monto máximo financiable de ${parseMoney(
            credit['Monto Maximo en UVAs'] * UVA
          )} es mayor que el monto deseado de ${parseMoney(userData.loanAmount)}.`
        )
        isCompatible = false
      }
    }

    if (userData?.creditType && credit.Tipo !== userData.creditType) {
      // reasons.push(`El tipo de crédito requerido es '${userData.creditType}', pero el disponible es '${credit.Tipo}'.`)
      isCompatible = false
    }

    if (credit['Sueldo En Banco'] == 'TRUE') {
      if (userData?.banks && !userData.banks.includes(credit.Banco)) {
        reasons.push(
          `El crédito requiere que el sueldo esté en el banco '${credit.Banco}', que no está en su lista de bancos.`
        )
        isCompatible = false
      }
    }

    // Check each province
    if (credit['Provincias']) {
      const provincias = credit['Provincias'].split(',').map(p => p.trim())
      if (userData?.provinces && !provincias.some(p => userData.provinces?.includes(p))) {
        reasons.push(
          `El crédito solo está disponible para las provincias ${provincias.join(
            ', '
          )}, que no están en su lista de provincias seleccionadas.`
        )
        isCompatible = false
      }
    }

    // Check monotributista
    const taxTypeAccepted: boolean[] = []
    if (
      credit['Acepta Monotributistas'] == 'TRUE' &&
      (userData.taxType?.includes('Monotributo') || userData.monotributista == true)
    ) {
      taxTypeAccepted.push(true)
    }

    if (credit['Acepta Autonomos'] == 'TRUE' && userData.taxType?.includes('Autonomo')) {
      taxTypeAccepted.push(true)
    }

    if (
      credit['Acepta Relacion de Dependencia'] == 'TRUE' &&
      (userData.taxType?.includes('Relacion de Dependencia') || userData.monotributista == false)
    ) {
      taxTypeAccepted.push(true)
    }

    if (!taxTypeAccepted.some(t => t === true)) {
      reasons.push(`El crédito no acepta su condicion frente a AFIP.`)
      isCompatible = false
    }

    // Check second house
    if (credit['Apto Segunda Vivienda'] == 'FALSE' && userData?.secondHome) {
      reasons.push(`El crédito no es apto para segundas viviendas.`)
      isCompatible = false
    }

    // Check Quota Salary Ratio
    if (
      userData.salary &&
      userData.loanType === 'personalizado' &&
      userData.loanAmount &&
      userData.duration &&
      credit['Relacion Cuota Ingreso'] &&
      credit['Relacion Cuota Ingreso'] > 0
    ) {
      const cuotaMensual = calcularCuotaMensual(userData.loanAmount, credit.Tasa, userData.duration)
      const rci = (cuotaMensual / userData.salary) * 100

      if (rci > credit['Relacion Cuota Ingreso']) {
        reasons.push(
          `La relación cuota/ingreso de ${rci.toFixed(2)} supera el máximo permitido de ${
            credit['Relacion Cuota Ingreso']
          }.`
        )
        isCompatible = false
      }
    }

    if (isCompatible) {
      creditosCompatibles.push({ credit, loan: userData.loanType === 'personalizado' ? userData.loanAmount ?? 0 : 0 })
    } else {
      if (reasons.length > 0) {
        razonesDeLosRestantes.push(`Crédito '${credit.Nombre}' en ${credit.Banco}: ${reasons.join(' ')}\n`)
      }
    }
  })

  // Por cada par de creditos con mismo (nombre y banco), quedarse con el que tenga Sueldo en Banco
  const creditosCompatiblesPorNombre = creditosCompatibles.reduce(
    (acc, creditObj) => {
      const { credit: credit } = creditObj

      const id = credit.Nombre + '-' + credit.Banco

      if (!acc[id]) {
        acc[id] = []
      }
      acc[id].push(creditObj)

      return acc // Add this line to return the updated accumulator object
    },
    {} as Record<string, CreditEvaluationResult['creditosCompatibles']>
  )

  const compatibles = Object.keys(creditosCompatiblesPorNombre).map(key => {
    const creditos = creditosCompatiblesPorNombre[key]
    const credit = creditos.find((credit: any) => credit.credit['Sueldo En Banco'] == 'TRUE') ?? creditos[0]

    return credit
  })

  const razonesDeLosRestantesUnicas = Array.from(new Set(razonesDeLosRestantes))

  return {
    creditosCompatibles: compatibles,
    razonesDeLosRestantes: razonesDeLosRestantesUnicas
  }
}

export function calcularCuotaMensual(montoPrestamo: number, tasaAnual: number, plazoAnios: number): number {
  const tasaMensual = tasaAnual / 12 / 100 // Convertir la tasa anual en decimal y dividirla por 12 para obtener la tasa mensual
  const plazoMeses = plazoAnios * 12 // Convertir el plazo de años a meses
  const cuotaMensual =
    (montoPrestamo * tasaMensual * Math.pow(1 + tasaMensual, plazoMeses)) / (Math.pow(1 + tasaMensual, plazoMeses) - 1)

  return cuotaMensual
}

export function calcularMontoPrestamo(cuotaMensual: number, tasaAnual: number, plazoAnios: number): number {
  const tasaMensual = tasaAnual / 12 / 100 // Convertir la tasa anual en decimal y dividirla por 12 para obtener la tasa mensual
  const plazoMeses = plazoAnios * 12 // Convertir el plazo de años a meses

  const montoPrestamo =
    (cuotaMensual * (Math.pow(1 + tasaMensual, plazoMeses) - 1)) / (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses))

  return montoPrestamo
}

export function calcularAdelanto(montoPrestamo: number, maximoFinanciacion: number): number {
  return (montoPrestamo * (100 - maximoFinanciacion)) / 100
}

export async function getDolarMep() {
  const ret = await fetch('https://dolarapi.com/v1/dolares/bolsa')
  const data: {
    moneda: string
    casa: string
    compra: number
    venta: number
    fechaActualizacion: string
  } = await ret.json()

  return data.venta
}

export interface BCRAResponse {
  status: number
  results: BCRAResponseItem[]
}

export interface BCRAResponseItem {
  idVariable: number
  cdSerie: number
  descripcion: string
  fecha: string
  valor: number
}

const UVABCRAVariableId = 31

export async function getUVA() {
  const ret = await fetch('https://api.bcra.gob.ar/estadisticas/v2.0/principalesvariables')
  const html = (await ret.json()) as BCRAResponse

  return html.results.find(r => r.idVariable === UVABCRAVariableId)?.valor
}

export function getLoanPlotData(loanAmount: number, tasa: number, duration: number) {
  if (!loanAmount || !tasa || !duration) return []

  const tasaMensual = tasa / 12 / 100
  const plazoMeses = duration * 12

  const cuotaMensual = calcularCuotaMensual(loanAmount, tasa, duration)

  const data = []
  let saldoPendiente = loanAmount
  for (let i = 0; i < plazoMeses; i++) {
    const interes = Math.floor(saldoPendiente * tasaMensual)
    const amortizacion = Math.floor(cuotaMensual - interes)

    saldoPendiente -= amortizacion

    data.push({
      mes: i + 1,
      cuotaMensual,
      interes,
      amortizacion,
      saldoPendiente
    })
  }

  return data
}
