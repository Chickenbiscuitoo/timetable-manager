import type { NextPage } from 'next'
import { useState } from 'react'
import { TiDelete } from 'react-icons/ti'

import MenuItem from '../components/MenuItem'
import BindingCard from './BindingCard'

interface Props {
	data: any
	isTeacher: boolean
}

const ScrollMenu: NextPage<Props> = ({ data, isTeacher }) => {
	const [filter, setFilter] = useState('')

	const [hovered, setHovered] = useState(-1)
	const [hoverTimeout, setHoverTimeout] =
		useState<NodeJS.Timeout | null>(null)

	const handleMouseEnter = (id: number) => {
		setHoverTimeout(
			setTimeout(() => {
				setHovered(id)
			}, 1500)
		)
	}

	const handleMouseLeave = () => {
		setHovered(-1)
		if (hoverTimeout) clearTimeout(hoverTimeout)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFilter(e.target.value)

	return (
		<div className="h-full overflow-y-auto bg-neutral whitespace-nowrap flex flex-col items-center p-3 overflow-x-hidden gap-2">
			<div className="relative">
				<input
					type="text"
					value={filter}
					onChange={handleChange}
					placeholder="Search"
					className="input input-bordered input-primary rounded-xl mb-3"
				/>
				<span
					className="absolute top-4 right-2 text-neutral transition-colors ease-in duration-200 hover:text-error cursor-pointer"
					onClick={() => setFilter('')}
				>
					<TiDelete />
				</span>
			</div>

			{data
				.filter((item: any) =>
					item.name.toLowerCase().includes(filter.toLowerCase())
				)
				.map((i: any) => (
					<div key={i.id} className="w-full">
						<MenuItem
							key={i.id}
							id={i.id}
							name={i.name}
							shortname={i.shortname}
							commitee_id={i.commitee_id}
							isTeacher={isTeacher}
							handleMouseEnter={handleMouseEnter}
							handleMouseLeave={handleMouseLeave}
						/>
						{hovered === i.id && (
							<BindingCard teacherId={i.id} />
						)}
					</div>
				))}
		</div>
	)
}

export default ScrollMenu
