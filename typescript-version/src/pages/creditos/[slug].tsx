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
  List,
  ListItem,
  ListSubheader
} from '@mui/material'
import { useRouter } from 'next/router'
import { useData } from '@/configs/DataProvider'
import { parseMoney } from 'src/@core/utils/string'
import Error404 from '../404'
import { calcularCuotaMensual, getCreditBySlug, getLoanPlotData, getTasa } from 'src/@core/utils/misc'
import LoanChart from 'src/views/pages/detail/LoanChart'
import LoanPaidChart from 'src/views/pages/detail/LoanPaidChart'
import PrecancelLoanChart from 'src/views/pages/detail/PrecancelLoanChart'
import { ArrowDown } from 'mdi-material-ui'
import Link from 'next/link'
import Head from 'next/head'
import ShareComponent from '@/@core/components/shared/Share'

const DetailPage = () => {
  const router = useRouter()
  const loan = Number(router.query.loan ?? 100000000)
  const duration = Number(router.query.duration ?? 20)
  const isInformative = !router.query.loan && !router.query.duration
  const context = useData()

  const slug = router.query.slug?.toString()
  const credit = getCreditBySlug(context?.data.credits ?? [], slug ?? '')

  if (!slug || loan === 0 || duration === 0 || !context?.data.credits.length) return null
  if (!credit) return <Error404 />

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Credito ${credit['Nombre']} del ${credit['Banco']} | Mi Credito Hipotecario`,
    image: [credit['Logo Banco']],
    author: {
      '@type': 'Organization',
      name: 'Mi Crédito Hipotecario',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.micreditohipotecario.com.ar/images/generated/happy.png'
      },
      sameAs: 'https://www.micreditohipotecario.com.ar'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mi Crédito Hipotecario',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.micreditohipotecario.com.ar/images/generated/happy.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.micreditohipotecario.com.ar${router.asPath}`
    }
  }

  const isTasaPersonalizada = !!context?.data.personalizedCredits[credit.Id]
  const tasa = getTasa(credit, context.data)

  const loanPlotDataResults = getLoanPlotData(loan, tasa, duration)

  return (
    <>
      <Head>
        <title>
          Credito {credit['Nombre']} del {credit['Banco']} | Mi Credito Hipotecario
        </title>
        <meta
          name='description'
          content={`Información sobre el credito ${credit['Nombre']} del banco ${credit['Banco']}
        con una tasa de ${tasa}% + UVA. Monto máximo de ${credit['Monto Maximo en UVAs']} UVAs. Duración máxima de ${credit['Duracion']} años.
        `}
        />
        <meta
          property='og:title'
          content={`Credito ${credit['Nombre']} del ${credit['Banco']} | Mi Credito Hipotecario`}
        />
        <meta
          property='og:description'
          content={`Información sobre el credito ${credit['Nombre']} del banco ${credit['Banco']}
        con una tasa de ${tasa}% + UVA. Monto máximo de ${credit['Monto Maximo en UVAs']} UVAs. Duración máxima de ${credit['Duracion']} años.
        `}
        />
        <meta property='og:image' content={credit['Logo Banco']} />
        <meta property='twitter:image' content={credit['Logo Banco']} />
        <meta
          property='twitter:title'
          content={`Credito ${credit['Nombre']} del ${credit['Banco']} | Mi Credito Hipotecario`}
        />
        <meta
          property='twitter:description'
          content={`Información sobre el credito ${credit['Nombre']} del banco ${credit['Banco']}
        con una tasa de ${tasa}% + UVA. Monto máximo de ${credit['Monto Maximo en UVAs']} UVAs. Duración máxima de ${credit['Duracion']} años.
        `}
        />
        <script
          async
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd)
          }}
        />
      </Head>

      {!isInformative && (
        <Link href='/buscador/resultado' passHref>
          <Typography style={{ marginTop: '2em', cursor: 'pointer', textDecoration: 'underline' }}>
            Volver a la comparación
          </Typography>
        </Link>
      )}
      <Card style={{ marginTop: '2em' }}>
        <CardMedia
          alt={credit['Banco']}
          sx={{ height: '10.5625rem', objectFit: 'scale-down', padding: '1em' }}
          component='img'
          image={credit['Logo Banco']}
        />
        <CardContent>
          <div>
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
                  <strong>Tasa</strong>: {tasa}% + UVA {isTasaPersonalizada && '(personalizada)'}
                </Typography>
              </Grid>
              {!isTasaPersonalizada && !!credit['Tasa especial por tiempo definido'] && (
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
                    <strong>Monto {isInformative ? 'ejemplo' : ''}</strong>:{' '}
                    {Math.floor(loan / context?.data.UVA).toLocaleString()} UVAs ({parseMoney(loan)} |{' '}
                    {context?.data.dolar && parseMoney(loan / context?.data.dolar, 'USD')})
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={6}>
                  <Typography variant='body1'>
                    <strong>Monto Maximo</strong>:{' '}
                    {context?.data.UVA && parseMoney(credit['Monto Maximo en UVAs'] * context?.data.UVA)} (
                    {parseMoney(credit['Monto Maximo en UVAs'], 'USD')})
                  </Typography>
                </Grid>
              )}
              {loan && duration && (
                <Grid item xs={6}>
                  <Typography variant='body1'>
                    <strong>Valor de Cuota</strong>: {parseMoney(calcularCuotaMensual(loan, tasa, duration))}
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
                      <strong>Mas información</strong>: <Link href={credit.Link}>Haz click aquí</Link>
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
                  <strong>
                    Documentación a presentar para regimen{context.data.user.taxType && context.data.user.taxType?.length > 1 ? 'es' : ''}:
                    {' '}{context.data.user.taxType}
                  </strong>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {context.data.user.taxType?.includes('Relacion de Dependencia') && (
                    <List>
                      <ListItem>
                        Últimos 3 recibos de sueldo. Si trabajaste en distintos lugares el último año, envía también el
                        úlitmo recibo de tu trabajo anterior para que podamos verificar tu antigüedad
                      </ListItem>
                    </List>
                  )}{' '}
                  {context.data.user.taxType?.includes('Monotributo') && (
                    <List>
                      <ListItem>
                        - Constancia de inscripción, de categoría B en adelante. Deberás contar con al menos 1 año de
                        antigüedad.
                      </ListItem>
                    </List>
                  )}{' '}
                  {context.data.user.taxType?.includes('Autonomo') && (
                    <List>
                      <ListItem>
                        Última Declaración Jurada de Ganancias o Certificación de ingresos. Si presentás la Declaración
                        Jurada, enviá también el ticket de presentación y una nota voluntaria con tu firma
                      </ListItem>
                    </List>
                  )}
                  <List>
                    <ListItem>
                      Si vas a combinar ingresos, tenés que envíar la misma documentación de tu o tus codeudores. En
                      este paso podés agregar codeudores que no hayas podido sumar en tu solicitud
                    </ListItem>
                  </List>
                </div>
              </AccordionDetails>
            </Accordion>
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
                  denominados en UVAs (ni pesos ni dólares) para proteger el monto del préstamo de la inflación. Las
                  UVAs son una unidad de medida que se actualiza diariamente según la inflación (CER) y su valor es
                  publicado diariamente por el BCRA. MiCreditoHipotecario.com.ar ayuda a simular creditos en pesos y
                  dolares para facilitar la comparación, pero es importante entender que el credito sera otorgado en
                  UVAs y devuelto en UVAs (al valor al momento de cada pago).
                  <br />
                  {/* Si quiero pre-cancelar, cuando me conviene hacerlo? */}
                  <strong>¿Si quiero pre-cancelar, cuándo me conviene hacerlo?</strong> Siempre que el costo de
                  pre-cancelación sea menor al ahorro en intereses que se generaría al pre-cancelar. En general, los
                  créditos hipotecarios tienen un costo de pre-cancelación del 3% al 5% del monto pre-cancelado. Es
                  importante tener en cuenta que el costo de pre-cancelación se calcula sobre el monto pre-cancelado, no
                  sobre el monto total del crédito. Como podés ver en el grafico de amortizacion, los primeros años de
                  un crédito hipotecario se pagan principalmente intereses, por lo que pre-cancelar en esos primeros
                  años puede no ser conveniente. En general, pre-cancelar en los últimos años del crédito es más
                  conveniente. Podés ver tambien en el grafico de pre-cancelación como varía el costo de pre-cancelación
                  a lo largo del tiempo.
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
                  preguntas mas frecuentes. <Link href='https://t.me/micreditohipotecario'>Unite al grupo</Link>
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ArrowDown />}>
                <Typography variant='body1'>
                  <strong>Análisis de Riesgos</strong>
                  <strong>
                    <Typography variant='body2' color='red'>
                      Muy Importante!
                    </Typography>
                  </strong>
                  {/* Chip muy importante */}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant='body2'>
                  <strong>Riesgo de inflación:</strong> La inflación afecta directamente el valor de las cuotas
                  mensuales (medidas en UVAs). En caso de que los salarios de los deudores no se ajusten a la inflación,
                  puede ser dificil afrontar el pago de las cuotas. Tener en cuenta que los creditos se sacan a largo
                  plazo y Argentina tiene historial de altos niveles de inestabilidad politica y economica que pueden
                  afectar la inflación.
                  <br />
                  <strong>Riesgo de devaluacion del precio de m2:</strong> En caso de que el precio del metro cuadrado
                  de la propiedad se devalúe, el deudor puede quedar en una situación de deuda mayor al valor de la
                  propiedad, por lo que no podrá vender la propiedad en caso de necesitar cancelar la deuda, o a fin del
                  credito, habra sido una mala inversión en términos monetarios.
                </Typography>

                <Typography
                  variant='body2'
                  color='red'
                  style={{ marginTop: '1em', border: '1px solid red', padding: '1em' }}
                >
                  Nadie puede predecir el futuro, y cada persona tiene su propia situación financiera y personal. Es muy
                  importante que antes de tomar un crédito hipotecario, te asesores con un profesional financiero y
                  legal para entender los riesgos y beneficios de este.
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
                  <Link href={credit.Link}>Haz click aquí</Link>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default DetailPage
