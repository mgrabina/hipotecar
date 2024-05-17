import React from 'react'

import { useTheme } from '@mui/material/styles'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { parseMoney } from 'src/@core/utils/string'

const LoanChart = ({
  loanPlotDataResults
}: {
  loanPlotDataResults: { cuotaMensual: any; interes: any; amortizacion: any }[]
}) => {
  const theme = useTheme()
  const cuota = loanPlotDataResults[0].cuotaMensual

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
          return parseMoney(value) + ` (${Number(value/cuota*100).toFixed(1)}%)`
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
    { name: 'Interes', data: loanPlotDataResults.map((result: { interes: any }) => result.interes) },
    { name: 'Amortizacion', data: loanPlotDataResults.map((result: { amortizacion: any }) => result.amortizacion) }
  ]

  return <ReactApexcharts type='bar' height={400} options={apexChartOptions} series={series} />
}

export default LoanChart
