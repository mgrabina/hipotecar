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
        <Typography
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left'
          }}
          color='text.secondary'
        >
          Mas herramientas similares en:{' '}
          <div
            style={{
              cursor: 'pointer',
              width: '120px',
              height: '40px',
              position: 'relative',
              marginLeft: '0.5em'
            }}
          >
            <Link
              href='https://www.finanzasarg.com/?utm_source=micreditohipotecario'
              target='_blank'
              rel='noopener noreferrer'
            >
              {' '}
              <Image
                src='/images/external/finanzasarg.png'
                alt='Finanzas ARG'
                title='El sitio definitivo para tus finanzas personales en Argentina'
                layout='fill'
                objectFit='contain'
                style={{
                  opacity: 0.5,
                  transition: 'opacity 0.3s ease-in-out'
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
              />{' '}
            </Link>
          </div>
        </Typography>
      </Typography>
      <Typography>
        Para 🇦🇷 por <Link target='_blank' href='https://x.com/mgrabina'>Martin</Link>
      </Typography>
    </Box>
  )
}

export default FooterContent
