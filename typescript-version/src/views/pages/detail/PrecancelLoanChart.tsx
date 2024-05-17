import React from 'react'
import { useTheme } from '@mui/material/styles'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { parseMoney } from 'src/@core/utils/string'

const PrecancelLoanChart = ({
  totalLoan,
  loanPlotDataResults,
  ivaRate,
  prepaymentPenaltyRate
}: {
  totalLoan: number
  loanPlotDataResults: { cuotaMensual: any; interes: any; amortizacion: any }[]
  ivaRate: number
  prepaymentPenaltyRate: number
}) => {
  // Cálculo de pagos acumulados y saldo pendiente
  let accumulatedPayments = 0
  const prepaymentPenaltyData: number[] = []

  loanPlotDataResults.forEach((result, index) => {
    accumulatedPayments += result.amortizacion
    const outstandingBalance = totalLoan - accumulatedPayments

    let prepaymentPenalty = 0
    prepaymentPenalty = outstandingBalance * prepaymentPenaltyRate * (1 + ivaRate)
    prepaymentPenaltyData.push(prepaymentPenalty)
  })
  const apexChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    dataLabels: {
      enabled: false
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return parseMoney(value)
        }
      }
    },
    tooltip: {
      x: {
        formatter: function (value) {
          return 'Mes ' + Math.floor(value)
        }
      },
      y: {
        formatter: function (value) {
          return parseMoney(value)
        }
      }
    },
    xaxis: {
      labels: {
        formatter: function (value) {
          return 'Mes ' + Math.floor(Number(value))
        }
      }
    }
  }

  const series = [{ name: 'Costo de Precancelación', data: prepaymentPenaltyData }]

  return <ReactApexcharts type='bar' height={400} options={apexChartOptions} series={series} />
}

export default PrecancelLoanChart
