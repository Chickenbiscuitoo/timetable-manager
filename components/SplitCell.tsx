import type { NextPage } from 'next'
import styles from '../styles/Timetable.module.css'

import { Subject, Teacher } from '@prisma/client'

interface Props {
	subject: Subject
	position: string
	teacher?: Teacher
}

const SplitCell: NextPage<Props> = ({ subject, position, teacher }) => {
	return (
		<span className={styles[position]}>
			{teacher?.shortname} {subject?.shortname}
		</span>
	)
}

export default SplitCell
