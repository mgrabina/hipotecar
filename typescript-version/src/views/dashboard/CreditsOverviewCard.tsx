// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { Bank, HoopHouse, TestTube, Text } from 'mdi-material-ui'
import { useData } from 'src/@core/layouts/HipotecarLayout'
import { parseMoney } from 'src/@core/utils/string'

interface DataType {
  stats?: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

export type StatisticsData = { banks?: number; variations?: number; uva?: number; dolar?: number }

const salesData = (data: StatisticsData): DataType[] => [
  {
    stats: data.banks?.toLocaleString(),
    title: 'Bancos',
    color: 'primary',
    icon: <Bank sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: data.variations?.toLocaleString(),
    title: 'Variaciones',
    color: 'info',
    icon: <TestTube sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: data.uva ? parseMoney(data.uva) : undefined,
    color: 'warning',
    title: 'UVA',
    icon: <HoopHouse sx={{ fontSize: '1.75rem' }} />
  },
  {
    stats: data.dolar ? parseMoney(data.dolar) : undefined,
    color: 'success',
    title: 'Dólar',
    icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
  }
]

const renderStats = (data: StatisticsData) => {
  return salesData(data).map((item: DataType, index: number) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats ? item.stats : '-'}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const CreditsOverviewCard = () => {
  const context = useData()

  const data: StatisticsData = {
    banks: context?.data.banks.length,
    variations: context?.data.credits.length,
    uva: context?.data.UVA,
    dolar: context?.data.dolar
  }

  return (
    <Card>
      <CardHeader
        title='Monitor de Mercado'
        subheader={<Typography variant='body2'>Información actualizada automáticamente en tiempo real</Typography>}
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats(data)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CreditsOverviewCard
