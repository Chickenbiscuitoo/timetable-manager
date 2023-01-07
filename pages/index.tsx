import type { NextPage } from 'next'
import Head from 'next/head'

import LoginButtonGlowing from '../components/LoginButtonGlowing'

import { AiFillGithub } from 'react-icons/ai'

const Home: NextPage = () => {
	return (
		<div className="bg-black">
			<Head>
				<title>Timely</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen min-w-full flex flex-col relative select-none">
				<div className="bg-black w-full h-screen absolute top-0 z-0">
					<video
						autoPlay
						loop
						muted
						className="opacity-80 w-full h-screen object-cover"
					>
						<source
							src="/videos/showcase.mp4"
							type="video/mp4"
						/>
					</video>
				</div>
				<div className="z-20 w-full h-[50vh] bg-gradient-to-t from-black"></div>
				<div className="z-20 w-full bg-black">
					<div className="flex flex-col items-center justify-center h-[50vh]">
						<h1 className="text-6xl text-white font-bold">
							Time
							<span className="bg-gradient-to-r bg-clip-text  text-transparent from-white via-indigo-500 to-[#6419e6] animate-text">
								ly
							</span>
						</h1>

						<div className="mt-20">
							<LoginButtonGlowing />
						</div>
					</div>
				</div>
			</main>

			<footer className="flex place-content-center border-t pt-6 pb-6">
				<a
					href="https://github.com/Chickenbiscuitoo"
					target="_blank"
					rel="noopener noreferrer"
				>
					Chickenbiscuitoo
					<span className="ml-1 inline">
						<AiFillGithub className="inline h-full" />
					</span>
				</a>
			</footer>
		</div>
	)
}

export default Home
