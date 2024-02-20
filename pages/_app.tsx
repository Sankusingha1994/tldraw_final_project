// import Wrapper from "../layout/Wrapper/Wrapper";
import "../styles/globals.css";
// import { useAuth } from "firebase/auth";
import type { AppProps } from "next/app";

import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";

const Wrapper = dynamic(() => import("@/layout/Wrapper/Wrapper"), {
  ssr: false,
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Wrapper>
        <Toaster
          richColors
          dir="ltr"
        />
        <Component {...pageProps} />
      </Wrapper>
    </>
  );
}
