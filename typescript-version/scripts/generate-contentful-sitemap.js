/* eslint-disable @typescript-eslint/no-var-requires */
const { createClient } = require('contentful')
const fs = require('fs')
require('dotenv').config()
const prettier = require('prettier')

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

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages}
      ${dynamicPages}
    </urlset>`

  const formatted = await prettier.format(sitemap, { parser: 'html' })

  fs.writeFileSync('public/server-sitemap.xml', formatted)
}

generateSiteMap()
