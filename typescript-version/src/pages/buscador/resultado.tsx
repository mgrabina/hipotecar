// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import CreditsOverviewCard from 'src/views/dashboard/CreditsOverviewCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import Card from 'src/@core/theme/overrides/card'
import FormLayoutsBasic from 'src/views/form-layouts/FormLayoutsBasic'
import RiskForm from 'src/views/form-layouts/custom/RiskForm'
import ComparisonForm from 'src/views/form-layouts/custom/ComparisonForm'
import Head from 'next/head'

const Dashboard = () => {
  return (
    <div>
      <Head>
        <title>Los resultados de tus créditos hipotecarios UVA ideales | Mi Credito Hipotecario</title>
        <meta
          name='description'
          content='Descubre los resultados de cuales son tus creditos hipotecarios UVA ideales en Argentina. Comparar tasas, cuotas, requisitos y mas.'
        />
        <meta
          property='og:title'
          content='Los resultados de tus creditos hipotecarios UVA ideales | Mi Credito Hipotecario'
        />
        <meta
          property='og:description'
          content='Descubre los resultados de cuales son tus creditos hipotecarios UVA ideales en Argentina. Comparar tasas, cuotas, requisitos y mas.'
        />
        <meta property='og:url' content='https://www.micredito.com.ar/creditos/todos' />
        <meta property='og:image' content='https://www.micredito.com.ar/generated/happy.png' />
        <meta
          property='twitter:title'
          content='Los resultados de tus creditos hipotecarios UVA ideales | Mi Credito Hipotecario'
        />
        <meta
          property='twitter:description'
          content='Descubre los resultados de cuales son tus creditos hipotecarios UVA ideales en Argentina. Comparar tasas, cuotas, requisitos y mas.'
        />
        <meta property='twitter:image' content='https://www.micredito.com.ar/generated/happy.png' />
      </Head>
      <ComparisonForm />
    </div>
  )
}

export default Dashboard
