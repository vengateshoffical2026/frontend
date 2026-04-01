import { Helmet } from 'react-helmet-async'

interface PageSEOProps {
  title: string
  description: string
  path: string
  type?: string
}

const SITE_NAME = 'Sasanam – Ancient Inscriptions Archive'
const BASE_URL = 'https://sasanam.org'

export default function PageSEO({ title, description, path, type = 'website' }: PageSEOProps) {
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`
  const url = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Sasanam" />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
