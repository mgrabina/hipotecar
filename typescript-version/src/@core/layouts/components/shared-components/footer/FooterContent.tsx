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
        {` Sitio con fines informativos. No representa recomendación alguna. `}
      </Typography>
      <Typography>
        Made with ❤️ in <img src='/images/logo.png' height='15em' alt='Bandera Argentina' />
      </Typography>
    </Box>
  )
}

export default FooterContent
