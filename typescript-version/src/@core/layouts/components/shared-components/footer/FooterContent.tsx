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
        <div
          style={{
            display: 'flex',
            flexDirection: isSmallScreen ? 'column' : 'row',
            alignItems: isSmallScreen ? 'center' : 'flex-start',
            justifyContent: isSmallScreen ? 'center' : 'flex-start',
            textAlign: isSmallScreen ? 'center' : 'left'
          }}
        >
          <Link
            href='https://www.argentina.gob.ar/normativa/nacional/resoluci%C3%B3n-1002-2024-399372/texto'
            target='_blank'
            passHref
          >
            <Typography
              style={{
                cursor: 'pointer',
                color: theme.palette.primary.dark,
                textDecoration: 'none',
                transition: 'color 0.3s ease-in-out',
                marginBottom: isSmallScreen ? '0.5em' : 0,
                marginRight: isSmallScreen ? 0 : '0.2em'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = theme.palette.primary.main)}
              onMouseLeave={e => (e.currentTarget.style.color = theme.palette.primary.dark)}
            >
              Sitio con fines informativos.
            </Typography>
          </Link>
          <Typography
            style={{
              marginBottom: isSmallScreen ? '0.5em' : 0,
              marginRight: isSmallScreen ? 0 : '0.2em'
            }}
            color='text.secondary'
          >
            Datos desactualizados? Avisanos
          </Typography>
          <Link href='https://t.me/micreditohipotecario/34' passHref target='_blank'>
            <Typography
              style={{
                cursor: 'pointer',
                color: theme.palette.primary.main,
                textDecoration: 'none',
                transition: 'color 0.3s ease-in-out'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = theme.palette.primary.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = theme.palette.primary.main)}
            >
              acá
            </Typography>
          </Link>
        </div>
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
          passHref
        >
          <Typography
            style={{
              cursor: 'pointer',
              color: theme.palette.primary.main,
              textDecoration: 'none',
              transition: 'color 0.3s ease-in-out'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = theme.palette.primary.dark)}
            onMouseLeave={e => (e.currentTarget.style.color = theme.palette.primary.main)}
          >
            Mi Crédito Hipotecario en Medios
          </Typography>
        </Link>

        <div
          style={{
            display: 'flex',
            justifyContent: isSmallScreen ? 'center' : 'right'
          }}
        >
          <Typography
            style={{
              marginRight: '0.1em'
            }}
          >
            Para 🇦🇷 por{' '}
          </Typography>
          <Link target='_blank' href='https://x.com/mgrabina' passHref>
            <Typography
              style={{
                cursor: 'pointer',
                marginLeft: '0.2em',
                color: theme.palette.primary.main,
                textDecoration: 'none',
                transition: 'color 0.3s ease-in-out'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = theme.palette.primary.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = theme.palette.primary.main)}
            >
              Martin
            </Typography>
          </Link>
        </div>
      </div>
    </Box>
  )
}

export default FooterContent
