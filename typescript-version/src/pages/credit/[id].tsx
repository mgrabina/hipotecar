import { Card, CardContent, CardHeader, CardMedia, Grid, Theme, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useData } from 'src/@core/layouts/HipotecarLayout'
import { parseMoney } from 'src/@core/utils/string'
import Error404 from '../404'
import { calcularCuotaMensual, getLoanPlotData } from 'src/@core/utils/misc'
import { ApexOptions } from 'apexcharts'
import LoanChart from 'src/views/pages/detail/LoanChart'
import LoanPaidChart from 'src/views/pages/detail/LoanPaidChart'
import PrecancelLoanChart from 'src/views/pages/detail/PrecancelLoanChart'

const DetailPage = () => {
  const router = useRouter()
  const theme = useTheme()

  const id = Number(router.query.id)
  const loan = Number(router.query.loan ?? 100000000)
  const duration = Number(router.query.duration ?? 20)

  const isInformative = !router.query.loan && !router.query.duration

  const context = useData()

  const credit = context?.data.credits.find(credit => credit.Id == Number(id))
  if (!id) {
    return <Error404 />
  }

  if (!credit) return null

  const loanPlotDataResults = getLoanPlotData(loan ?? 100000000, credit['Tasa'], duration ?? 20)

  return (
    <Card style={{ marginTop: '4em' }}>
      <CardMedia sx={{ height: '10.5625rem', objectFit: 'scale-down' }} component='img' image={credit['Logo Banco']} />
      <CardContent>
        <Typography variant='body2'>
          <Typography variant='h6'> Detalles</Typography>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant='body1'>
                <strong>Credito</strong>: {credit['Nombre']}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body1'>
                <strong>Banco</strong>: {credit['Banco']}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='body1'>
                <strong>Tasa</strong>: {credit['Tasa']}% + UVA
              </Typography>
            </Grid>

            {!!credit['Tasa especial por tiempo definido'] && (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Tasa especial</strong>: {credit['Tasa especial por tiempo definido']}% por{' '}
                  {credit['Duracion Tasa Especial en Meses']} meses
                </Typography>
              </Grid>
            )}

            <Grid item xs={6}>
              <Typography variant='body1'>
                <strong>Tipo</strong>: {credit['Tipo']}
              </Typography>
            </Grid>
            {loan ? (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Monto</strong>: {parseMoney(Number(loan.toString()))} (
                  {context?.data.dolar && parseMoney(loan / context?.data.dolar, 'USD')})
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Monto Maximo</strong>: {parseMoney(credit['Monto Maximo en UVAs'] * 922)}
                  {'  '}({parseMoney(credit['Monto Maximo en UVAs'], 'USD')})
                </Typography>
              </Grid>
            )}
            {loan && duration && (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Valor de Cuota</strong>: {parseMoney(calcularCuotaMensual(loan, credit['Tasa'], duration))}
                </Typography>
              </Grid>
            )}

            {credit['% Pre-Cancelacion'] && (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Precancelacion</strong>: {credit['% Pre-Cancelacion']}% + IVA
                </Typography>
              </Grid>
            )}
            {credit['% Prima de seguro'] && (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Prima de seguro</strong>: {credit['% Prima de seguro']}% + IVA
                </Typography>
              </Grid>
            )}
            {duration ? (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Duracion</strong>: {duration} años
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Duracion máxima</strong>: {credit['Duracion']} años
                </Typography>
              </Grid>
            )}

            {isInformative && (
              <>
                <Grid item xs={6}>
                  <Typography variant='body1'>
                    <strong>% Máximo de financiación</strong>: {credit['% Maximo de Financiacion']}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1'>
                    <strong>Relacion cuota-ingreso</strong>: {credit['Relacion Cuota Ingreso']} %
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1'>
                    <strong>Ingresos Mínimos</strong>: {parseMoney(credit['Ingresos Minimos'])}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='body1'>
                    <strong>Monotributistas</strong>: {credit['Acepta Monotributistas'] === 'TRUE' ? 'Si' : 'No'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant='body1'>
                    <strong>Segunda Vivienda</strong>: {credit['Apto Segunda Vivienda'] === 'TRUE' ? 'Si' : 'No'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='body1'>
                    <strong>Requiere sueldo en banco</strong>: {credit['Sueldo En Banco'] === 'TRUE' ? 'Si' : 'No'}
                  </Typography>
                </Grid>

                {credit['Provincias'].length > 0 && (
                  <Grid item xs={6}>
                    <Typography variant='body1'>
                      <strong>Provincias</strong>: {credit.Provincias}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography variant='body1'>
                    <strong>Mas información</strong>: <a href={credit.Link}>Haz click aquí</a>
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>

          <br></br>
          <Typography variant='h6'>Evolucion de Pago</Typography>
          <LoanPaidChart loanPlotDataResults={loanPlotDataResults} />

          <br></br>
          <Typography variant='h6'> Amortización</Typography>
          <LoanChart loanPlotDataResults={loanPlotDataResults} />

          {credit['% Pre-Cancelacion'] && (
            <>
              <br></br>
              <Typography variant='h6'> Costo de Pre-Cancelación</Typography>
              <PrecancelLoanChart
              totalLoan={loan ?? 100000000}
                loanPlotDataResults={loanPlotDataResults}
                prepaymentPenaltyRate={credit['% Pre-Cancelacion']}
                ivaRate={0.21}
              />
            </>
          )}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default DetailPage
