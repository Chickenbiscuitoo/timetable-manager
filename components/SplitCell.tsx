import type { NextPage } from 'next'

import { Subject, Teacher } from '@prisma/client'

interface Props {
	subject: Subject
	position: string
	teacher?: Teacher
}

const SplitCell: NextPage<Props> = ({ subject, position, teacher }) => {
	return (
		<div
			className="w-1/2 h-full absolute text-center top-1"
			style={{ [position]: 0 }}
		>
			<h4>{teacher?.shortname}</h4>
			<h4 className="text-primary">{subject?.shortname}</h4>
		</div>
	)
}

export default SplitCell
