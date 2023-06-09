import { NextPage } from 'next'

import { useState } from 'react'
import { useRouter } from 'next/router'

import LoginButton from './LoginButton'
import ProfileCard from './ProfileCard'

import { BsPersonFill } from 'react-icons/bs'
import { MdClass } from 'react-icons/md'
import { HiUserGroup } from 'react-icons/hi'
import { AiFillCalendar, AiFillFile } from 'react-icons/ai'
import { RiBookletFill } from 'react-icons/ri'
import { IoPeopleSharp } from 'react-icons/io5'

const Sidebar: NextPage = () => {
	const [popup, setPopup] = useState(false)

	const router = useRouter()

	return (
		<div className="min-h-screen flex select-none">
			<div className="py-4 px-3 bg-neutral w-52 relative">
				<div className="flex items-center pl-2.5 mb-5">
					<h1 className="text-3xl text-white font-bold">
						Time
						<span className="bg-gradient-to-r bg-clip-text  text-transparent from-white via-indigo-500 to-[#6419e6] animate-text">
							ly
						</span>
					</h1>
					<div
						onClick={() => setPopup(!popup)}
						className="flex w-full justify-end align-middle"
					>
						<label className="btn btn-circle bg-[#111318] hover:bg-[rgba(100,26,230,.5)] text-xl">
							<IoPeopleSharp />
						</label>
					</div>
				</div>
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
					<li>
						<a
							onClick={() => router.push('/committees')}
							className="cursor-pointer flex items-center p-2 text-base font-normal rounded-lg border border-transparent transition duration-200 hover:border-primary"
						>
							<RiBookletFill className="w-fit h-full bg-neutral transition duration-75" />
							<span className="ml-3">Committees</span>
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
