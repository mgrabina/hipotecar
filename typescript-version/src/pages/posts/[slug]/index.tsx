import Link from 'next/link'

import MoreStories from '@/views/contentful/more-stories'
import Avatar from '@/views/contentful/avatar'
import Date from '@/views/contentful/date'
import CoverImage from '@/views/contentful/cover-image'

import { Markdown } from '@/lib/markdown'
import { getAllPosts, getPostAndMorePosts } from '@/lib/api'
import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { PostType } from '@/lib/constants'
import Error404 from '@/pages/404'
import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Head from 'next/head'

export async function generateStaticParams() {
  const allPosts = await getAllPosts()

  return allPosts.map(post => ({
    slug: post.slug
  }))
}

export async function generateMetadata({ params, searchParams }: any, parent: any): Promise<any> {
  const { post } = await getPostAndMorePosts(params.slug)

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      images: [post.coverImage.url]
    }
  }
}

const PostPage = () => {
  const router = useRouter()
  const params = router.query
  const slug = params?.slug?.toString()

  const [post, setPost] = useState<PostType | undefined>(undefined)
  const [morePosts, setMorePosts] = useState<PostType[]>([])
  const [node, setNode] = useState<ReactNode>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    getPostAndMorePosts(slug).then(({ post, morePosts }) => {
      setLoading(false)
      setPost(post)
      setMorePosts(morePosts)
      setNode(documentToReactComponents(post.body.json ?? {}))
    })
  }, [slug])

  if (loading) return <div>Loading...</div>

  if (!post) {
    return <Error404></Error404>
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: [post.coverImage.url],
    author: {
      '@type': 'Organization',
      name: 'Mi Crédito Hipotecario',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.micreditohipotecario.com.ar/images/generated/happy.png'
      },
      sameAs: 'https://www.micreditohipotecario.com.ar'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mi Crédito Hipotecario',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.micreditohipotecario.com.ar/images/generated/happy.png'
      }
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.micreditohipotecario.com.ar${router.asPath}`
    }
  }

  return (
    <div style={{ marginTop: '4em' }}>
      <Head>
        <title>{post.title}</title>
        <meta name='description' content={post.description} />
        <meta property='og:image' content={post.coverImage.url} />
        <meta property='og:title' content={post.title} />
        <meta property='og:description' content={post.description} />
        <meta property='twitter:image' content={post.coverImage.url} />
        <meta property='twitter:title' content={post.title} />
        <meta property='twitter:description' content={post.description} />
        <script
          async
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd)
          }}
        />
      </Head>
      <Card>
        <CardMedia sx={{ height: '14.5625rem' }} image={post.coverImage.url} />
        <CardContent>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            {post.title}
          </Typography>
          <Date dateString={post.date} /> - Por: Mi Credito Hipotecario
          {node}
        </CardContent>
      </Card>

      {morePosts.length > 0 && <MoreStories morePosts={morePosts} />}
    </div>
  )
}

export default PostPage
