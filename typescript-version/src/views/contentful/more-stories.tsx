import Link from 'next/link'
import Avatar from './avatar'
import DateComponent from './date'
import CoverImage from './cover-image'
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { PostType } from '@/lib/constants'

export function PostPreview({
  title,
  coverImage,
  date,
  description: description,
  slug,
  isHero = false
}: PostType & { isHero: boolean }) {
  return (
    <Link href={`/posts/${slug}`} passHref={true}>
      <Card style={{ cursor: 'pointer' }}>
        <CardMedia sx={{ height: isHero ? '20em' : '8.5625rem' }} image={coverImage.url} component='img' alt={title} />
        <CardContent style={{ height: '10em' }}>
          <Typography variant='h6' sx={{ marginBottom: 2 }}>
            {title}
          </Typography>
          <Typography variant='caption' sx={{ marginBottom: 2 }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function MoreStories({ morePosts, title }: { morePosts: PostType[]; title?: string }) {
  return (
    <section>
      <h2 className='mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight'>{title ?? 'Más posts'}</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32'>
        <Grid container spacing={8}>
          {morePosts.map(post => (
            <Grid key={post.slug} item xs={12} md={6}>
              <PostPreview isHero={false} {...post} />
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  )
}
