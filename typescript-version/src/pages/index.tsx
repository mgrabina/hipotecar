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
import { useData } from '@/configs/DataProvider'
import { set } from 'nprogress'
import { Button, Card, CardContent, CardHeader, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material'
import Link from 'next/link'
import Statistics from '@/views/dashboard/Statistics'
import MoreStories from '@/views/contentful/more-stories'
import { getAllPosts } from '@/lib/api'
import { PostType } from '@/lib/constants'
import dynamic from 'next/dynamic'
import { bankNameToSlug, calcularCuotaMensual, createCreditSlug, getTasa } from '@/@core/utils/misc'
import { Credit } from '@/configs/constants'
import Image from 'next/image'
import { parseMoney } from '@/@core/utils/string'
import { DeleteOutline } from 'mdi-material-ui'

const DynamicStories = dynamic(() => import('@/views/contentful/more-stories'), {
  loading: () => (
    <Skeleton
      style={{
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
      variant='rectangular'
      height={300}
      width='400px'
    />
  )
})

const DynamicStatistics = dynamic(() => import('@/views/dashboard/Statistics'), {
  loading: () => (
    <Skeleton
      style={{
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
      variant='rectangular'
      height={300}
      width='400px'
    />
  )
})

const Dashboard = () => {
  const [allPosts, setAllPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPosts()

      setLoading(false)
      if (data === undefined) return
      setAllPosts(data.slice(0, 2))
      if (data.length === 0) return
    }

    fetchData()
  }, [])

  const context = useData()

  const cheapestCredit = context?.data.credits
    .filter(c => c['Sueldo En Banco'] === 'FALSE')
    .reduce((prev, current) => (prev.Tasa < current.Tasa ? prev : current), context.data.credits[0])

  const [mostPopularIds, setMostPopularIds] = useState<string[]>([])
  const [mostPopular, setMostPopular] = useState<Credit[]>([])
  useEffect(() => {
    const fetchPopularCredits = async () => {
      const response = await fetch('/api/credits/popular')
      const data = await response.json()
      const creditIds = data.popularCreditIds

      if (response.ok) {
        setMostPopularIds(creditIds)
      } else {
        console.error('Failed to fetch popular credits:', data.error)
      }
    }

    fetchPopularCredits()
  }, [])

  useEffect(() => {
    if (context?.data.credits && mostPopularIds.length > 0) {
      const popularCredits = context.data.credits
        .filter(credit => mostPopularIds.includes(credit.Id.toString()))
        .sort((a, b) => mostPopularIds.indexOf(a.Id.toString()) - mostPopularIds.indexOf(b.Id.toString()))
        .filter(credit => credit !== undefined)

      setMostPopular(popularCredits)
    }
  }, [mostPopularIds, context?.data.credits])

  return (
    <div>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginTop: '1.5em' }}>
        <Link href='/buscador' passHref={true}>
          <Button variant='contained' color='primary' style={{ width: '100%' }}>
            Buscar, comparar y simular mi credito
          </Button>
        </Link>
      </div>

      {context?.data.user.selectedCredit && (
        <Card
          style={{
            marginTop: '2em',
            border: '1px solid',
            borderColor: theme.palette.primary.main
          }}
        >
          <CardHeader
            title='Mi Credito Hipotecario'
            action={
              <DeleteOutline
                style={{
                  cursor: 'pointer',
                  opacity: 0.8,
                  transition: '0.15s ease-in-out'
                }}
                onMouseEnter={e => ((e.currentTarget.style.opacity = '1'), (e.currentTarget.style.color = 'red'))}
                onMouseLeave={e => ((e.currentTarget.style.opacity = '0.8'), (e.currentTarget.style.color = 'black'))}
                onClick={() => {
                  context.setData(prevData => ({ ...prevData, user: { ...prevData.user, selectedCredit: undefined } }))
                }}
              ></DeleteOutline>
            }
            subheader='Seleccionado anteriormente en la tabla comparativa. '
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <div
                  style={{
                    width: '90%',
                    height: '90%',
                    position: 'relative'
                  }}
                >
                  <Link href={`/banco/${bankNameToSlug(context.data.user.selectedCredit.Banco)}`} passHref>
                    <Image
                      src={`/images/banks/${context.data.user.selectedCredit.Banco}.png`}
                      alt={context.data.user.selectedCredit.Banco}
                      style={{
                        cursor: 'pointer',
                        opacity: 0.8,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                      layout='fill'
                      objectFit='contain'
                    />
                  </Link>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <Link
                  href={`/creditos/${createCreditSlug(context.data.user.selectedCredit)}?loan=${context.data.user.loanAmount}&duration=${context.data.user.duration}`}
                  passHref
                >
                  <Typography
                    style={{
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: theme.palette.primary.main,
                      opacity: 0.8,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                  >{`${context.data.user.selectedCredit.Nombre} de ${context.data.user.selectedCredit.Banco}`}</Typography>
                </Link>
                <Typography variant='body1'>
                  <strong>Tasa</strong>: {`${context.data.user.selectedCredit.Tasa}%`}
                </Typography>
                <Typography variant='body1'>
                  <strong>Duración+</strong>: {`${context.data.user.selectedCredit.Duracion} años`}
                </Typography>
              </Grid>
              {/* Monto y primera cuota */}

              {context.data.user && (
                <Grid item xs={12} md={6}>
                  {!!context.data.user.loanAmount &&
                    !!context?.data.dolar &&
                    !!context?.data.UVA &&
                    context.data.user.duration && (
                      <>
                        <br></br>
                        <Typography variant='body1'>
                          <strong>Monto</strong>:{' '}
                          {Math.floor(context.data.user.loanAmount / context?.data.UVA).toLocaleString()} UVAs (
                          {parseMoney(context.data.user.loanAmount)} |{' '}
                          {context?.data.dolar && parseMoney(context.data.user.loanAmount / context?.data.dolar, 'USD')}
                          )
                        </Typography>
                        <Typography variant='body1'>
                          <strong>Primera Cuota</strong>:{' '}
                          {`${parseMoney(calcularCuotaMensual(context.data.user.loanAmount, context.data.user.selectedCredit.Tasa, context.data.user.duration))}`}
                        </Typography>
                      </>
                    )}
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

      <div style={{ marginTop: '2em' }}>
        <CreditsOverviewCard></CreditsOverviewCard>
      </div>

      {!context?.data.loaded ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '2em'
          }}
        >
          <Skeleton
            style={{
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
            variant='rectangular'
            height={300}
            width='400px'
          />
          <Skeleton
            style={{
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
            variant='rectangular'
            height={300}
            width='400px'
          />
        </div>
      ) : (
        <Grid
          container
          spacing={8}
          style={{
            marginTop: '0',
            marginBottom: '2em'
          }}
        >
          {cheapestCredit != undefined && (
            <Grid item xs={12} md={6}>
              <Card
                style={{
                  height: '100%'
                }}
              >
                <CardHeader title='Mejor Tasa' subheader='Apto para todo público.' />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <div
                        style={{
                          width: '90%',
                          height: '90%',
                          minHeight: '5em',
                          position: 'relative'
                        }}
                      >
                        <Link href={`/banco/${bankNameToSlug(cheapestCredit.Banco)}`} passHref>
                          <Image
                            src={`/images/banks/${cheapestCredit.Banco}.png`}
                            alt={cheapestCredit.Banco}
                            style={{
                              cursor: 'pointer',
                              opacity: 0.8,
                              transition: 'opacity 0.3s ease-in-out'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                            layout='fill'
                            objectFit='contain'
                          />
                        </Link>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Link href={`/creditos/${createCreditSlug(cheapestCredit)}`} passHref>
                        <Typography
                          style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                            opacity: 0.8,
                            transition: 'opacity 0.3s ease-in-out'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                        >{`${cheapestCredit.Nombre} de ${cheapestCredit.Banco}`}</Typography>
                      </Link>
                      <Typography variant='body1'>{`Tasa: ${cheapestCredit.Tasa}%`}</Typography>
                      <Typography variant='body1'>{`Duración Máxima: ${cheapestCredit.Duracion} años`}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
          {mostPopular.length > 0 && (
            <Grid item xs={12} md={6}>
              <Card
                style={{
                  height: '100%'
                }}
              >
                <CardHeader title='Mas Popular' subheader='En base a las búsquedas de los usuarios' />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <div
                        style={{
                          width: '90%',
                          height: '90%',
                          minHeight: '5em',
                          position: 'relative',
                          padding: '1em'
                        }}
                      >
                        <Link href={`/banco/${bankNameToSlug(mostPopular[0].Banco)}`} passHref>
                          <Image
                            src={`/images/banks/${mostPopular[0].Banco}.png`}
                            alt={mostPopular[0].Banco}
                            layout='fill'
                            style={{
                              cursor: 'pointer',
                              opacity: 0.6,
                              transition: 'opacity 0.3s ease-in-out'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                            objectFit='contain'
                          />
                        </Link>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Link href={`/creditos/${createCreditSlug(mostPopular[0])}`} passHref>
                        <Typography
                          style={{
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                            opacity: 0.8,
                            transition: 'opacity 0.3s ease-in-out'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                        >{`${mostPopular[0].Nombre} de ${mostPopular[0].Banco}`}</Typography>
                      </Link>
                      <Typography variant='body1'>{`Tasa: ${mostPopular[0].Tasa}%`}</Typography>
                      <Typography variant='body1'>{`Duración Máxima: ${mostPopular[0].Duracion} años`}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '2em'
          }}
        >
          <Skeleton
            style={{
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
            variant='rectangular'
            height={300}
            width='400px'
          />
          <Skeleton
            style={{
              borderRadius: '5px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
            variant='rectangular'
            height={300}
            width='400px'
          />
        </div>
      ) : (
        <DynamicStories title='' morePosts={allPosts} />
      )}
    </div>
  )
}

export default Dashboard
