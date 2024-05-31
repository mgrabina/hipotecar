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
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`Mi Crédito Hipotecario - Tu aliado para surfear la ola de creditos`}</title>
        <meta
          name='description'
          content='Compara y simula créditos hipotecarios en Argentina con Mi Crédito Hipotecario. Encuentra las mejores tasas, cuotas y requisitos de los principales bancos.'
        />
        <meta
          name='keywords'
          content='Hipotecas, Créditos Hipotecarios, Argentina, Préstamos Inmobiliarios, Financiamiento de Viviendas, Crédito UVA, Banco Galicia, Banco Nación, Banco Provincia, Banco Santander, Banco BBVA, Banco Macro, Crédito Hipotecario Banco Galicia, Crédito Hipotecario Banco Nación, Crédito Hipotecario Banco Provincia, Crédito Hipotecario Banco Santander, Crédito Hipotecario Banco BBVA, Crédito Hipotecario Banco Macro, Tasas de Interés Hipotecarias, Simulador de Créditos Hipotecarios, Comparador de Hipotecas, Préstamos Hipotecarios UVA, Requisitos para Créditos Hipotecarios, Cuotas Hipotecarias, Calculadora de Créditos Hipotecarios, Financiación de Viviendas, Préstamos Hipotecarios en Pesos, Préstamos Hipotecarios en UVAs, Préstamos Hipotecarios en Dólares, Ingresos Mínimos para Créditos Hipotecarios, Monotributistas, Segunda Vivienda, Sueldo en Banco, Relación Cuota Ingreso, Monto Máximo de Financiación, Tasa de Interés Especial, Prima de Seguro, Precancelación, Evolución de Pago, Amortización de Préstamos, Análisis de Riesgos, Documentos para Créditos Hipotecarios, Información sobre Créditos Hipotecarios, Grupo de Telegram Créditos Hipotecarios, Comparación de Créditos Hipotecarios, Mejores Hipotecas en Argentina'
        />{' '}
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        {/* Add favicon */}
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
        {/* Canonical */}
        <link rel='canonical' href={`https://micreditohipotecario.com.ar${router.asPath}`} />
        <meta property='og:title' content='Mi Crédito Hipotecario' />
        <meta
          property='og:description'
          content='Buscá, Compará y simulá todos los créditos hipotecarios UVA disponibles en Argentina. Encuentra las mejores tasas, cuotas y requisitos de los principales bancos.'
        />
        <meta property='og:image' content='/images/generated/happy.png' />
        <meta property='og:url' content={`https://micreditohipotecario.com.ar`} />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Mi Crédito Hipotecario' />
        <meta property='twitter:image' content='/images/generated/happy.png' />
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:title' content='Mi Crédito Hipotecario' />
        <meta
          property='twitter:description'
          content='Compara y simula créditos hipotecarios en Argentina con Mi Crédito Hipotecario. Encuentra las mejores tasas, cuotas y requisitos de los principales bancos.'
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
                  <Analytics />
                  <SpeedInsights route={router.pathname} />
                </>
              </ThemeComponent>
            )
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  )
}

export default App
