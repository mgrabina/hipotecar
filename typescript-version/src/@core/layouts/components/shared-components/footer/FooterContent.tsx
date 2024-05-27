// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import Grid from '@mui/material/Grid'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: '7em',
        marginLeft: '7em'
      }}
    >
      <Typography sx={{ display: { xs: 'none', md: 'block' } }} color='text.secondary'>
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
      <a href='/all'>Ver Todos</a>
    </Box>
  )
}

export default FooterContent
