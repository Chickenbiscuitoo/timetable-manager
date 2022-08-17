import type { NextPage } from 'next'
import styles from '../styles/ScrollMenu.module.css'

import { useDrag } from 'react-dnd'

interface Props {
	name: string
	id: number
}

const MenuItem: NextPage<Props> = ({ name, id }) => {
	const [collected, drag] = useDrag(() => ({
		type: 'MenuItem',
		item: { id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
			name: name,
		}),
	}))

	return <a ref={drag}>{name}</a>
}

export default MenuItem
