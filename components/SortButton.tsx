import { NextPage } from 'next'

import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'

interface Props {
	asc: boolean
	handleClick: () => void
}

const SortButton: NextPage<Props> = ({ asc, handleClick }) => {
	return (
		<div onClick={handleClick}>
			{asc ? (
				<FaSortAmountDown className="text-lg cursor-pointer" />
			) : (
				<FaSortAmountUp className="text-lg  cursor-pointer" />
			)}
		</div>
	)
}

export default SortButton
