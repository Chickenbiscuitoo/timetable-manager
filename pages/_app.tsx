import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic'

import '../styles/globals.css'

import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'

import NextNProgress from 'nextjs-progressbar'

function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
	return (
		<>
			<NextNProgress color="linear-gradient(90deg, #b656cb, #10a1a0)" />
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</>
	)
}

export default dynamic(() => Promise.resolve(App), {
	ssr: false,
})
