import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { List, MenuList, useMediaQuery, useTheme } from '@mui/material'
import { MenuDownOutline, MenuOpen, ViewList, ViewListOutline } from 'mdi-material-ui'
import Link from 'next/link'

const Header = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position='static' variant='outlined' color='inherit'>
      <Toolbar>
        <Link href='/' passHref={true} style={{ cursor: "pointer"}}>
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
            <img alt='Bandera Argentina' src='/images/logo.png' height='15em' /> Mi Crédito Hipotecario{' '}
            <img alt='Bandera Argentina' src='/images/logo.png' height='15em' />
          </Typography>
        </Link>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Button color='inherit' href='/simulation'>
            Buscador
          </Button>
          <Button color='inherit' href='/all'>
            Todos
          </Button>
          <Button color='inherit' href='/blog'>
            Blog
          </Button>
          <Button color='inherit' href='/monitor'>
            Monitor
          </Button>
          <Button color='inherit' href='https://t.me/micreditohipotecario' target='_blank'>
            Ayuda
          </Button>
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
            <MenuItem onClick={handleClose} component='a' href='/blog'>
              Blog
            </MenuItem>
            <MenuItem onClick={handleClose} component='a' href='/monitor'>
              Monitor
            </MenuItem>
            <MenuItem onClick={handleClose} component='a' target='_blank' href='https://t.me/micreditohipotecario'>
              Ayuda
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
