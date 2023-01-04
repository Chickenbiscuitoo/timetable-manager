import type { NextPage } from 'next'

import useTimetableStore from '../store'

import { BiMailSend } from 'react-icons/bi'

const SendBindingsButton: NextPage = () => {
	const { sendBindings } = useTimetableStore()

	return (
		<button className="btn gap-2">
			<BiMailSend className="text-xl" />
			Send Bindings To Teachers
		</button>
	)
}

export default SendBindingsButton
