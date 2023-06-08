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
				<section className="min-h-screen min-w-full flex flex-col relative select-none">
					<div className="bg-black w-full h-screen absolute top-0 z-0">
						<video
							autoPlay
							loop
							muted
							className="opacity-80 w-full h-screen object-cover"
						>
							<source
								src="/videos/showcase.webm"
								type="video/webm"
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
				</section>

				<section className="flex flex-col place-content-center place-items-center relative bg-primary pt-32">
					<div className="wave-top">
						<svg
							data-name="Layer 1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 1200 120"
							preserveAspectRatio="none"
						>
							<path
								d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
								opacity=".25"
								className="shape-fill"
							></path>
							<path
								d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
								opacity=".5"
								className="shape-fill"
							></path>
							<path
								d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
								className="shape-fill"
							></path>
						</svg>
					</div>

					<div className="flex flex-row place-content-center place-items-start w-4/5 mb-10">
						<div className="mockup-window bg-base-300">
							<div className="flex justify-center bg-base-200">
								<video autoPlay loop muted width={525}>
									<source
										src="/videos/placeholderVideo.mp4"
										type="video/mp4"
									/>
								</video>
							</div>
						</div>
						<span className="w-[450px] pl-10">
							<h6 className="text-white text-left mb-2">
								Intelligent and efficient
							</h6>
							<h1 className="text-4xl text-white font-bold text-left">
								Scheduling Documents
							</h1>
							<p className="text-white mt-5 text-justify text-lg">
								Scheduling Documents save time by providing
								a structured framework for efficient
								organization and allocation of classes,
								teachers, and other resources. They{' '}
								<span className="font-bold">
									reduce errors
								</span>{' '}
								in assigning the right teachers to the
								appropriate classes, minimizing scheduling
								conflicts. They serve as a reliable
								reference point throughout the process of
								creating a schedule, and most importantly,
								they{' '}
								<span className="font-bold">
									save time
								</span>
								.
							</p>
						</span>
					</div>

					<div className="flex flex-row place-content-center place-items-start w-4/5 mb-10">
						<span className="w-[450px] pr-10">
							<h6 className="text-white text-left mb-2">
								Flexible and smooth
							</h6>
							<h1 className="text-4xl text-white font-bold text-left">
								Scheduling Interface
							</h1>
							<p className="text-white mt-5 text-justify text-lg">
								The Scheduling Interface is a powerful tool
								that allows you to create a schedule that
								fits your needs. It is designed to be
								accessible and{' '}
								<span className="font-bold">
									easy to use
								</span>
								, while still providing the power needed to
								create a schedules that works for you. Its{' '}
								<span className="font-bold">
									intuitive
								</span>{' '}
								design allows you to create a schedule in
								just a few clicks, and its error checking
								features ensure that your schedule is
								accurate and error-free.
							</p>
						</span>
						<div className="mockup-window bg-base-300">
							<div className="flex justify-center bg-base-200">
								<video autoPlay loop muted width={525}>
									<source
										src="/videos/placeholderVideo.mp4"
										type="video/mp4"
									/>
								</video>
							</div>
						</div>
					</div>

					<div className="flex flex-row place-content-center place-items-start w-4/5 mb-10">
						<div className="mockup-window bg-base-300">
							<div className="flex justify-center bg-base-200">
								<video autoPlay loop muted width={525}>
									<source
										src="/videos/placeholderVideo.mp4"
										type="video/mp4"
									/>
								</video>
							</div>
						</div>
						<span className="w-[450px] pl-10">
							<h6 className="text-white text-left mb-2">
								Robust and slick
							</h6>
							<h1 className="text-4xl text-white font-bold text-left">
								Management Interface
							</h1>
							<p className="text-white mt-5 text-justify text-lg">
								This powerful tool allows you to manage
								your teachers, classes, subjects and other
								data in a simple and intuitive way. It
								allows{' '}
								<span className="font-bold">
									quick and easy
								</span>{' '}
								access to all of your data, and provides a
								powerful search feature that allows you to
								find the information you need quickly and
								easily. It also provides a visualisation of
								your data, allowing you to see trends and
								patterns.
							</p>
						</span>
					</div>

					<div className="flex flex-row place-content-center place-items-start w-4/5 mb-10">
						<span className="w-[450px] pr-10">
							<h6 className="text-white text-left mb-2">
								Savvy and Effective
							</h6>
							<h1 className="text-4xl text-white font-bold text-left">
								Your Organization
							</h1>
							<p className="text-white mt-5 text-justify text-lg">
								This function allows you to create
								schedules in collaboration with your
								colleagues. Team-based timetable creation
								helps to distribute workload and
								responsibilities effectively. It is very
								easy to use. Simply create an organization,
								add members, and{' '}
								<span className="font-bold">
									start creating together
								</span>
								.
							</p>
						</span>

						<div className="mockup-window bg-base-300">
							<div className="flex justify-center bg-base-200">
								<video autoPlay loop muted width={525}>
									<source
										src="/videos/placeholderVideo.mp4"
										type="video/mp4"
									/>
								</video>
							</div>
						</div>
					</div>
				</section>
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
