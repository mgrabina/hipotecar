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

export async function generateStaticParams() {
  const allPosts = await getAllPosts()

  return allPosts.map(post => ({
    slug: post.slug
  }))
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

  return (
    <div style={{ marginTop: '4em' }}>
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
