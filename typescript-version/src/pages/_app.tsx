// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import HypotecarLayoutWrapper from 'src/layouts/HipotecarLayoutWrapper'
import { Credit, banksCsvUrl, creditsCsvUrl, loadDataFromCSV } from 'src/configs/constants'
import { useEffect, useState } from 'react'
import { useAsync } from 'react-async'
import GoogleAnalytics from 'src/configs/GoogleAnalytics'
import Script from 'next/script'
import { getDolarMep } from '@/@core/utils/misc'
import { DataProvider } from '@/configs/DataProvider'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const router = useRouter()

  // Variables
  const getLayout =
    Component.getLayout ??
    (page =>
      router.pathname !== '/theme' ? (
        <HypotecarLayoutWrapper>{page}</HypotecarLayoutWrapper>
      ) : (
        <UserLayout>{page}</UserLayout>
      ))

  const GACODE = 'G-3ZB17SX46P'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mi Crédito Hipotecario',
    url: 'https://micreditohipotecario.com.ar'
  }

  return (
    <DataProvider>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`Mi Crédito Hipotecario`}</title>
          <meta
            name='description'
            content='Buscá, compará y simulá tu crédito hipotecario ideal en Argentina. Descubrí todos los disponibles, filtra por tus preferencias y encontrá todos los datos necesarios para tomar la desición.'
          />
          <meta
            name='keywords'
            content='Hipotecas, Créditos Hipotecarios, Argentina, Préstamos Inmobiliarios, Financiamiento de Viviendas, Crédito UVA, Banco Galicia, Banco Nación, Banco Provincia, Banco Santander, Banco BBVA, Banco Macro, Tasas de Interés Hipotecarias, Simulador de Créditos Hipotecarios, Comparador de Hipotecas, Calculadora de Créditos Hipotecarios, Mejores Hipotecas en Argentina'
          />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
          {/* Add favicon */}
          <link rel='icon' href='/images/favicon.ico' type='image/x-icon' />
          <link rel='shortcut icon' href='/images/favicon.ico' type='image/x-icon' />
          {/* Canonical */}
          <link rel='canonical' href={`https://micreditohipotecario.com.ar${router.asPath}`} />
          <meta property='og:title' content='Mi Crédito Hipotecario' />
          <meta
            property='og:description'
            content='Buscá, compará y simulá tu crédito hipotecario ideal en Argentina. Descubrí todos los disponibles, filtra por tus preferencias y encontrá todos los datos necesarios para tomar la desición.'
          />
          <meta property='og:image' content='https://micreditohipotecario.com.ar/images/generated/happy.png' />
          <meta property='og:url' content={`https://micreditohipotecario.com.ar`} />
          <meta property='og:type' content='website' />
          <meta property='og:site_name' content='Mi Crédito Hipotecario' />
          <meta property='twitter:image' content='https://micreditohipotecario.com.ar/images/generated/happy.png' />
          <meta property='twitter:card' content='summary_large_image' />
          <meta property='twitter:title' content='Mi Crédito Hipotecario' />
          <meta
            property='twitter:description'
            content='Buscá, compará y simulá tu crédito hipotecario ideal en Argentina. Descubrí todos los disponibles, filtra por tus preferencias y encontrá todos los datos necesarios para tomar la desición.'
          />
          <script async type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </Head>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GACODE}`} />
        <Script id='google-analytics'>
          {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GACODE}');
              `}
        </Script>

        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <>
                    {getLayout(<Component {...pageProps} />)}
                    <Analytics debug={false} />
                    <SpeedInsights debug={false} route={router.pathname} />
                  </>
                </ThemeComponent>
              )
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </CacheProvider>
    </DataProvider>
  )
}

export default App
