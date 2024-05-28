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
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import Card from 'src/@core/theme/overrides/card'
import FormLayoutsBasic from 'src/views/form-layouts/FormLayoutsBasic'
import RiskForm from 'src/views/form-layouts/custom/RiskForm'
import BaseForm from 'src/views/form-layouts/custom/BaseForm'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getActiveStep, stepLinks } from 'src/@core/layouts/components/vertical/navigation/ProgressBar'
import { useData } from 'src/@core/layouts/HipotecarLayout'
import { set } from 'nprogress'
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'

const Dashboard = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <div>
      {/* Metricas clave */}
      <div style={{ marginTop: '2em' }}>
        <StatisticsCard></StatisticsCard>
      </div>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '1.5em' }}>
        <Link href='/simulation' passHref={true}>
          <Button variant='contained' color='primary' style={{ width: '100%' }}>
            Buscar y simular mi credito
          </Button>
        </Link>
      </div>

      <div style={{ marginTop: '3em' }}>
        {isSmallScreen ? (
          <iframe
            src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
            style={{
              width: '100%',
              height: '80em',
              border: 'none',
              padding: '0'
            }}
            scrolling='no'
          ></iframe>
        ) : (
          <Grid container spacing={8}>
            <Grid item xs={12} md={6} style={{ overflow: 'hidden', height: '30em' }}>
              <iframe
                src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
                style={{
                  width: '100%',
                  height: '28em',
                  padding: '0',
                  overflow: 'hidden',
                  border: 'none',
                  transform: 'translateY(-1.5em)'
                }}
                scrolling='no'
              ></iframe>
            </Grid>
            <Grid item xs={12} md={6} style={{ overflow: 'hidden', height: '30em' }}>
              <iframe
                src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
                style={{
                  width: '100%',
                  height: '57em',
                  overflow: 'hidden',
                  border: 'none',
                  padding: '0',
                  transform: 'translateY(-30.1em)'
                }}
                scrolling='no'
              ></iframe>
            </Grid>
            <Grid item xs={12} md={6} style={{ overflow: 'hidden', height: '30em' }}>
              <iframe
                src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
                style={{
                  width: '100%',
                  height: '85em',
                  overflow: 'hidden',
                  border: 'none',
                  padding: '0',
                  transform: 'translateY(-59em)'
                }}
                scrolling='no'
              ></iframe>
            </Grid>
            <Grid item xs={12} md={6} style={{ overflow: 'hidden', height: '30em' }}>
              <iframe
                src='https://e.infogram.com/59baed14-b568-4b6e-964d-31bac3937be1?src=embed'
                style={{
                  width: '100%',
                  height: '117em',
                  overflow: 'hidden',
                  border: 'none',
                  padding: '0',
                  transform: 'translateY(-87.5em)'
                }}
                scrolling='no'
              ></iframe>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  )
}

export default Dashboard
