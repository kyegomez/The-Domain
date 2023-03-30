import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
    createServerSupabaseClient,
    User
} from '@supabase/auth-helpers-nextjs';
  

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    const {
      data: { session }
    } = await supabase.auth.getSession();
  
    if (!session)
      return {
        redirect: {
          destination: '/signin',
          permanent: false
        }
      };
  
    return {
      props: {
        initialSession: session,
        user: session.user
      }
    };
};



