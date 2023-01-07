import { NextPage } from 'next'

import { useSession, signIn, signOut } from 'next-auth/react'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import LoginButton from './LoginButton'
import ProfileCard from './ProfileCard'

import { BsPersonFill } from 'react-icons/bs'
import { MdClass } from 'react-icons/md'
import { HiUserGroup } from 'react-icons/hi'
import { AiFillCalendar } from 'react-icons/ai'
import { AiFillFile } from 'react-icons/ai'

const Sidebar: NextPage = () => {
	const [popup, setPopup] = useState(false)

	const router = useRouter()

	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/')
		},
	})

	const image =
		session?.user?.image ||
		'https://upload.wikimedia.org/wikipedia/commons/2/21/Danny_DeVito_by_Gage_Skidmore.jpg'

	return (
		<div className="min-h-screen flex">
			<div className="py-4 px-3 bg-neutral w-52 relative">
				<a
					onClick={() => setPopup(!popup)}
					className="cursor-pointer flex items-center pl-2.5 mb-5"
				>
					<img
						src={image}
						className="mr-3 h-6 sm:h-7 rounded-full"
						alt="https://upload.wikimedia.org/wikipedia/commons/2/21/Danny_DeVito_by_Gage_Skidmore.jpg"
					/>
					<span className="self-center text-xl font-semibold whitespace-nowrap text-white overflow-hidden">
						{session?.user?.name || 'User'}
					</span>
				</a>
				{popup && <ProfileCard />}
				<ul className="space-y-2">
					<li>
						<a
							onClick={() => router.push('/bindings')}
							className="cursor-pointer flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<AiFillFile className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Bindings</span>
						</a>
					</li>
					<li>
						<a
							onClick={() => router.push('/lessons')}
							className="cursor-pointer flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<AiFillCalendar className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Timetable</span>
						</a>
					</li>
					<li>
						<a
							onClick={() => router.push('/teachers')}
							className="cursor-pointer flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<BsPersonFill className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Teachers</span>
						</a>
					</li>
					<li>
						<a
							onClick={() => router.push('/subjects')}
							className="cursor-pointer flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<MdClass className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Subjects</span>
						</a>
					</li>
					<li>
						<a
							onClick={() => router.push('/classes')}
							className="cursor-pointer flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<HiUserGroup className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Classes</span>
						</a>
					</li>
				</ul>
				<div className="p-2 absolute bottom-10">
					<LoginButton />
				</div>
			</div>
		</div>
	)
}

export default Sidebar
