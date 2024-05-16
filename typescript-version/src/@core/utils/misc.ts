import { Credit } from 'src/configs/constants'
import { UserData } from '../layouts/HipotecarLayout'

export interface CreditEvaluationResult {
  creditosCompatibles: { credit: Credit; loan: number }[]
  razonesDeLosRestantes: string[]
}

export const getBiggestLoanBasedOnSalary = (credits: Credit[], userData: UserData): CreditEvaluationResult => {
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

      // @todo Get UVA value automatically from API
      if (credit['Monto Maximo en UVAs'] && maxLoan > credit['Monto Maximo en UVAs'] * 922) {
        maxLoan = credit['Monto Maximo en UVAs'] * 922
      }

      return {
        loan: Math.floor(maxLoan),
        credit
      }
    }),

    razonesDeLosRestantes: compatibles.razonesDeLosRestantes
  }
}

export const getCompatibleCredits = (credits: Credit[], userData: UserData): CreditEvaluationResult => {
  const creditosCompatibles: CreditEvaluationResult['creditosCompatibles'] = []
  const razonesDeLosRestantes: string[] = []

  credits.forEach(credit => {
    const reasons = []
    let isCompatible = true

    if (userData?.salary && credit['Ingresos Minimos'] && credit['Ingresos Minimos'] <= userData.salary) {
      reasons.push(
        `El ingreso mínimo requerido de ${credit['Ingresos Minimos']} es mayor que su salario actual de ${userData.salary}.`
      )
      isCompatible = false
    }

    if (userData?.duration && credit['Duracion'] < userData.duration) {
      reasons.push(
        `El plazo máximo ofrecido de ${credit['Duracion']} meses es menor que el plazo deseado de ${userData.duration} meses.`
      )
      isCompatible = false
    }

    // @todo Get UVA value automatically from API
    if (userData.budgetType === 'personalizado') {
      if (
        userData?.budget &&
        credit['Monto Maximo en UVAs'] &&
        credit['Monto Maximo en UVAs'] * 922 < userData.budget
      ) {
        reasons.push(
          `El monto máximo financiable de ${
            credit['Monto Maximo en UVAs'] * 922
          } es menor que el presupuesto necesario de ${userData.budget}.`
        )
        isCompatible = false
      }
    }

    if (userData?.creditType && credit.Tipo !== userData.creditType) {
      reasons.push(`El tipo de crédito requerido es '${userData.creditType}', pero el disponible es '${credit.Tipo}'.`)
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

    // Check Quota Salary Ratio
    if (
      userData.salary &&
      userData.budgetType === 'personalizado' &&
      userData.budget &&
      userData.duration &&
      credit['Relacion Cuota Ingreso'] &&
      credit['Relacion Cuota Ingreso'] > 0
    ) {
      const cuotaMensual = calcularCuotaMensual(userData.budget, credit.Tasa, userData.duration)
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
      creditosCompatibles.push({ credit, loan: userData.budgetType === 'personalizado' ? userData.budget ?? 0 : 0 })
    } else {
      razonesDeLosRestantes.push(`Crédito '${credit.Nombre}' en ${credit.Banco}: ${reasons.join(' ')}\n`)
    }
  })

  // Quedarse el credito de tasa mas baja por banco
  const creditosCompatiblesPorBanco = creditosCompatibles.reduce((acc, creditObj) => {
    const { credit: credit } = creditObj

    if (!acc[credit.Banco]) {
      acc[credit.Banco] = []
    }
    acc[credit.Banco].push(creditObj)

    return acc
  }, {} as Record<string, CreditEvaluationResult['creditosCompatibles']>)

  const compatibles = Object.keys(creditosCompatiblesPorBanco)?.map(banco => {
    const creditos = creditosCompatiblesPorBanco[banco]
    const minTasa = Math.min(...creditos.map(credit => credit.credit.Tasa))

    return creditos.find(credit => credit.credit.Tasa === minTasa) ?? creditos[0]
  })

  return {
    creditosCompatibles: compatibles,
    razonesDeLosRestantes
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
