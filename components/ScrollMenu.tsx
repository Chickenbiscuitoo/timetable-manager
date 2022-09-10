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
		<div className="overflow-auto bg-secondary whitespace-nowrap min-h-16 text-indigo-100 sm:w-full md:w-full lg:w-4/5 2xl:w-3/5">
			<div className="inline relative">
				<input
					type="text"
					value={filter}
					onChange={handleChange}
					placeholder="Search"
					className="input input-bordered input-primary max-w-xs w-1/4 rounded-xl ml-2 mr-2 mt-1 text-neutral"
				/>
				<span className="absolute top-1 right-4 text-neutral">
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
