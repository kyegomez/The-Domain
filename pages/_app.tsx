import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider as RWBProvider } from "react-wrap-balancer";
import cx from "classnames";
import localFont from "@next/font/local";
import { Inter } from "@next/font/google";
import 'swiper/swiper-bundle.min.css';

import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "types/types_db";
import { MyUserContextProvider } from "utils/useUser";

const sfPro = localFont({
  src: "../styles/SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// export default function MyApp({
//   Component,
//   pageProps: { session, ...pageProps },
// }: AppProps<{ session: Session }>) {
//   return (
//     <SessionProvider session={session}>
//       <RWBProvider>
//         <div className={cx(sfPro.variable, inter.variable)}>
//           <Component {...pageProps} />
//         </div>
//       </RWBProvider>
//       <Analytics />
//     </SessionProvider>
//   );
// }


//===================================+> v2 

export default function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <div className="bg-black">
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <SessionProvider session={session}>

            <RWBProvider>
              <div className={cx(sfPro.variable, inter.variable)}>
                <Component {...pageProps} />
              </div>
            </RWBProvider>
            
            <Analytics />

          </SessionProvider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
