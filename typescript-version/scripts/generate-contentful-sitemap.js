/* eslint-disable @typescript-eslint/no-var-requires */
const { createClient } = require('contentful')
const fs = require('fs')
require('dotenv').config()
const prettier = require('prettier')

const papaparse = require('papaparse')

const { parse } = papaparse

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
})

const fetchEntries = async () => {
  const entries = await client.getEntries({
    content_type: 'blogPage'
  })

  return entries.items
}

const loadDataFromCSV = async url => {
  const response = await fetch(url, { cache: 'no-store' })
  const csvData = await response.text()
  const parsedData = parse(csvData, {
    header: true,
    skipEmptyLines: true
  })

  return parsedData.data
}

const generateSiteMap = async () => {
  const staticPages = ['', 'all', 'monitor', 'blog', 'simulation']
    .map(page => {
      return `<url>
      <loc>https://micreditohipotecario.com.ar/${page}</loc>
      <changefreq>daily</changefreq>
      <priority>0.7</priority>
    </url>`
    })
    .join('')

  const posts = await fetchEntries()
  const dynamicPages = posts
    .map(post => {
      return `<url>
      <loc>https://micreditohipotecario.com.ar/posts/${post.fields.slug}</loc>
      <lastmod>${new Date(post.sys.updatedAt).toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    })
    .join('')

  const credits = await loadDataFromCSV(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYyAS7elxTeGdl4XN_neWSy75oMLTl_z6oRgBjsKUj9cctAXj8HmMLrcvTV7xi9nFLKaShH0IUYpyq/pub?gid=0&single=true&output=csv'
  )
  const creditPages = credits
    .map(credit => {
      const slug = `${credit.Nombre}-${credit.Tipo}-${credit.Banco}`
        .replace(/ /g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase()

      return `<url>
      <loc>https://micreditohipotecario.com.ar/credito/${slug}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    })
    .join('')

  const bancos = await loadDataFromCSV(
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSYyAS7elxTeGdl4XN_neWSy75oMLTl_z6oRgBjsKUj9cctAXj8HmMLrcvTV7xi9nFLKaShH0IUYpyq/pub?gid=478920528&single=true&output=csv'
  )
  const bancoPages = bancos
    .map(banco => {
      const slug = `${banco.Banco}`
        .replace(/ /g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase()

      return `<url>
        <loc>https://micreditohipotecario.com.ar/banco/${slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`
    })
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages}
      ${dynamicPages}
      ${creditPages}
      ${bancoPages}
    </urlset>`

  const formatted = await prettier.format(sitemap, { parser: 'html' })

  fs.writeFileSync('public/server-sitemap.xml', formatted)
}

generateSiteMap().catch(error => console.error('Error generating sitemap:', error))
