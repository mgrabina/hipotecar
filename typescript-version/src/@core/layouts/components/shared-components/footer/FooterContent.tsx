// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { Button, useMediaQuery, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: isSmallScreen ? '0' : '7em',
        marginLeft: isSmallScreen ? '0' : '7em',
        width: isSmallScreen ? '100%' : 'auto'
      }}
    >
      <Typography sx={{ display: { xs: 'inline', md: 'block' } }} color='text.secondary'>
        {` Sitio con fines informativos. Debates, Comentarios y Sugerencias en `}
        <Link
          href='https://t.me/micreditohipotecario'
          style={{
            textDecoration: 'underline',
            color: 'blue'
          }}
          target='_blank'
          rel='noreferrer'
          color='inherit'
        >
          Telegram
        </Link>
      </Typography>
      <Link href='/all'>Ver Todos</Link>
    </Box>
  )
}

export default FooterContent
