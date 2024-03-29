/* eslint-disable @next/next/no-html-link-for-pages */
import { Button } from '@supabase/ui'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
// import Layout from '~/components/Layout'
import { PropsWithChildren, useEffect } from 'react'

type LayoutProps = {
  hideHeader?: boolean
  hideFooter?: boolean
}


export const Layout = ({
    children,
  }: PropsWithChildren<LayoutProps>) => {
  
  
    return (
      <>
        {/* {!hideHeader } */}
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
          <main>{children}</main>
        </div>
        {/* {!hideFooter && <Footer />} */}
      </>
    )
}

const Error404 = () => {
  const [show404, setShow404] = useState<boolean>(false)
  // const { isDarkMode } = useTheme()

  useEffect(() => {
    setTimeout(() => {
      setShow404(true)
    }, 500)
  }, [])

  return (
    <Layout hideHeader hideFooter>
      <div className="relative mx-auto flex h-screen w-full flex-col items-center justify-center">
        <div className="absolute top-0 mx-auto w-full max-w-7xl px-8 pt-6 sm:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between sm:h-10">
            <div className="flex flex-shrink-0 flex-grow items-center lg:flex-grow-0">
              <div className="flex w-full items-center justify-between md:w-auto">
                <a href="/">
                  {/* <Image
                    src={
                      // isDarkMode
                        ? '/images/supabase-logo-wordmark--dark.svg'
                        : '/images/supabase-logo-wordmark--light.svg'
                    }
                    alt="Supabase Logo"
                    height={24}
                    width={120}
                  /> */}
                </a>
              </div>
            </div>
          </nav>
        </div>
        <div className="absolute">
          <h1
            className={`select-none opacity-[5%] filter transition duration-200 ${
              show404 ? 'blur-sm' : 'blur-none'
            }`}
            style={{ fontSize: '28rem' }}
          >
            404
          </h1>
        </div>
        <div
          className={`flex flex-col items-center justify-center space-y-6 transition ${
            show404 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex w-[320px] flex-col items-center justify-center space-y-3 text-scale-1200">
            <h1 className="m-2 text-2xl">Looking for something? 🔍</h1>
            <p className="text-center text-sm">
              We couldnt find the page that you are looking for!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button as="a" size="small" className="text-white">
                Head back
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Error404