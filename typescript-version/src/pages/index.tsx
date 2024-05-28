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
import FormLayoutsBasic from 'src/views/form-layouts/FormLayoutsBasic'
import RiskForm from 'src/views/form-layouts/custom/RiskForm'
import BaseForm from 'src/views/form-layouts/custom/BaseForm'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getActiveStep, stepLinks } from 'src/@core/layouts/components/vertical/navigation/ProgressBar'
import { useData } from 'src/@core/layouts/HipotecarLayout'
import { set } from 'nprogress'
import { Button, Card, CardContent, CardHeader, Typography, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'
import Statistics from '@/views/dashboard/Statistics'
import MoreStories from '@/views/contentful/more-stories'
import { getAllPosts } from '@/lib/api'
import { PostType } from '@/lib/constants'

const Dashboard = () => {
  const [allPosts, setAllPosts] = useState<PostType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPosts()

      if (data === undefined) return
      setAllPosts(data.slice(0, 2))
      if (data.length === 0) return
    }

    fetchData()
  }, [])

  return (
    <div>
      {/* Metricas clave */}
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '1.5em' }}>
        <Link href='/simulation' passHref={true}>
          <Button variant='contained' color='primary' style={{ width: '100%' }}>
            Buscar y simular mi credito
          </Button>
        </Link>
      </div>

      <div style={{ marginTop: '2em' }}>
        <CreditsOverviewCard></CreditsOverviewCard>
      </div>

      <MoreStories title='' morePosts={allPosts}></MoreStories>

      <Statistics></Statistics>
    </div>
  )
}

export default Dashboard
