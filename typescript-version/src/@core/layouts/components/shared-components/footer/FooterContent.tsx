// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { Button, useMediaQuery, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid'
import Image from 'next/image'

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
        Mas herramientas en{' '}
        <Link target='_blank' href='https://www.finanzasarg.com/?utm_source=micreditohipotecario'>
          FinanzasArg
        </Link>
      </Typography>
    </Box>
  )
}

export default FooterContent
