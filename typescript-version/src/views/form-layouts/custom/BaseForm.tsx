// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
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
import { useRouter } from 'next/router'
import { useData } from '@/configs/DataProvider'

interface State {
  name: string
}

const BaseForm = () => {
  const router = useRouter()
  const context = useData()

  // ** States
  const [values, setValues] = useState<State>({
    name: ''
  })

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
    context?.setData({ ...context?.data, user: { ...context?.data.user, name: event.target.value } })
  }

  const handleClick = () => {
    context?.setData({ ...context?.data, user: { ...context?.data.user, name: values.name } })
    router.push('/buscador/riesgos')
  }

  useEffect(() => {
    if (values.name) return
    if (!context?.data.user.name) return
    setValues({ name: context?.data.user.name })
  }, [context?.data.user.name])

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

  return (
    <Card>
      <CardHeader
        title='Bienvenido!'
        subheader='En menos de 3 minutos tendras tus resultados.'
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Nombre'
                value={context?.data.user.name}
                placeholder='Leo Messi'
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                style={{ width: '100%', height: '100%' }}
                type='email'
                label='Email (opcional)'
                placeholder='leomessi@gmail.com'
                value={email}
                onChange={handleEmailChange}
              />
            </Grid>

            <Typography variant='caption' style={{ marginLeft: '2em', marginTop: '1em' }}>
              No sabes lo que es un credito hipotecario?{' '}
              <Link href='https://es.wikipedia.org/wiki/Cr%C3%A9dito_hipotecario' target='_blank'>
                Haz click aqui.
              </Link>
            </Typography>
            <Grid container spacing={5}></Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained' size='large' onClick={handleClick}>
                Confirmar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default BaseForm
