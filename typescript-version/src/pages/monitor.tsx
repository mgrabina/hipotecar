import CreditsOverviewCard from '@/views/dashboard/CreditsOverviewCard'
import Statistics from '@/views/dashboard/Statistics'
import Head from 'next/head'

const Monitor = () => {
  return (
    <>
    <Head>
    <title>Monitor de mercado | Mi Credito Hipotecario</title>
        <meta
          name='description'
          content='Analiza el mercado de creditos hipotecarios en Argentina. Encuentra las metricas clave que necesitas para tomar la mejor decisión.'
        />
        <meta property='og:title' content='Monitor de mercado | Mi Credito Hipotecario' />
        <meta
          property='og:description'
          content='Analiza el mercado de creditos hipotecarios en Argentina. Encuentra las metricas clave que necesitas para tomar la mejor decisión.'
        />
        <meta property='og:url' content='https://www.micredito.com.ar/monitor' />
        <meta property='og:image' content='https://www.micredito.com.ar/generated/happy.png' />
        <meta property='twitter:title' content='Monitor de mercado | Mi Credito Hipotecario' />
        <meta
          property='twitter:description'
          content='Analiza el mercado de creditos hipotecarios en Argentina. Encuentra las metricas clave que necesitas para tomar la mejor decisión.'
        />
        <meta property='twitter:image' content='https://www.micredito.com.ar/generated/happy.png' />
    </Head>
      <div style={{ marginTop: '2em' }}>
        <CreditsOverviewCard></CreditsOverviewCard>
      </div>

      <Statistics></Statistics>
    </>
  )
}

export default Monitor
