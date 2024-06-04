// ** React Imports
import { Dispatch, ReactChildren, SetStateAction, createContext, useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Fab from '@mui/material/Fab'
import { styled, useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icons Imports
import ArrowUp from 'mdi-material-ui/ArrowUp'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

// ** Type Import
import { LayoutProps } from 'src/@core/layouts/types'

// ** Components
import AppBar from './components/vertical/appBar'
import Navigation from './components/vertical/navigation'
import Footer from './components/shared-components/footer'
import ScrollToTop from 'src/@core/components/scroll-to-top'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Step, StepConnector, StepIcon, StepLabel, Stepper, Typography, useMediaQuery } from '@mui/material'
import ProgressBar from './components/vertical/navigation/ProgressBar'
import { CreditType, Province } from 'src/configs/constants'
import { Credit, banksCsvUrl, creditsCsvUrl, loadDataFromCSV, provincesCsvUrl } from 'src/configs/constants'
import { useAsync } from 'react-async'
import { set } from 'nprogress'
import { PreferencesFormState } from 'src/views/form-layouts/custom/PreferencesForm'
import { getDolarMep, getUVA } from '../utils/misc'
import VerticalNavHeader from './components/vertical/navigation/VerticalNavHeader'
import Header from './components/vertical/navigation/Header'
import ShareComponent from '../components/shared/Share'

const VerticalLayoutWrapper = styled('div')({
  height: '100%',
  display: 'flex'
})

const MainContentWrapper = styled(Box)<BoxProps>({
  flexGrow: 1,
  minWidth: 0,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column'
})

const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: theme.spacing(6),
  transition: 'padding .25s ease-in-out',
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  }
}))


const HypotecarLayout = (props: LayoutProps) => {
  // ** Props
  const { settings, children, scrollToTop } = props

  // ** Vars
  const { contentWidth } = settings
  const navWidth = themeConfig.navigationSize

  // ** States
  const [navVisible, setNavVisible] = useState<boolean>(false)

  // ** Toggle Functions
  const toggleNavVisibility = () => setNavVisible(!navVisible)

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <>
      <VerticalLayoutWrapper className='layout-wrapper'>
        {/* Navigation Menu */}

          <MainContentWrapper className='layout-content-wrapper'>
            {/* Content */}
            <ContentWrapper
              className='layout-page-content'
              sx={{
                ...(contentWidth === 'boxed' && {
                  mx: 'auto',
                  '@media (min-width:1440px)': { maxWidth: 1440, paddingLeft: '8em', paddingRight: '8em' },
                  '@media (min-width:1200px)': { maxWidth: '100%' }
                })
              }}
            >
              <Header></Header>
              <ProgressBar></ProgressBar>

              {children}
            </ContentWrapper>

            {/* Footer Component */}
            <Footer {...props} />

            {/* Portal for React Datepicker */}
            <DatePickerWrapper sx={{ zIndex: 11 }}>
              <Box id='react-datepicker-portal'></Box>
            </DatePickerWrapper>
          </MainContentWrapper>
      </VerticalLayoutWrapper>

      {/* Scroll to top button */}
      {scrollToTop ? (
        scrollToTop(props)
      ) : (
        <ScrollToTop className='mui-fixed'>
          <Fab color='primary' size='small' aria-label='scroll back to top'>
            <ArrowUp />
          </Fab>
        </ScrollToTop>
      )}
    </>
  )
}

export default HypotecarLayout
