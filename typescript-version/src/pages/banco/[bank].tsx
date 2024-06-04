import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Skeleton
} from '@mui/material'
import { useRouter } from 'next/router'
import { useData } from '@/configs/DataProvider'
import { parseMoney } from 'src/@core/utils/string'
import { calcularCuotaMensual, createCreditSlug, getBankBySlug, getLoanPlotData } from 'src/@core/utils/misc'
import LoanChart from 'src/views/pages/detail/LoanChart'
import LoanPaidChart from 'src/views/pages/detail/LoanPaidChart'
import PrecancelLoanChart from 'src/views/pages/detail/PrecancelLoanChart'
import { ArrowDown } from 'mdi-material-ui'
import Link from 'next/link'
import Head from 'next/head'
import Error404 from '../404'

const BankDetailPage = () => {
  const router = useRouter()
  const context = useData()
  const bank = getBankBySlug(context?.data?.banks ?? [], router.query.bank?.toString() ?? '')

  const credits = context?.data.credits.filter(
    credit => credit.Banco.toLowerCase().localeCompare(bank?.toLowerCase() ?? '') === 0
  )

  if (!bank || !context?.data.credits.length)
    return (
      <Skeleton
        style={{
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          marginTop: '2em'
        }}
        variant='rectangular'
        height='400px'
        width='100%'
      />
    )
  if (!credits?.length) return <Error404 />

  return (
    <>
      <Head>
        <title>Creditos Hipotecarios UVA del {credits[0].Banco}</title>
        <meta
          name='description'
          content={`Descubra los creditos hipotecarios UVA del ${credits[0].Banco}, compare tasas, montos, duraciones y más.`}
        />
        <meta property='og:title' content={`Creditos Hipotecarios UVA del ${credits[0].Banco}`} />
        <meta
          property='og:description'
          content={`Descubra los creditos hipotecarios UVA del ${credits[0].Banco}, compare tasas, montos, duraciones y más.`}
        />
        <meta property='og:image' content={credits[0]['Logo Banco']} />
        <meta property='twitter:image' content={credits[0]['Logo Banco']} />
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:title' content={`Creditos Hipotecarios UVA del ${credits[0].Banco}`} />
        <meta
          property='twitter:description'
          content={`Descubra los creditos hipotecarios UVA del ${credits[0].Banco}, compare tasas, montos, duraciones y más.`}
        />
      </Head>

      <Card style={{ marginTop: '2em' }}>
        <CardMedia
          sx={{ height: '10.5625rem', objectFit: 'scale-down', padding: '1em' }}
          component='img'
          image={credits[0]['Logo Banco']}
        />
        <CardContent>
          <div>
            <Typography variant='body1'>
              El banco {credits[0].Banco} ofrece los siguientes {credits.length} creditos hipotecarios UVA:
            </Typography>

            <br></br>
            {credits.map((credit, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ArrowDown />}>
                  <Typography variant='body1'>
                    <strong>
                      {credit.Nombre} {credit.Tipo} {credit['Sueldo En Banco'] === 'TRUE' ? '(Sueldo en banco)' : ''}
                    </strong>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2} padding={1}>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Credito</strong>: {credit['Nombre']}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Banco</strong>: {credit['Banco']}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Tasa</strong>: {credit['Tasa']}% + UVA
                      </Typography>
                    </Grid>
                    {!!credit['Tasa especial por tiempo definido'] && (
                      <Grid item xs={12} md={6}>
                        <Typography variant='body1'>
                          <strong>Tasa especial</strong>: {credit['Tasa especial por tiempo definido']}% por{' '}
                          {credit['Duracion Tasa Especial en Meses']} meses
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Tipo</strong>: {credit['Tipo']}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Monto Maximo</strong>:{' '}
                        {context?.data.UVA && parseMoney(credit['Monto Maximo en UVAs'] * context?.data.UVA)} (
                        {parseMoney(credit['Monto Maximo en UVAs'], 'USD')})
                      </Typography>
                    </Grid>
                    {credit['% Pre-Cancelacion'] && (
                      <Grid item xs={12} md={6}>
                        <Typography variant='body1'>
                          <strong>Precancelacion</strong>: {credit['% Pre-Cancelacion']}% + IVA
                        </Typography>
                      </Grid>
                    )}
                    {credit['% Prima de seguro'] && (
                      <Grid item xs={12} md={6}>
                        <Typography variant='body1'>
                          <strong>Prima de seguro</strong>: {credit['% Prima de seguro']}% + IVA
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>% Máximo de financiación</strong>: {credit['% Maximo de Financiacion']}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Relacion cuota-ingreso</strong>: {credit['Relacion Cuota Ingreso']} %
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Ingresos Mínimos</strong>: {parseMoney(credit['Ingresos Minimos'])}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Monotributistas</strong>: {credit['Acepta Monotributistas'] === 'TRUE' ? 'Si' : 'No'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Segunda Vivienda</strong>: {credit['Apto Segunda Vivienda'] === 'TRUE' ? 'Si' : 'No'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Requiere sueldo en banco</strong>: {credit['Sueldo En Banco'] === 'TRUE' ? 'Si' : 'No'}
                      </Typography>
                    </Grid>
                    {credit['Provincias'].length > 0 && (
                      <Grid item xs={12} md={6}>
                        <Typography variant='body1'>
                          <strong>Provincias</strong>: {credit.Provincias}
                        </Typography>
                      </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                      <Typography variant='body1'>
                        <strong>Mas información</strong>:{' '}
                        <Link href={`/creditos/${createCreditSlug(credit)}`} passHref={true}>
                          Haz click aquí
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BankDetailPage
