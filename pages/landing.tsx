import type { NextPage } from 'next'
import Head from 'next/head'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import LoginButton from '../components/LoginButton'

import { AiFillGithub } from 'react-icons/ai'

const Landing: NextPage = () => {
	const router = useRouter()
	const { data: session, status } = useSession()

	if (session && status === 'authenticated') {
		router.push('/')
	}

	return (
		<div>
			<Head>
				<title>Timetable Manager</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen flex flex-row">
				{
					// modern landing page design with a login button
				}
				<div className="flex flex-col justify-center items-center w-full">
					<h1 className="text-5xl font-bold text-center mb-5">
						timetableManager
					</h1>
					<LoginButton />
				</div>
			</main>

			<footer className="flex place-content-center border-t-2 border-neutral pt-6 pb-6">
				<a
					href="https://github.com/Chickenbiscuitoo"
					target="_blank"
					rel="noopener noreferrer"
					className="text-neutral"
				>
					Created by Chickenbiscuitoo
					<span className="ml-1 inline">
						<AiFillGithub className="inline h-full" />
					</span>
				</a>
			</footer>
		</div>
	)
}

export default Landing
