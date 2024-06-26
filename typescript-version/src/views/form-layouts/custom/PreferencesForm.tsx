// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { Checkbox, FormControlLabel, FormGroup, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useRouter } from 'next/router'
import { MessageOutline, TimerOutline, WalletOutline } from 'mdi-material-ui'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useData, UserData } from '@/configs/DataProvider'
import { CreditType, CreditTypes, Province, Provinces } from 'src/configs/constants'
import { parseMoney } from 'src/@core/utils/string'
import { getBiggestLoanBasedOnSalary } from 'src/@core/utils/misc'
import { SubmitUserBody } from 'src/pages/api/users'

const taxTypes = ['Monotributo', 'Autonomo', 'Relacion de Dependencia'] as const
type TaxType = (typeof taxTypes)[number]

export interface PreferencesFormState {
  loanAmount: number
  loanType: 'personalizado' | 'maximo'
  salary: number
  duration: number
  taxType: TaxType[]
  monotributista: boolean
  secondHome: boolean
  banks: string[]
  provinces: string[]
  creditType: CreditType
  turnOnAlerts: boolean
}

const PreferencesForm = () => {
  const router = useRouter()
  const context = useData()

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // ** States
  const [values, setValues] = useState<PreferencesFormState>({
    loanAmount: 0,
    salary: 0,
    duration: 20,
    taxType: ['Relacion de Dependencia'],
    secondHome: false,
    loanType: 'personalizado',
    monotributista: true,
    banks: [],
    creditType: 'Adquisicion',
    provinces: [],
    turnOnAlerts: false
  })

  const handleSelectChange = (event: SelectChangeEvent<string> | SelectChangeEvent<string[]>, prop: keyof UserData) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleChange = (prop: keyof PreferencesFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const sendEmail = () => {
    if (!context?.data.user) {
      return Promise.resolve()
    }

    const body: SubmitUserBody = {
      data: context?.data.user
    }

    return fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }

  const handleClick = () => {
    context?.setData({
      ...context?.data,
      user: {
        ...context?.data.user,
        loanAmount: values.loanAmount,
        loanType: values.loanType,
        salary: values.salary,
        duration: values.duration,
        banks: values.banks,
        taxType: values.taxType,
        secondHome: values.secondHome,
        provinces: values.provinces,
        creditType: values.creditType
      }
    })

    if (values.turnOnAlerts) {
      sendEmail()
        .then(resp => {
          if (resp?.ok) {
            console.info('Saved successfully.')
          } else {
            console.error('Error:', resp?.statusText)
          }
          router.push('/buscador/resultado')
        })
        .catch(e => {
          console.error('Error:', e)
        })
    } else {
      router.push('/buscador/resultado')
    }
  }

  useEffect(() => {
    const updatedValues: PreferencesFormState = { ...values }

    Object.keys(values).forEach(key => {
      const val = values[key as keyof PreferencesFormState]
      const newVal = context?.data.user[key as keyof PreferencesFormState]

      // If it is already set, avoid
      if ((Array.isArray(val) && val.length) || (!Array.isArray(val) && val)) return

      // If no new value, avoid
      if (!context || (Array.isArray(newVal) && !newVal.length) || (!Array.isArray(newVal) && !newVal)) return

      updatedValues[key as keyof PreferencesFormState] = newVal as never
    })

    setValues(updatedValues)
  }, [context?.data.user])

  const [alignment, setAlignment] = useState<string | null>('left')

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment)
  }

  const handleCheckboxChange = (prop: keyof PreferencesFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.checked })
  }

  return (
    <Card>
      <CardHeader title='Veamos, cuales son tus preferencias?' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-select-label-creditType'>
                      Tipo de credito que te gustaria obtener?
                    </InputLabel>
                    <Select
                      label='form-layouts-separator-select-label-creditType'
                      value={values.creditType ?? 'Adquisicion'}
                      id='form-layouts-separator-select-label-creditType'
                      onChange={e => handleSelectChange(e, 'creditType')}
                    >
                      {CreditTypes.map(creditType => (
                        <MenuItem key={creditType} value={creditType}>
                          {creditType}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <ToggleButtonGroup
                    value={values.loanType}
                    exclusive
                    fullWidth
                    defaultValue={'personalizado'}
                    onChange={(event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
                      if (newAlignment === null) return
                      setValues({ ...values, loanType: newAlignment as 'personalizado' | 'maximo' })
                      context?.setData({
                        ...context.data,
                        user: { ...context.data.user, loanType: newAlignment as 'personalizado' | 'maximo' }
                      })
                    }}
                    style={{ height: '100%' }}
                    aria-label='text alignment'
                  >
                    <ToggleButton value='personalizado' style={{ height: '100%' }} aria-label='left aligned'>
                      Monto Personalizado
                    </ToggleButton>
                    <ToggleButton value='maximo' aria-label='right aligned'>
                      Monto Máximo
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label-banks'>
                  Recibis tus haberes en algun banco?
                </InputLabel>
                <Select
                  label='form-layouts-separator-select-label-banks'
                  multiple
                  disabled={!context?.data.banks.length}
                  value={values.banks ?? []}
                  MenuProps={{
                    style: {
                      height: isSmallScreen ? '50%' : '400px'
                    }
                  }}
                  id='form-layouts-separator-select-label-banks'
                  onChange={e => handleSelectChange(e, 'banks')}
                >
                  {context?.data.banks?.map(bank => (
                    <MenuItem key={bank} value={bank}>
                      {bank}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label-provinces'>
                  Provincia donde te gustaria comprar?
                </InputLabel>
                <Select
                  disabled={!context?.data.provinces.length}
                  label='form-layouts-separator-select-label-provinces'
                  multiple
                  fullWidth
                  MenuProps={{
                    style: {
                      height: isSmallScreen ? '50%' : '400px'
                    }
                  }}
                  value={values.provinces ?? []}
                  id='form-layouts-separator-select-label-provinces'
                  onChange={e => handleSelectChange(e, 'provinces')}
                >
                  {context?.data.provinces?.map(province => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    type='string'
                    value={Number(values.salary).toLocaleString()}
                    label={`Suma de ingresos de deudores ${
                      context?.data.dolar ? `(${parseMoney(values.salary / context?.data.dolar, 'USD')})` : ''
                    }`}
                    onChange={e => {
                      const value = Number(e.target.value.replace(/,/g, ''))
                      if (Number.isNaN(value) || value < 0) return

                      if (context?.data.dolar) {
                        setValues({ ...values, salary: Number(value) })
                        context?.setData({
                          ...context.data,
                          user: { ...context.data.user, salary: Number(value) }
                        })
                      }
                    }}
                    placeholder='$700.000'
                    InputProps={{
                      inputProps: { min: 1, max: 999999999999 },
                      startAdornment: <InputAdornment position='start'>ARS</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
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
                {values.loanType === 'personalizado' && (
                  <>
                    <Grid style={{ display: values.loanType == 'personalizado' ? '' : 'hidden' }} item xs={12} md={3}>
                      <TextField
                        fullWidth
                        type='string'
                        value={Number(values.loanAmount).toLocaleString()}
                        label={`Monto del préstamo (${
                          context?.data.UVA
                            ? Math.floor(values.loanAmount / context.data.UVA).toLocaleString() + ' UVAs'
                            : ''
                        })`}
                        onChange={e => {
                          const value = Number(e.target.value.replace(/,/g, ''))
                          if (Number.isNaN(value) || value < 0) return

                          if (context?.data.dolar) {
                            setValues({ ...values, loanAmount: Number(value) })
                            context?.setData({
                              ...context.data,
                              user: { ...context.data.user, loanAmount: Number(value) }
                            })
                          }
                        }}
                        placeholder='$100000000'
                        InputProps={{
                          inputProps: { min: 1, max: 999999999999 },
                          startAdornment: <InputAdornment position='start'>ARS</InputAdornment>
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        type='string'
                        value={(values.loanAmount / (context?.data.dolar ?? 1)).toLocaleString()}
                        label={`Monto del préstamo (${
                          context?.data.UVA
                            ? Math.floor(values.loanAmount / context.data.UVA).toLocaleString() + ' UVAs'
                            : ''
                        })`}
                        onChange={e => {
                          const value = Number(e.target.value.replace(/,/g, ''))
                          if (Number.isNaN(value) || value < 0) return

                          if (context?.data.dolar) {
                            setValues({ ...values, loanAmount: Number(value) * context.data.dolar })
                            context?.setData({
                              ...context.data,
                              user: { ...context.data.user, loanAmount: Number(value) * context.data.dolar }
                            })
                          }
                        }}
                        placeholder='$100000000'
                        InputProps={{
                          inputProps: { min: 1, max: 999999999999 },

                          startAdornment: <InputAdornment position='start'>USD</InputAdornment>
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              {/* is Monotributista */}
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-select-label-taxType'>Estado frente a AFIP</InputLabel>
                    <Select
                      label='form-layouts-separator-select-label-taxType'
                      multiple
                      fullWidth
                      MenuProps={{
                        style: {
                          height: isSmallScreen ? '50%' : '400px'
                        }
                      }}
                      value={values.taxType ?? []}
                      id='form-layouts-separator-select-label-taxType'
                      onChange={e => handleSelectChange(e, 'taxType')}
                    >
                      {taxTypes?.map(type => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl component='fieldset' style={{ height: '100%' }}>
                    <FormGroup style={{ height: '100% ', alignItems: 'center', alignContent: 'center' }}>
                      <FormControlLabel
                        style={{ height: '100%', paddingLeft: '1em' }}
                        control={<Checkbox onChange={handleCheckboxChange('secondHome')} />}
                        label='Segunda Vivienda'
                        labelPlacement='end'
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormControl component='fieldset' style={{ height: '100%' }}>
                <FormGroup style={{ height: '100% ', alignItems: 'center', alignContent: 'center' }}>
                  <FormControlLabel
                    style={{ height: '100%', paddingLeft: '0.1em' }}
                    control={<Checkbox defaultChecked onChange={handleCheckboxChange('turnOnAlerts')} />}
                    label='Encender alertas y recibir informacion de creditos alineados con mis intereses'
                    labelPlacement='end'
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' disabled={!values.salary} variant='contained' size='large' onClick={handleClick}>
                Confirmar
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='caption' style={{}}>
                Nota: Las variables macroeconomicas para hacer los calculos son importadas automaticamente del BCRA y
                otras fuentes oficiales.{' '}
              </Typography>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default PreferencesForm
