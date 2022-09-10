import type { NextPage } from 'next'
import { useState } from 'react'
import { TiDelete } from 'react-icons/ti'

import MenuItem from '../components/MenuItem'

interface Props {
	data: any
	isTeacher: boolean
}

const ScrollMenu: NextPage<Props> = ({ data, isTeacher }) => {
	const [filter, setFilter] = useState('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFilter(e.target.value)

	return (
		<div className="h-full w-1/2 overflow-y-auto bg-neutral whitespace-nowrap flex flex-col items-center p-3 overflow-x-hidden gap-2">
			<div className="relative">
				<input
					type="text"
					value={filter}
					onChange={handleChange}
					placeholder="Search"
					className="input input-bordered input-primary rounded-xl mb-3"
				/>
				<span className="absolute top-4 right-2 text-neutral transition-colors ease-in duration-200 hover:text-error cursor-pointer">
					<TiDelete />
				</span>
			</div>

			{data
				.filter((item: any) =>
					item.name.toLowerCase().includes(filter.toLowerCase())
				)
				.map((i: any) => (
					<MenuItem
						key={i.id}
						id={i.id}
						name={i.name}
						shortname={i.shortname}
						commitee_id={i.commitee_id}
						isTeacher={isTeacher}
					/>
				))}
		</div>
	)
}

export default ScrollMenu
