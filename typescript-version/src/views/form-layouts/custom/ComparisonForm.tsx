// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useRouter } from 'next/router'
import {
  ArrowDown,
  ArrowDownBoldOutline,
  ExpandAll,
  ExpandAllOutline,
  TimerOutline,
  WalletOutline
} from 'mdi-material-ui'
import { Credit } from 'src/configs/constants'
import { UserData, useData } from 'src/@core/layouts/HipotecarLayout'
import { parseMoney } from 'src/@core/utils/string'
import {
  CreditEvaluationResult,
  calcularAdelanto,
  calcularCuotaMensual,
  getBiggestLoanBasedOnSalary,
  getCompatibleCredits
} from 'src/@core/utils/misc'
import { useAsync } from 'react-async'
import { SubmitUserBody } from 'src/pages/api/users'
import { set } from 'nprogress'

const sortTypes = [
  'Monto Total mas alto',
  'Cuota Mensual mas baja',
  'Cuota Mensual mas alta',
  'Adelanto mas bajo',
  'Adelanto mas alto'
] as const
type SortType = typeof sortTypes[number]

type ComparisonTableState = {
  loanAmount: number
  duration: number
  sortType: SortType
}

const ComparisonForm = () => {
  const router = useRouter()
  const context = useData()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [saving, setSaving] = useState<boolean>(false)
  const [saved, setSaved] = useState<boolean>(false)

  const handleClick = () => {
    setSaving(true)

    // Set Email
    context?.setData({ ...context.data, user: { ...context.data.user, email } })

    if (!context?.data.user) {
      return
    }

    const body: SubmitUserBody = {
      data: context?.data.user,
      compatibleCredits: compatibleCreditsResults.creditosCompatibles.map(c => c.credit)
    }

    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(resp => {
        if (resp.ok) {
          console.info('Saved successfully.')
        } else {
          console.error('Error:', resp.statusText)
        }
        setSaving(false)
        setSaved(true)
      })
      .catch(e => {
        console.error('Error:', e)
        setSaving(false)
        setSaved(false)
      })
  }

  const [compatibleCreditsResults, setCompatibleCreditsResult] = useState<CreditEvaluationResult>({
    creditosCompatibles: [],
    razonesDeLosRestantes: []
  })

  const handleChange = (prop: keyof UserData) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
    context?.setData({ ...context.data, user: { ...context.data.user, [prop]: event.target.value } })
  }

  const handleSelectChange = (
    event: SelectChangeEvent<string> | SelectChangeEvent<string[]>,
    prop: keyof ComparisonTableState
  ) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const [values, setValues] = useState<ComparisonTableState>({
    loanAmount: 0,
    sortType: 'Cuota Mensual mas baja',
    duration: 20
  })

  useEffect(() => {
    const updatedValues: ComparisonTableState = { ...values }

    Object.keys(values).forEach(key => {
      const val = values[key as keyof ComparisonTableState]
      const newVal = context?.data.user[key as keyof UserData]

      // If it is already set, avoid
      if ((Array.isArray(val) && val.length) || (!Array.isArray(val) && val)) return

      // If no new value, avoid
      if (!context || (Array.isArray(newVal) && !newVal.length) || (!Array.isArray(newVal) && !newVal)) return

      updatedValues[key as keyof ComparisonTableState] = newVal as never
    })

    setValues(updatedValues)
  }, [context?.data.user])

  const defaultEmail = ''
  const [email, setEmail] = useState<string>(defaultEmail)
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
    context?.setData({ ...context.data, user: { ...context.data.user, email: event.target.value } })
  }
  useEffect(() => {
    if (email != defaultEmail) return
    if (!context?.data.user.email) return
    setEmail(context?.data.user.email)
  }, [context?.data.user.email])

  useEffect(() => {
    if (!context?.data.user || !context?.data.credits) return

    const compatibleCredits =
      context?.data.user.loanType === 'personalizado'
        ? getCompatibleCredits(context?.data.credits, context?.data.user)
        : getBiggestLoanBasedOnSalary(context?.data.credits, context?.data.user)

    setCompatibleCreditsResult(compatibleCredits)

    if (context?.data.user.loanType === 'maximo') {
      setValues({ ...values, sortType: 'Monto Total mas alto' })
    } else {
      setValues({ ...values, sortType: 'Cuota Mensual mas baja' })
    }
  }, [context?.data.user.loanType, context?.data.credits])

  const sortCredits = (credits: CreditEvaluationResult['creditosCompatibles'], sortType: SortType) => {
    credits.sort((a, b) => {
      if (sortType === 'Monto Total mas alto') {
        return b.loan - a.loan
      }

      if (sortType === 'Cuota Mensual mas baja') {
        return (
          calcularCuotaMensual(a.loan, a.credit.Tasa, context?.data.user.duration ?? 20) -
          calcularCuotaMensual(b.loan, b.credit.Tasa, context?.data.user.duration ?? 20)
        )
      }

      if (sortType === 'Cuota Mensual mas alta') {
        return (
          calcularCuotaMensual(b.loan, b.credit.Tasa, context?.data.user.duration ?? 20) -
          calcularCuotaMensual(a.loan, a.credit.Tasa, context?.data.user.duration ?? 20)
        )
      }

      if (sortType === 'Adelanto mas bajo') {
        return (
          calcularAdelanto(a.loan, a.credit['% Maximo de Financiacion']) -
          calcularAdelanto(b.loan, b.credit['% Maximo de Financiacion'])
        )
      }

      if (sortType === 'Adelanto mas alto') {
        return (
          calcularAdelanto(b.loan, b.credit['% Maximo de Financiacion']) -
          calcularAdelanto(a.loan, a.credit['% Maximo de Financiacion'])
        )
      }

      return 0
    })
  }

  useEffect(() => {
    if (!context?.data.user) return
    if (!compatibleCreditsResults.creditosCompatibles.length) return

    // Clone the array to avoid mutating the original state
    const sortedCredits = [...compatibleCreditsResults.creditosCompatibles]

    sortCredits(sortedCredits, values.sortType)

    // Update the state with the sorted array
    setCompatibleCreditsResult({
      ...compatibleCreditsResults,
      creditosCompatibles: sortedCredits
    })
  }, [values.sortType])

  return (
    <Card>
      <CardHeader
        title='Tus resultados'
        titleTypographyProps={{ variant: 'h6' }}
        subheader='En base a tus preferencias y la oferta disponible.'
      />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <ToggleButtonGroup
                    value={context?.data.user.loanType}
                    exclusive
                    fullWidth
                    style={{ height: '100%' }}
                    defaultValue={'personalizado'}
                    onChange={(event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
                      if (newAlignment === null) return
                      context?.setData({
                        ...context.data,
                        user: { ...context.data.user, loanType: newAlignment as 'personalizado' | 'maximo' }
                      })
                    }}
                    aria-label='text alignment'
                  >
                    <ToggleButton style={{ height: '100%' }} value='personalizado' aria-label='left aligned'>
                      Monto Personalizado
                    </ToggleButton>
                    <ToggleButton value='maximo' aria-label='right aligned'>
                      Monto Máximo
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Años'
                    value={values.duration}
                    onChange={handleChange('duration')}
                    placeholder='30'
                    InputProps={{
                      inputProps: { min: 1, max: 50 },
                      startAdornment: (
                        <InputAdornment position='start'>
                          <TimerOutline />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {context?.data.user.loanType === 'personalizado' && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type='number'
                      value={Number(context?.data.user.loanAmount).toFixed(0)}
                      label={`Monto del préstamo`}
                      onChange={handleChange('loanAmount')}
                      placeholder='100.000.000'
                      InputProps={{
                        inputProps: { min: 1, max: 999999999999 },
                        startAdornment: <InputAdornment position='start'>ARS</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type='number'
                      value={
                        context?.data.user.loanAmount
                          ? (context.data.user.loanAmount / (context?.data.dolar ?? 1)).toFixed(0)
                          : 0
                      }
                      label={`Monto del préstamo`}
                      onChange={e => {
                        const value = e.target.value
                        if (context?.data.dolar) {
                          setValues({ ...values, loanAmount: Number(value) * context.data.dolar })
                          context?.setData({
                            ...context.data,
                            user: { ...context.data.user, loanAmount: Number(value) * context.data.dolar }
                          })
                        }
                      }}
                      placeholder='100.000'
                      InputProps={{
                        inputProps: { min: 1, max: 999999999 },
                        startAdornment: <InputAdornment position='start'>USD</InputAdornment>
                      }}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
                  <TableHead>
                    <TableRow>
                      {/* Image */}
                      <TableCell></TableCell>
                      <TableCell>Creditos Recomendados</TableCell>
                      {context?.data.user.loanType === 'maximo' && <TableCell>Monto Total</TableCell>}
                      <TableCell>Primera Cuota</TableCell>
                      <TableCell>Adelanto</TableCell>
                      <TableCell>
                        {/* Sort */}

                        <FormControl>
                          <InputLabel
                            style={{
                              fontSize: '12px'
                            }}
                            id='form-layouts-separator-select-label-sort'
                          >
                            Ordenar Por {values.sortType}
                          </InputLabel>
                          <Select
                            label='form-layouts-separator-select-label-sort'
                            value={values.sortType}
                            id='form-layouts-separator-select-label-sort'
                            onChange={e => handleSelectChange(e, 'sortType')}
                            style={{ fontSize: '12px', padding: '0em' }}
                          >
                            {sortTypes.map(creditType => (
                              <MenuItem key={creditType} style={{ fontSize: '12px' }} value={creditType}>
                                {creditType}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {compatibleCreditsResults.creditosCompatibles.map(({ credit: row, loan }, index) => (
                      <TableRow
                        hover={row.Link.length > 0}
                        key={index}
                        style={{ opacity: index === 0 ? 1 : 0.7 }}
                        sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                      >
                        <TableCell width={isSmallScreen ? 20 : 30}>
                          <img
                            src={`/images/banks/${row.Banco}.png`}
                            alt={row.Nombre}
                            className='object-contain	'
                            height={isSmallScreen ? 20 : 40}
                          />
                        </TableCell>
                        <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                              {row.Nombre}
                            </Typography>
                            <Typography variant='caption'>Banco {row.Banco}</Typography>
                            <div>
                              {index === 0 && (
                                <Typography variant='caption' margin='0.3em'>
                                  <Chip
                                    label={
                                      values.sortType === 'Monto Total mas alto'
                                        ? 'Monto mas alto'
                                        : values.sortType === 'Cuota Mensual mas baja'
                                        ? 'Cuota mas baja'
                                        : values.sortType === 'Cuota Mensual mas alta'
                                        ? 'Cuota mas alta'
                                        : values.sortType === 'Adelanto mas bajo'
                                        ? 'Adelanto mas bajo'
                                        : values.sortType === 'Adelanto mas alto'
                                        ? 'Adelanto mas alto'
                                        : ''
                                    }
                                    size='small'
                                    color='primary'
                                  />
                                </Typography>
                              )}
                              {row['Sueldo En Banco'] === 'TRUE' && (
                                <Typography variant='caption' margin='0.3em'>
                                  <Chip label='Tasa especial' size='small' color='info' />
                                </Typography>
                              )}
                              {/*  */}
                            </div>
                          </Box>
                        </TableCell>

                        {context?.data.user.loanType === 'maximo' && (
                          <TableCell>
                            <Grid container>
                              <Grid item xs={12} color='blueviolet'>
                                {loan && parseMoney(loan)}
                              </Grid>
                              <Grid item xs={12} color='green'>
                                {loan && context?.data.dolar && parseMoney(loan / context.data.dolar, 'USD')}
                              </Grid>
                            </Grid>
                          </TableCell>
                        )}
                        <TableCell>
                          <Grid container>
                            <Grid item xs={12} color='blueviolet'>
                              {loan &&
                                context?.data.user.duration &&
                                parseMoney(calcularCuotaMensual(loan, row.Tasa, context?.data.user.duration))}

                              {row['Tasa especial por tiempo definido'] &&
                                loan &&
                                context?.data.user.duration &&
                                ` (${parseMoney(
                                  calcularCuotaMensual(
                                    loan,
                                    row['Tasa especial por tiempo definido'],
                                    context?.data.user.duration
                                  )
                                )} por ${row['Duracion Tasa Especial en Meses']} meses)`}
                            </Grid>
                            <Grid item xs={12} color='green'>
                              {loan &&
                                context?.data.user.duration &&
                                context.data.dolar &&
                                parseMoney(
                                  calcularCuotaMensual(loan, row.Tasa, context?.data.user.duration) /
                                    context.data.dolar,
                                  'USD'
                                )}{' '}
                              {row['Tasa especial por tiempo definido'] &&
                                loan &&
                                context?.data.user.duration &&
                                context.data.dolar &&
                                ` (${parseMoney(
                                  calcularCuotaMensual(
                                    loan,
                                    row['Tasa especial por tiempo definido'],
                                    context?.data.user.duration
                                  ) / context.data.dolar,
                                  'USD'
                                )} por ${row['Duracion Tasa Especial en Meses']} meses)`}
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell>
                          <Grid container>
                            <Grid item xs={12} color='blueviolet'>
                              {loan && parseMoney(calcularAdelanto(loan, row['% Maximo de Financiacion']))}
                            </Grid>
                            <Grid item xs={12} color='green'>
                              {loan &&
                                context?.data.dolar &&
                                parseMoney(
                                  calcularAdelanto(loan, row['% Maximo de Financiacion']) / context?.data.dolar,
                                  'USD'
                                )}{' '}
                            </Grid>
                          </Grid>
                        </TableCell>

                        <TableCell>
                          {row.Link.length > 0 && (
                            <Link
                              href={`/credit/${row.Id}?loan=${loan}&duration=${context?.data.user.duration}`}
                              target='_blank'
                            >
                              Ver detalles
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {compatibleCreditsResults.creditosCompatibles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Typography align='center' variant='caption'>
                            No hay creditos compatibles con tus preferencias. Intenta reducir el valor del préstamo o
                            extender la duracion.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {compatibleCreditsResults.razonesDeLosRestantes.length > 0 && (
                <Accordion style={{ width: '100%' }}>
                  <AccordionSummary expandIcon={<ArrowDown />} aria-controls='panel1-content' id='panel1-header'>
                    Por que los demas creditos no aparecen?
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableRow>
                      <TableCell colSpan={4}>
                        {compatibleCreditsResults.razonesDeLosRestantes.map((r, i) => (
                          <Typography key={i} align='center' variant='caption'>
                            {r}
                            <br></br>
                          </Typography>
                        ))}
                      </TableCell>
                    </TableRow>
                  </AccordionDetails>
                </Accordion>
              )}
            </Grid>

            <Grid item xs={12}></Grid>
            <Grid container spacing={2} margin={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  style={{ width: '100%', height: '100%' }}
                  type='email'
                  label='Email'
                  placeholder='leomessi@gmail.com'
                  value={email}
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  type='submit'
                  variant='outlined'
                  onClick={handleClick}
                  disabled={saving || saved}
                  style={{
                    opacity: saving ? 0.5 : 1,
                    width: '100%',
                    height: '100%',
                    fontSize: '.7em',
                    maxHeight: '100%',
                    overflow: 'hidden'
                  }}
                >
                  {saving
                    ? 'Guardando...'
                    : saved
                    ? 'Guardado!'
                    : 'Encender alertas y recibir informacion de creditos alineados con mis intereses'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ComparisonForm
