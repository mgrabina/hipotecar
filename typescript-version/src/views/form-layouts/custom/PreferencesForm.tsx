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

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { Checkbox, FormControlLabel, FormGroup, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useRouter } from 'next/router'
import { MessageOutline, TimerOutline, WalletOutline } from 'mdi-material-ui'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { UserData, useData } from 'src/@core/layouts/HipotecarLayout'
import { CreditType, CreditTypes, Province, Provinces } from 'src/configs/constants'
import { parseMoney } from 'src/@core/utils/string'
import { getBiggestLoanBasedOnSalary } from 'src/@core/utils/misc'

export interface PreferencesFormState {
  loanAmount: number
  loanType: 'personalizado' | 'maximo'
  salary: number
  duration: number
  monotributista: boolean
  secondHome: boolean
  banks: string[]
  provinces: string[]
  creditType: CreditType
}

const PreferencesForm = () => {
  const router = useRouter()
  const context = useData()

  // ** States
  const [values, setValues] = useState<PreferencesFormState>({
    loanAmount: 0,
    salary: 0,
    duration: 20,
    monotributista: false,
    secondHome: false,
    loanType: 'personalizado',
    banks: [],
    creditType: 'Adquisicion',
    provinces: []
  })

  const handleSelectChange = (event: SelectChangeEvent<string> | SelectChangeEvent<string[]>, prop: keyof UserData) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleChange = (prop: keyof PreferencesFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
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
        monotributista: values.monotributista,
        secondHome: values.secondHome,
        provinces: values.provinces,
        creditType: values.creditType
      }
    })

    router.push('/simulation/comparison')
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
                    type='number'
                    value={values.salary}
                    label={`Sueldo ${
                      context?.data.dolar ? `(${parseMoney(values.salary / context?.data.dolar, 'USD')})` : ''
                    }`}
                    onChange={handleChange('salary')}
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
                        type='number'
                        value={Number(values.loanAmount).toFixed(0)}
                        label={`Monto del préstamo`}
                        onChange={handleChange('loanAmount')}
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
                        type='number'
                        value={(values.loanAmount / (context?.data.dolar ?? 1)).toFixed(0)}
                        label={<Typography>Monto del préstamo</Typography>}
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

              {/* is Monotributista */}
              <Grid container>
                <Grid item xs={12}>
                  <FormControl component='fieldset'>
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox onChange={handleCheckboxChange('monotributista')} />}
                        label='Soy monotributista'
                        labelPlacement='end'
                      />
                    </FormGroup>
                  </FormControl>
                  <FormControl component='fieldset'>
                    <FormGroup>
                      <FormControlLabel
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
              <Button type='submit' disabled={!values.salary} variant='contained' size='large' onClick={handleClick}>
                Confirmar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default PreferencesForm
