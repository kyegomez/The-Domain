import Modal from "@/components/shared/modal";
import { signIn } from "next-auth/react";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
// import { LoadingDots, Google } from "@/components/shared/icons";
import LoadingDots from "../signUI/LoadingDots";
import Image from "next/image";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { createClient } from "@supabase/supabase-js";
import {Logo} from '@/components/signUI/Logo'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from "types/types_db";
import { getURL } from "utils/helpers";




const SignInModal = ({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const user = useUser();
  // const supabaseClient = createClient(supa_url, supa_key);
  // const supabaseClient = useSupabaseClient()
  // const [supabaseClient] = useState(() =>
  // createBrowserSupabaseClient<Database>()
  // );

  const supabaseClient = useSupabaseClient();


  useEffect(() => {
    if (user) {
      router.replace('/account');
    }
  }, [user, router]);

  if (!user)
    return (
      <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
        <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
            <a href="https://landing.apac.ai">
              <Logo />
            </a>
            <h3 className="font-display text-2xl font-bold">Sign In</h3>
            <p className="text-sm text-gray-500">
              Log in to your digital spirit.
            </p>
          </div>

          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
            <Auth
              supabaseClient={supabaseClient}
              providers={['google']}
              magicLink={true}
              redirectTo={getURL()}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#404040',
                      brandAccent: '#52525b'
                    }
                  }
                }
              }}
              theme="dark"
            />
          </div>
        </div>
      </Modal>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
};

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
    [setShowSignInModal, SignInModalCallback],
  );
}