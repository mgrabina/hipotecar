// ** MUI Imports
import Box from '@mui/material/Box'
import Link from 'next/link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { Button, useMediaQuery, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid'
import Image from 'next/image'
import { is } from 'date-fns/locale'

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
      <div
        style={{
          width: isSmallScreen ? '100%' : 'auto'
        }}
      >
        <Typography
          style={{
            display: 'flex',
            alignItems: isSmallScreen ? 'center' : 'left',
            textAlign: isSmallScreen ? 'center' : 'left',
            justifyContent: isSmallScreen ? 'center' : 'left'
          }}
          color='text.secondary'
        >
          Sitio con fines informativos, no representa recomendación alguna.
        </Typography>
        <div
          style={{
            display: isSmallScreen ? 'block' : 'flex',
            alignItems: isSmallScreen ? 'center' : 'left',
            justifyContent: isSmallScreen ? 'center' : 'left'
          }}
        >
          <Typography
            style={{
              display: 'flex',
              alignItems: isSmallScreen ? 'center' : 'left',
              justifyContent: isSmallScreen ? 'center' : 'left'
            }}
            color='text.secondary'
          >
            Mas herramientas similares en:{' '}
          </Typography>
          <div
            style={{
              cursor: 'pointer',
              width: isSmallScreen ? '100%' : '120px',
              height: isSmallScreen ? '30px' : '30px',
              position: 'relative',
              marginLeft: '0.5em',
              display: isSmallScreen ? 'flex' : 'inherit',
              justifyContent: isSmallScreen ? 'center' : 'inherit',
              alignItems: isSmallScreen ? 'center' : 'inherit'
            }}
          >
            <Link
              href='https://www.finanzasarg.com/?utm_source=micreditohipotecario'
              target='_blank'
              passHref
              rel='noopener noreferrer'
            >
              <>
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
              </>
            </Link>
          </div>
        </div>
      </div>
      <div
        style={{
          width: isSmallScreen ? '100%' : 'auto'
        }}
      >
        <Link
          style={{
            display: 'flex',
            justifyContent: isSmallScreen ? 'center' : 'right'
          }}
          href='/prensa'
        >
          Mi Crédito Hipotecario en Medios
        </Link>

        <Typography
          style={{
            display: 'flex',
            justifyContent: isSmallScreen ? 'center' : 'right'
          }}
        >
          Para 🇦🇷 por{' '}
          <Link
            style={{
              marginLeft: '0.4em'
            }}
            target='_blank'
            href='https://x.com/mgrabina'
          >
            Martin
          </Link>
        </Typography>
      </div>
    </Box>
  )
}

export default FooterContent
