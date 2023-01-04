import type { NextPage } from 'next'

import useTimetableStore from '../store'
import { useState } from 'react'

import { BiMailSend } from 'react-icons/bi'

const SendBindingsButton: NextPage = () => {
	const { sendBindings, alertMessage, setAlertMessage, teachers } =
		useTimetableStore()

	const [wantsToSend, setWantsToSend] = useState(false)

	const teachersCount = teachers.length

	const handleClick = () => {
		setAlertMessage(
			`Are you sure you want to send email to ${teachersCount} teachers?`,
			undefined
		)
		setWantsToSend(true)
	}

	if (wantsToSend && alertMessage.status === 'confirmed') {
		sendBindings()
		setWantsToSend(false)
		console.log('Sending bindings to teachers...')
	}

	if (wantsToSend && alertMessage.status === 'denied') {
		setWantsToSend(false)
	}

	return (
		<button onClick={handleClick} className="btn gap-2">
			<BiMailSend className="text-xl" />
			Send Bindings To Teachers
		</button>
	)
}

export default SendBindingsButton
