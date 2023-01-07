import type { NextPage } from 'next'
import { useState } from 'react'
import { TiDelete } from 'react-icons/ti'

import BindingsMenuItem from '../components/BindingsMenuItem'
import BindingCard from './BindingCard'

interface Props {
	teachers: any
}

const BindingsScrollMenu: NextPage<Props> = ({ teachers }) => {
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
		<div className="h-full overflow-y-auto bg-neutral whitespace-nowrap flex flex-col items-center p-3 overflow-x-hidden gap-2 relative">
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

			{teachers
				.filter((item: any) =>
					item.name.toLowerCase().includes(filter.toLowerCase())
				)
				.map((i: any) => (
					<div key={i.id} className="w-full">
						<BindingsMenuItem
							key={i.id}
							id={i.id}
							name={i.name}
							shortname={i.shortname}
							email={i.email}
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

export default BindingsScrollMenu
