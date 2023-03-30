/* eslint-disable react/jsx-no-undef */

import { IconChevronLeft, IconExternalLink } from '@supabase/ui'
import { marked } from 'marked'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import SectionContainer from '@/components/SectionContainer'
import supabase from '@/lib/supabase'
import { PropsWithChildren } from 'react'
import * as Slider from '@radix-ui/react-slider';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Swiper, SwiperSlide} from "swiper/react";
import * as Toast from '@radix-ui/react-toast';
import { Transition } from '@headlessui/react';
import React from 'react'
// import { useSignInModal } from '@/components/layout/sign-in-modal'

import Error404 from '../404';

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

export interface Partner {
  id: number
  slug: string
  type: 'technology' | 'expert'
  category: string
  developer: string
  title: string
  description: string
  logo: string
  images: string[]
  overview: string
  website: string
  docs: string
  approved: boolean
}

export interface PartnerContact {
  type: 'technology' | 'expert'
  company: string
  country: string
  details?: string
  email: string
  first: string
  last: string
  phone?: string
  size?: number
  title?: string
  website: string
}



function Partner({ partner }: { partner: Partner }) {
  const [activeImage, setActiveImage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef(0);
  // const { SignInModal, setShowSignInModal } = useSignInModal();





  const handleSliderChange = (event: React.FormEvent<HTMLDivElement>) => {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    setActiveImage(value);
  };


  if (!partner) return <Error404 />

  return <>
    <Head>
      <title>{partner.title} | Athena Integration</title>
      <meta name="description" content={partner.description}></meta>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Layout>
      {/* <SignInModal /> */}
      <SectionContainer>
        <div className="col-span-12 mx-auto mb-2 max-w-5xl space-y-12 lg:col-span-2 ">
          {/* Back button */}
          <Link
            href={`/partners/${partner.type === 'technology' ? 'integrations' : 'experts'
              }`}
            className="flex cursor-pointer items-center text-scale-1200 transition-colors hover:text-scale-1000">

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

          {/* ============================================== Add integration button  */}
          <div className="flex items-center space-x-4">
            <Dialog.Root open={open} onOpenChange={setOpen}>

              <Dialog.Trigger asChild>
                <button className="text-violet11 border-solid border-2 border-sky-500 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none focus:outline-none">
                  Add Integration
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                  <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                    Edit profile
                  </Dialog.Title>
                  <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                    Make changes to your profile here. Click save when you are done.
                  </Dialog.Description>
                  <fieldset className="mb-[15px] flex items-center gap-5">
                    <label className="text-violet11 w-[90px] text-right text-[15px]" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      id="name"
                      defaultValue="Pedro Duarte"
                    />
                  </fieldset>
                  <fieldset className="mb-[15px] flex items-center gap-5">
                    <label className="text-violet11 w-[90px] text-right text-[15px]" htmlFor="username">
                      Username
                    </label>
                    <input
                      className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                      id="username"
                      defaultValue="@peduarte"
                    />
                  </fieldset>
                  <div className="mt-[25px] flex justify-end">
                    <Dialog.Close asChild>
                      <button className="bg-green4 border-solid border-2 border-sky-500 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                      onClick={() => {
                        setOpen(false);
                        setOpen(true);
                        setOpen(false)
                        
                      }}
                      
                      >
                        Save changes

                      </button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                      aria-label="Close"
                    >
                      <Cross2Icon />
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>




          {/* ===============================================> Notification when integration added or now */}

          <Toast.Provider swipeDirection="right">
            <Toast.Root
              className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
              open={open}
              onOpenChange={setOpen}
            >
              <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                Integration: Status
              </Toast.Title>
              <Toast.Description asChild>
                Integrated 
              </Toast.Description>
              <Toast.Action className="[grid-area:_action]" asChild altText="Goto schedule to undo">
                <button className="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] bg-green2 text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8">
                  Undo
                </button>
              </Toast.Action>
            </Toast.Root>
            <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
          </Toast.Provider>








          <div
            className="bg-scale-300 py-6" style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', }}
          >







            {partner.images && partner.images.map((image: any, i: number) => {
              return (
                <Transition
                  key={i}
                  show={activeImage === i}
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className="relative ml-3 mr-3 block cursor-move overflow-hidden rounded-md"
                    style={{ display: activeImage === i ? 'block' : 'none' }}
                  >
                    <Image
                      src={image}
                      alt={`Partner Image ${i + 1}`}
                      width={800}
                      height={450}
                      layout="responsive"
                    />
                  </div>
                </Transition>
              );
            })}
            <Slider.Root
              value={[activeImage]}
              onChange={handleSliderChange}
              max={partner.images ? partner.images.length - 1 : 0}
            >
              <div>
                <Slider.Track className="w-full h-2 bg-gray-400 rounded">
                  <Slider.Range className="h-2 bg-blue-500 rounded" />
                </Slider.Track>
                <Slider.Thumb className="w-6 h-6 bg-blue-500 rounded-full cursor-pointer" />
              </div>
            </Slider.Root>
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
                    href={`/partners/${partner.type === 'technology'
                      ? 'integrations'
                      : 'experts'
                      }#${partner.category.toLowerCase()}`}
                    className="text-brand-900 transition-colors hover:text-brand-800">

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
    //@ts-ignore
    .from<Partner>('partners')
    .select('slug');

  const paths: {
    params: { slug: string[] }; // Update slug to be an array
    locale?: string | undefined;
  }[] =
    slugs?.map(({ slug }) => ({
      params: {
        slug: [slug], // Wrap slug in an array
      },
    })) ?? [];

  return {
    paths,
    fallback: 'blocking',
  };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  let { data: partner } = await supabase
    //@ts-ignore
    .from<Partner>('partners')
    .select('*')
    .eq('slug', params!.slug as string)
    .single();

  if (!partner) {
    return {
      notFound: true,
    };
  }

  // Ensure images is always an array
  partner.images = partner.images || [];

  // Parse markdown
  partner.overview = marked.parse(partner.overview);

  return {
    props: { partner },
    revalidate: 18000, // In seconds - refresh every 5 hours
  };
};

export default Partner
