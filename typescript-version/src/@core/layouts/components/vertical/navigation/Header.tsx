import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState, useContext } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'
import { MenuDownOutline, Share, ShareAllOutline, ShareCircle, ShareOff, ShareVariant } from 'mdi-material-ui'
import Link from 'next/link'
import { useData } from '@/@core/layouts/HipotecarLayout'
import { bankNameToSlug } from '@/@core/utils/misc'
import ShareComponent from '@/@core/components/shared/Share'
import Image from 'next/image'

const Header = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const data = useData()
  const banks = data?.data.banks || []

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [bankMenuEl, setBankMenuEl] = useState<null | HTMLElement>(null)

  const [shareMenuEl, setShareMenuEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleBankMenu = (event: React.MouseEvent<HTMLElement>) => {
    setBankMenuEl(event.currentTarget)
  }

  const handleShareMenu = (event: React.MouseEvent<HTMLElement>) => {
    setShareMenuEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setBankMenuEl(null)
  }

  const handleShareClose = () => {
    setShareMenuEl(null)
  }

  return (
    <AppBar position='static' elevation={0} variant='outlined' color='inherit'>
      <Toolbar>
        <Link href='/' passHref={true} style={{ cursor: 'pointer' }}>
          <Typography
            variant='h6'
            style={{
              cursor: 'pointer',
              flexGrow: 1,
              paddingLeft: '1em',
              paddingRight: '1em',
              textAlign: isSmallScreen ? 'center' : 'inherit'
            }}
          >
            <Image alt='Bandera Argentina' src='/images/logo.png' height='15em' width='15em' /> Mi Crédito Hipotecario{' '}
            <Image alt='Bandera Argentina' src='/images/logo.png' height='15em' width='15em' />
          </Typography>
        </Link>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Button color='inherit' href='/simulation'>
            Buscador
          </Button>
          <Button color='inherit' href='/all'>
            Todos
          </Button>
          <Button color='inherit' aria-controls='bank-menu' aria-haspopup='true' onClick={handleBankMenu}>
            Por Banco
          </Button>
          <Button color='inherit' href='/blog'>
            Blog
          </Button>
          <Button color='inherit' href='/monitor'>
            Monitor
          </Button>
          <Menu id='bank-menu' anchorEl={bankMenuEl} open={Boolean(bankMenuEl)} onClose={handleClose}>
            {banks.map((bank: string) => (
              <MenuItem key={bank} onClick={handleClose} component='a' href={`/banco/${bank.toLowerCase()}`}>
                {bank}
              </MenuItem>
            ))}
          </Menu>
          <Button color='inherit' href='https://t.me/micreditohipotecario' target='_blank'>
            Ayuda
          </Button>

          <Button color='inherit' aria-controls='share-menu' aria-haspopup='true' onClick={handleShareMenu}>
            <ShareVariant></ShareVariant>
          </Button>

          <Menu id='share-menu'
            style={{
              left: '-4.5em',
            }}
          anchorEl={shareMenuEl} open={Boolean(shareMenuEl)} onClose={handleShareClose}>
            <div
              style={{
                margin: '0.5em 1em'
              }}
            >
              <ShareComponent></ShareComponent>
            </div>
          </Menu>
        </Box>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleMenu}
          >
            <MenuDownOutline></MenuDownOutline>
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component='a' href='/simulation'>
              Buscador
            </MenuItem>
            <MenuItem onClick={handleClose} component='a' href='/all'>
              Todos
            </MenuItem>
            <MenuItem aria-controls='bank-menu-mobile' aria-haspopup='true' onClick={handleBankMenu}>
              Por Banco
            </MenuItem>
            <Menu id='bank-menu-mobile' anchorEl={bankMenuEl} open={Boolean(bankMenuEl)} onClose={handleClose}>
              {banks.map((bank: string) => (
                <MenuItem
                  key={bank}
                  onClick={handleClose}
                  component='a'
                  href={`/banco/${bankNameToSlug(bank.toLowerCase())}`}
                >
                  {bank}
                </MenuItem>
              ))}
            </Menu>
            <MenuItem onClick={handleClose} component='a' href='/blog'>
              Blog
            </MenuItem>
            <MenuItem onClick={handleClose} component='a' href='/monitor'>
              Monitor
            </MenuItem>
            <MenuItem onClick={handleClose} component='a' target='_blank' href='https://t.me/micreditohipotecario'>
              Ayuda
            </MenuItem>

            <ShareComponent></ShareComponent>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
