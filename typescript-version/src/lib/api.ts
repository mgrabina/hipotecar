const POST_GRAPHQL_FIELDS = `
  slug
  title
  description
  body {
    json
  }
  coverImage {
    url
  }
  date
`

async function fetchGraphQL(query: string, preview = false): Promise<any> {
  console.log(
    process.env.CONTENTFUL_SPACE_ID,
    process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    process.env.CONTENTFUL_ACCESS_TOKEN
  )

  return fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`
    },
    body: JSON.stringify({ query })

    // next: { tags: ['posts'] }
  }).then(response => response.json())
}

export function extractPost(fetchResponse: any): any {
  return fetchResponse?.data?.blogPageCollection?.items?.[0]
}

export function extractPostEntries(fetchResponse: any): any[] {
  return fetchResponse?.data?.blogPageCollection?.items
}

export async function getPreviewPostBySlug(slug: string | null): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      blogPageCollection(where: { slug: "${slug}" }, preview: "true", limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  )

  return extractPost(entry)
}

export async function getAllPosts(): Promise<any[]> {
  const entries = await fetchGraphQL(
    `query {
      blogPageCollection(where: { slug_exists: true }, order: date_DESC, preview: false) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    false
  )

  return extractPostEntries(entries)
}

export async function getPostAndMorePosts(slug: string): Promise<any> {
  const entry = await fetchGraphQL(
    `query {
      blogPageCollection(where: { slug: "${slug}" }, preview: false, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}

          
        }
      }
    }`,
    false
  )
  const entries = await fetchGraphQL(
    `query {
      blogPageCollection(where: { slug_not_in: "${slug}" }, order: date_DESC, preview: false
    , limit: 2) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    false
  )

  return {
    post: extractPost(entry),
    morePosts: extractPostEntries(entries)
  }
}
