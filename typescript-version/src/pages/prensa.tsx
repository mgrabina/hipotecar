// components/PressView.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Avatar, Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { Heart, ShareVariant } from 'mdi-material-ui'

type ArticleType = {
  title: string
  website: string
  description: string
  url: string
  author?: string
  logo: string
}
const articles: ArticleType[] = [
  {
    title: 'Créditos hipotecarios: esta herramienta te ayuda a elegir la mejor opción según tu sueldo',
    website: 'La Nación',
    description:
      'En menos de un mes del primer anuncio, 12 bancos ofrecen crédito hipotecario, por lo que conocer cuál es la mejor opción puede resultar engorroso',
    url: 'https://www.lanacion.com.ar/propiedades/casas-y-departamentos/creditos-hipotecarios-esta-herramienta-te-ayuda-a-elegir-el-mejor-prestamo-segun-tu-sueldo-nid22052024/',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Logo_La_Naci%C3%B3n.svg/1200px-Logo_La_Naci%C3%B3n.svg.png'
  },
  {
    url: 'https://noticias.mitelefe.com/actualidad/simulador-de-creditos-hipotecarios-como-funcionan-y-cuales-son-todas-las-opciones/',
    title: 'Simulador de créditos hipotecarios: ¿Cómo funcionan y cuáles son todas las opciones?',
    description:
      'En Argentina, adquirir una vivienda propia puede parecer un sueño lejano para muchas familias. Sin embargo, surgieron un serie de créditos bancarios que podrían acercar esa posibilidad a algunas familias. Un sitio web ofrece un simulador de créditos hipotecarios que promete simplificar el proceso de obtener financiamiento para la compra de una vivienda. A continuación, te contamos todo lo que necesitas saber sobre este innovador servicio.',
    website: 'Mi Telefe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Telefe_%28nuevo_logo%29.png'
  },
  {
    title: 'Créditos hipotecarios UVA: cómo saber cuál es la mejor opción para su bolsillo',
    website: 'El Once',
    description:
      'Hasta el momento, son doce los bancos que ofrecen los créditos hipotecarios UVA y realmente, se hace muy difícil evaluar cuál es la mejor opción. Hay una plataforma que lo puede ayudar a elegir la alternativa más adecuada a sus recursos.',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7tEcNhlRv4pMHBbO0jKDF1KtLFTo1o6sXRw&s',
    url: 'https://www.elonce.com/secciones/economicas/802194-crditos-hipotecarios-uva-cmo-saber-cul-es-la-mejor-opcin-para-su-bolsillo.htm'
  },
  {
    url: 'https://viapais.com.ar/economia/creditos-hipotecarios-la-pagina-que-te-revela-cuanto-vas-a-pagar-en-cada-banco/',
    title: 'Créditos Hipotecarios: la página que te revela cuánto vas a pagar en cada banco',
    description:
      'El simulador web es gratuito y está disponible para cualquier usuario. Dependiendo de los ingresos del usuario y el tipo de préstamo, calcula cuál es la mejor opción.',
    website: 'Vía País',
    author: 'Maia Had',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqyuyiGlKtkth_ibKMi_RchsOVqvyjfuItUg&s'
  },
  {
    url: 'https://www.losandes.com.ar/economia/creditos-hipotecarios-como-saber-cual-es-la-opcion-que-mejor-se-adapta-a-tu-bolsillo/',
    title: 'Créditos hipotecarios: cómo saber cuál es la opción que mejor se adapta a tu bolsillo',
    description:
      'Hasta hoy, son doce los bancos que ofrecen los créditos hipotecarios y realmente se hace muy difícil evaluar cuál es la mejor opción. Hay una plataforma que te puede ayudar.',
    website: 'Los Andes',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Diario_los_andes.png'
  }
]

export function Article({ title, author, description, logo, url, website }: ArticleType) {
  return (
    <Link href={url} target='_blank' rel='noopener noreferrer' passHref={true}>
      <Card sx={{ cursor: 'pointer', width: '100%', color: 'common.secondary', backgroundColor: 'secondary' }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
          <Typography
            variant='h6'
            sx={{ display: 'flex', marginBottom: 2.75, alignItems: 'center', color: 'common.secondary' }}
          >
            <img src={logo} alt={website} style={{ width: '4rem', marginRight: '1rem' }} />
            {website}
          </Typography>
          <Typography variant='body2' sx={{ marginBottom: 3, color: 'common.secondary' }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar
                alt='Avatar'
                src={`/images/avatars/${Math.floor(Math.random() * 8) + 1}.png`}
                sx={{ width: 34, height: 34, marginRight: 2.75 }}
              />
              <Typography variant='body2' sx={{ color: 'common.secondary' }}>
                {author ?? `Redacción ${new URL(url).host.replace('www.', '')}`}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  )
}

const PrensaPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2rem',
        marginTop: '2rem'
      }}
    >
      {articles.map((article, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '2rem'
          }}
        >
          <Article key={article.title} {...article} />
        </div>
      ))}
    </div>
  )
}

export default PrensaPage
