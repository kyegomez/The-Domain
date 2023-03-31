import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
    createServerSupabaseClient,
    User
} from '@supabase/auth-helpers-nextjs';
  


// import LoadingDots from '@/components/ui/LoadingDots';
import LoadingDots from '@/components/signUI/LoadingDots';
// import Button from '@/components/ui/Button';
import Button from '@/components/signUI/Button';

// import { useUser } from '@/utils/useUser';
import { useUser } from 'utils/useUser';

// import { postData } from '@/utils/helpers';




interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}


// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//     const supabase = createServerSupabaseClient(ctx);
//     const {
//       data: { session }
//     } = await supabase.auth.getSession();
  
//     if (!session)
//       return {
//         redirect: {
//           destination: '/signin',
//           permanent: false
//         }
//       };
  
//     return {
//       props: {
//         initialSession: session,
//         user: session.user
//       }
//     };
// };

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-sky-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}


export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();

  // const redirectToCustomerPortal = async () => {
  //   setLoading(true);
  //   try {
  //     const { url, error } = await postData({
  //       url: '/api/create-portal-link'
  //     });
  //     window.location.assign(url);
  //   } catch (error) {
  //     if (error) return alert((error as Error).message);
  //   }
  //   setLoading(false);
  // };


  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-100 mb-32 h-full ">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-sky-400 sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="mt-5 text-xl text-sky-400 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Welcome to your hub
          </p>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : ''
          }
        >
          {/* <div className="text-xl mt-8 mb-4 font-semibold">
            {isLoading ? (
              <div className="h-12 mb-6">
                <LoadingDots />
              </div>
            ) : subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/">Choose your plan</Link>
            )}
          </div> */}
        </Card>
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {userDetails ? (
              `${
                userDetails.full_name ??
                `${userDetails.first_name} ${userDetails.last_name}`
              }`
            ) : (
              <div className="h-8 mb-6">
                <LoadingDots />
              </div>
            )}
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="text-xl mt-8 mb-4 font-semibold">
            {user ? user.email : undefined}
          </p>
        </Card>
      </div>
    </section>
  );
}
