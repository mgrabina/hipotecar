import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { useRouter } from 'next/router'
import { useData } from 'src/@core/layouts/HipotecarLayout'
import { parseMoney } from 'src/@core/utils/string'
import Error404 from '../404'
import { calcularCuotaMensual, getLoanPlotData } from 'src/@core/utils/misc'
import LoanChart from 'src/views/pages/detail/LoanChart'
import LoanPaidChart from 'src/views/pages/detail/LoanPaidChart'
import PrecancelLoanChart from 'src/views/pages/detail/PrecancelLoanChart'
import { ArrowDown } from 'mdi-material-ui'

const DetailPage = () => {
  const router = useRouter()
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

  const loanPlotDataResults = getLoanPlotData(loan, credit['Tasa'], duration)

  return (
    <Card style={{ marginTop: '4em' }}>
      <CardMedia sx={{ height: '10.5625rem', objectFit: 'scale-down', padding:"1em" }} component='img' image={credit['Logo Banco']} />
      <CardContent>
        <Typography variant='body2'>
          <Grid container spacing={2} padding={1}>
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
            {loan && context?.data.UVA ? (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Monto {isInformative ? "ejemplo": ""}</strong>: {Math.floor(loan / context?.data.UVA).toLocaleString()} UVAs (
                  {parseMoney(loan)} | {context?.data.dolar && parseMoney(loan / context?.data.dolar, 'USD')})
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={6}>
                <Typography variant='body1'>
                  <strong>Monto Maximo</strong>: {parseMoney(credit['Monto Maximo en UVAs'] * 922)} (
                  {parseMoney(credit['Monto Maximo en UVAs'], 'USD')})
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
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDown />}>
              <Typography variant='body1'>
                <strong>Evolución de Pago</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LoanPaidChart loanPlotDataResults={loanPlotDataResults} />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDown />}>
              <Typography variant='body1'>
                <strong>Amortización</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LoanChart loanPlotDataResults={loanPlotDataResults} />
            </AccordionDetails>
          </Accordion>
          {credit['% Pre-Cancelacion'] && (
            <Accordion>
              <AccordionSummary expandIcon={<ArrowDown />}>
                <Typography variant='body1'>
                  <strong>Costo de Pre-Cancelación</strong>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {credit['% Pre-Cancelacion'] == 0 ? (
                  <Typography variant='body2'>El crédito no tiene costo de pre-cancelación.</Typography>
                ) : (
                  <PrecancelLoanChart
                    totalLoan={loan}
                    loanPlotDataResults={loanPlotDataResults}
                    prepaymentPenaltyRate={credit['% Pre-Cancelacion']}
                    ivaRate={0.21}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          )}
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDown />}>
              <Typography variant='body1'>
                <strong>Preguntas Frecuentes</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                {/* Que significa la tasa + UVA */}
                <strong>¿Qué significa la tasa + UVA?</strong> La tasa de interés es fija anual y se le suma la
                variación de la UVA (unidad de valor adquisitivo) que es actualizada diariamente según la inflación
                (CER). Por ejemplo, si la tasa es 5% + UVA, significa que la tasa de interés es 5% anual fija más la
                variación de la UVA.
                <br />
                {/* Porque el credito esta en UVAs */}
                <strong>¿Por qué el crédito está en UVAs?</strong> Los créditos hipotecarios en Argentina están
                denominados en UVAs (ni pesos ni dólares) para proteger el monto del préstamo de la inflación. Las UVAs
                son una unidad de medida que se actualiza diariamente según la inflación (CER) y su valor es publicado
                diariamente por el BCRA. MiCreditoHipotecario.com.ar ayuda a simular creditos en pesos y dolares para
                facilitar la comparación, pero es importante entender que el credito sera otorgado en UVAs y devuelto en
                UVAs (al valor al momento de cada pago).
                <br />
                {/* Si quiero pre-cancelar, cuando me conviene hacerlo? */}
                <strong>¿Si quiero pre-cancelar, cuándo me conviene hacerlo?</strong> Siempre que el costo de
                pre-cancelación sea menor al ahorro en intereses que se generaría al pre-cancelar. En general, los
                créditos hipotecarios tienen un costo de pre-cancelación del 3% al 5% del monto pre-cancelado. Es
                importante tener en cuenta que el costo de pre-cancelación se calcula sobre el monto pre-cancelado, no
                sobre el monto total del crédito. Como podés ver en el grafico de amortizacion, los primeros años de un
                crédito hipotecario se pagan principalmente intereses, por lo que pre-cancelar en esos primeros años
                puede no ser conveniente. En general, pre-cancelar en los últimos años del crédito es más conveniente.
                Podés ver tambien en el grafico de pre-cancelación como varía el costo de pre-cancelación a lo largo del
                tiempo.
                <br />
                {/* Que pasa si no puedo pagar la cuota? */}
                <strong>¿Qué pasa si no puedo pagar la cuota?</strong> Si no podés pagar la cuota, es importante
                comunicarte con el banco lo antes posible. En general, los bancos ofrecen diferentes opciones para
                reestructurar la deuda o refinanciar el crédito. Es importante no dejar de pagar la cuota sin
                comunicarte con el banco, ya que esto puede generar intereses adicionales y afectar tu historial
                crediticio. Siempre existe la posiblidad de vender el inmueble para cancelar la deuda.
                <br />
                {/* Otras preguntas */}
                <strong>Otras preguntas?</strong> Te invitamos a sumarte al Telegram de MiCreditoHipotecario.com.ar
                donde miles de Argentinos estan debatiendo sobre creditos hipotecarios y respondiendo muchas de las
                preguntas mas frecuentes. <a href='https://t.me/micreditohipotecario'>Unite al grupo</a>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDown />}>
              <Typography variant='body1'>
                <strong>Análisis de Riesgos</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                <strong>Riesgo de inflación:</strong> La inflación afecta directamente el valor de las cuotas mensuales
                (medidas en UVAs). En caso de que los salarios de los deudores no se ajusten a la inflación, puede ser
                dificil afrontar el pago de las cuotas.
                <br />
                <strong>Riesgo de devaluacion del precio de m2:</strong> En caso de que el precio del metro cuadrado de
                la propiedad se devalúe, el deudor puede quedar en una situación de deuda mayor al valor de la
                propiedad, por lo que no podrá vender la propiedad en caso de necesitar cancelar la deuda, o a fin del
                credito, habra sido una mala inversión en términos monetarios.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDown />}>
              <Typography variant='body1'>
                <strong>Quiero mas información sobre este crédito</strong>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>
                Te invitamos a visitar la web del banco para obtener más información sobre este crédito.{' '}
                <a href={credit.Link}>Haz click aquí</a>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default DetailPage
