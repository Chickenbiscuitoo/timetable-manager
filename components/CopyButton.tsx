import type { NextPage } from 'next'
import styles from '../styles/CopyButton.module.css'

import { useState } from 'react'
import useTimetableStore from '../store'

const CopyButton: NextPage = () => {
	const [clicked, setClicked] = useState(false)

	const { classes } = useTimetableStore()

	return (
		<div onMouseLeave={() => setClicked(false)}>
			<button onClick={() => setClicked(true)}>COPY</button>
		</div>
	)
}

export default CopyButton
