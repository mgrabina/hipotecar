import Link from 'next/link'

import Date from '@/views/contentful/date'
import CoverImage from '@/views/contentful/cover-image'
import Avatar from '@/views/contentful/avatar'
import MoreStories, { PostPreview } from '@/views/contentful/more-stories'

import { getAllPosts } from '@/lib/api'
import { CMS_NAME, CMS_URL, PostType } from '@/lib/constants'
import { useEffect, useState } from 'react'

function Intro() {
  return (
    <section className='flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12'>
      <h1 className='text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8'>Blog.</h1>
      <h2 className='text-center md:text-left text-lg mt-5 md:pl-8'>
        A statically generated blog example using{' '}
        <a href='https://nextjs.org/' className='underline hover:text-success duration-200 transition-colors'>
          Next.js
        </a>{' '}
        and{' '}
        <a href={CMS_URL} className='underline hover:text-success duration-200 transition-colors'>
          {CMS_NAME}
        </a>
        .
      </h2>
    </section>
  )
}

function HeroPost({ title, coverImage, date, description, slug }: PostType) {
  return (
    <section>
      <div className='mb-8 md:mb-16'>
        <CoverImage title={title} slug={slug} url={coverImage.url} />
      </div>
      <div className='md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28'>
        <div>
          <h3 className='mb-4 text-4xl lg:text-6xl leading-tight'>
            <Link href={`/posts/${slug}`} className='hover:underline'>
              {title}
            </Link>
          </h3>
          <div className='mb-4 md:mb-0 text-lg'>
            <Date dateString={date} />
          </div>
        </div>
        <div>
          <p className='text-lg leading-relaxed mb-4'>{description}</p>
        </div>
      </div>
    </section>
  )
}

const Blog = () => {
  const [allPosts, setAllPosts] = useState<PostType[]>([])
  const [heroPost, setHeroPost] = useState<PostType | undefined>()
  const [morePosts, setMorePosts] = useState<PostType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPosts()

      console.log(data)

      if (data === undefined) return
      setAllPosts(data)
      if (data.length === 0) return
      setHeroPost(data[0])
      setMorePosts(data.slice(1))
    }

    fetchData()
  }, [])

  return (
    <div className='container mx-auto px-5' style={{ marginTop: '2em' }}>
      {/* <Intro /> */}
      {heroPost != undefined && <PostPreview isHero={true} {...heroPost} />}
      <MoreStories morePosts={morePosts} />
    </div>
  )
}

export default Blog
