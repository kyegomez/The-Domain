import { IconChevronLeft, IconExternalLink } from '@supabase/ui'
import { marked } from 'marked'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
// import Layout from '@/components/layout'
import SectionContainer from '@/components/SectionContainer'
import supabase from '@/lib/supabase'
// import { Partner } from 'types/partners';
import { PropsWithChildren, useEffect } from 'react'
import Footer from '@/components/Footer'
import { useTheme } from '@/components/theme'


type LayoutProps = {
  hideHeader?: boolean
  hideFooter?: boolean
}


const Nav = () => {
  const { isDarkMode } = useTheme()

  return (
    <nav className="w-full border-b bg-scale-300 p-4">
      <Link href="https://landing.apac.ai" className="flex">

        <Image
          src={
            isDarkMode
              ? '/images/supabase-logo-wordmark--dark.svg'
              : '/images/supabase-logo-wordmark--light.svg'
          }
          alt="Supabase Logo"
          height={24}
          width={120}
        />

      </Link>
    </nav>
  );
}



export const Layout = ({
  hideHeader = false,
  hideFooter = false,
  children,
}: PropsWithChildren<LayoutProps>) => {
  useEffect(() => {
    const key = localStorage.getItem('supabaseDarkMode')
    if (!key) {
      // Default to dark mode if no preference config
      document.documentElement.className = 'dark'
    } else {
      document.documentElement.className = key === 'true' ? 'dark' : ''
    }
  }, [])

  return (
    <>
      {!hideHeader && <Nav />}
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      {!hideFooter && <Footer />}
    </>
  )
}


function PartnerPage({ partner }: { partner: any }) {


  return <>
    <Head>
      <title>{partner.title} | Supabase Partner Gallery Example</title>
      <meta name="description" content={partner.description}></meta>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Layout>
      <SectionContainer>
        <div className="col-span-12 mx-auto mb-2 max-w-5xl space-y-12 lg:col-span-2 bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
          {/* Back button */}
          <Link
            href={`/partners/${
              partner.type === 'technology' ? 'integrations' : 'experts'
            }`}
            className="flex cursor-pointer items-center text-scale-1200 transition-colors hover:text-scale-1000"
            legacyBehavior>

            <IconChevronLeft style={{ padding: 0 }} />Back
          </Link>

          <div className="flex items-center space-x-4">
            <Image
              layout="fixed"
              width={56}
              height={56}
              className="flex-shrink-f0 h-14 w-14 rounded-full bg-scale-400"
              src={partner.logo}
              alt={partner.title}
            />
            <h1 className="h1" style={{ marginBottom: 0 }}>
              {partner.title}
            </h1>
          </div>

          <div
            className="bg-scale-300 py-6"
            style={{
              marginLeft: 'calc(50% - 50vw)',
              marginRight: 'calc(50% - 50vw)',
            }}
          >
            <Swiper
              initialSlide={0}
              spaceBetween={0}
              slidesPerView={4}
              speed={300}
              // slidesOffsetBefore={300}
              centerInsufficientSlides={true}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                720: {
                  slidesPerView: 2,
                },
                920: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
                1208: {
                  slidesPerView: 5,
                },
              }}
            >
              {partner.images && partner.images.map((image: any, i: number) => {
                return (
                  <SwiperSlide key={i}>
                    <div className="relative ml-3 mr-3 block cursor-move overflow-hidden rounded-md">
                      <Image
                        layout="responsive"
                        objectFit="contain"
                        width={1460}
                        height={960}
                        src={image}
                        alt={partner.title}
                      />
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>

          <div className="grid gap-3 space-y-16 lg:grid-cols-4 lg:space-y-0">
            <div className="lg:col-span-3">
              <h2
                className="text-scale-1200"
                style={{ fontSize: '1.5rem', marginBottom: '1rem' }}
              >
                Overview
              </h2>

              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: partner.overview }}
              />
            </div>

            <div>
              <h2
                className="text-scale-1200"
                style={{ fontSize: '1.5rem', marginBottom: '1rem' }}
              >
                Details
              </h2>

              <div className="divide-y text-scale-1200">
                <div className="flex items-center justify-between py-2">
                  <span className="text-scale-900">Developer</span>
                  <span className="text-scale-1200">{partner.developer}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-scale-900">Category</span>
                  <Link
                    href={`/partners/${
                      partner.type === 'technology'
                        ? 'integrations'
                        : 'experts'
                    }#${partner.category.toLowerCase()}`}
                    className="text-brand-900 transition-colors hover:text-brand-800"
                    legacyBehavior>

                    {partner.category}

                  </Link>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-scale-900">Website</span>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-900 transition-colors hover:text-brand-800"
                  >
                    {new URL(partner.website).host}
                  </a>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-scale-900">Documentation</span>
                  <a
                    href={partner.docs}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-900 transition-colors hover:text-brand-800"
                  >
                    <span className="flex items-center space-x-1">
                      <span>Learn</span>
                      <IconExternalLink size="small" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </Layout>
  </>;
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const { data: slugs } = await supabase
    .from('partners')
    .select('slug')

  const paths: {
    params: { slug: string }
    locale?: string | undefined
  }[] =
    slugs?.map(({ slug }) => ({
      params: {
        slug,
      },
    })) ?? []

  return {
    paths,
    fallback: 'blocking',
  }
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  let { data: partner } = await supabase
    .from('partners')
    .select('*')
    .eq('slug', params!.slug as string)
    .single()

  if (!partner) {
    return {
      notFound: true,
    }
  }

  // Parse markdown
  partner.overview = marked.parse(partner.overview)

  return {
    props: { partner },
    revalidate: 18000, // In seconds - refresh every 5 hours
  }
}

// export default Partner

// export default function PartnerPage(props: JSX.IntrinsicAttributes & { partner: any }) {
//   return (
//     <Layout>
//       <Partner {...props} />
//     </Layout>
//   )
// }

// export default function PartnerWrapper(props: JSX.IntrinsicAttributes & { partner: any }) {
//   return (
//     <Layout>
//       <PartnerPage partner={props.partner} />
//     </Layout>
//   )
// }
export default PartnerPage;
