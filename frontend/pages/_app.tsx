import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { TokenContextProvider } from '../common/token'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TokenContextProvider>
      <Component {...pageProps} />
    </TokenContextProvider>
  )
}
