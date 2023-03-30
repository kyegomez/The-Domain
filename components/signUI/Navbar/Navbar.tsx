import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

import {Logo} from '@/components/signUI/Logo';

import { useUser } from 'utils/useUser';

import s from './Navbar.module.css';
import { createClient } from '@supabase/supabase-js';


const supa_url: any = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supa_key: any = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;


const Navbar = () => {
  const router = useRouter();
  const supabaseClient = createClient(supa_url, supa_key);
  const { user } = useUser();

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <nav className="space-x-2 ml-6 hidden lg:block">
              <Link href="/" className={s.link}>
                Pricing
              </Link>
              <Link href="/account" className={s.link}>
                Account
              </Link>
            </nav>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {user ? (
              <span
                className={s.link}
                onClick={async () => {
                  await supabaseClient.auth.signOut();
                  router.push('/signin');
                }}
              >
                Sign out
              </span>
            ) : (
              <Link href="/signin" className={s.link}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
