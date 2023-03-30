import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

// import LoadingDots from '@/components/signUI/LoadingDots';
import LoadingDots from '@/components/signUI/LoadingDots';



// import Logo from '@/components/icons/Logo';
import { Logo } from '@/components/signUI/Logo';


// import { getURL } from '@/utils/helpers';
import { getURL } from 'utils/helpers';
import { createClient } from '@supabase/supabase-js';

const supa_url: any = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supa_key: any = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const SignIn = () => {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = createClient(supa_url, supa_key);

  useEffect(() => {
    if (user) {
      router.replace('/account');
    }
  }, [user, router]);

  if (!user)
    return (
      <div className="flex justify-center height-screen-helper">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          <div className="flex justify-center pb-12 ">
            <Logo width="64px" height="64px" />
          </div>
          <div className="flex flex-col space-y-4">
            <Auth
              supabaseClient={supabaseClient}
              providers={['google']}
              redirectTo={getURL()}
              magicLink={true}
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
      </div>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
};

export default SignIn;
