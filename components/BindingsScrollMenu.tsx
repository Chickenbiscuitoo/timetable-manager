import type { NextPage } from 'next'
import { useState } from 'react'
import { TiDelete } from 'react-icons/ti'

import BindingsMenuItem from '../components/BindingsMenuItem'

interface Props {
	data: any
}

const BindingsScrollMenu: NextPage<Props> = ({ data }) => {
	const [filter, setFilter] = useState('')

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
					<BindingsMenuItem
						key={i.id}
						id={i.id}
						name={i.name}
						shortname={i.shortname}
						email={i.email}
					/>
				))}
		</div>
	)
}

export default BindingsScrollMenu
