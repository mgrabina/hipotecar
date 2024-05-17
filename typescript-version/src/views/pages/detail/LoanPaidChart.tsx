import React from 'react'
import { useTheme } from '@mui/material/styles'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { parseMoney } from 'src/@core/utils/string'

const LoanPaidChart = ({
  loanPlotDataResults
}: {
  loanPlotDataResults: { cuotaMensual: any; interes: any; amortizacion: any }[]
}) => {
  const theme = useTheme()
  const totalCuotas = loanPlotDataResults.length
  const cuota = loanPlotDataResults[0].cuotaMensual

  const calculateAccumulatedPayments = () => {
    let accumulated = 0

    return loanPlotDataResults.map(result => {
      accumulated += result.amortizacion

      return accumulated
    })
  }

  // Cálculo de pagos acumulados y saldo pendiente
  let accumulatedPayments = 0
  const accumulatedPaymentsData: number[] = []
  const outstandingBalanceData: number[] = []

  loanPlotDataResults.forEach((result, index) => {
    accumulatedPayments += result.cuotaMensual
    accumulatedPaymentsData.push(accumulatedPayments)
    outstandingBalanceData.push(totalCuotas * cuota - accumulatedPayments)
  })

  const apexChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: '100%'
    },
    dataLabels: {
      enabled: false
    },
    yaxis: {
      labels: {
        show: false
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

  const series = [
    { name: 'Pagado', data: accumulatedPaymentsData },
    { name: 'Saldo Pendiente', data: outstandingBalanceData }
  ]

  return <ReactApexcharts type='bar' height={400} options={apexChartOptions} series={series} />
}

export default LoanPaidChart
