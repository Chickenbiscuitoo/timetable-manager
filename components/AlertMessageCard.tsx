import { NextPage } from 'next'

import useTimetableStore from '../store'

import StatusMessageCard from './StatusMessageCard'

const AlertMessageCard: NextPage = ({}) => {
	const { alertMessage, setAlertMessage, resetAlertMessage } =
		useTimetableStore()

	const handleAccept = () => {
		setAlertMessage(alertMessage.message, 'confirmed')
		setTimeout(() => {
			resetAlertMessage()
		}, 3000)
	}

	const handleDeny = () => {
		setAlertMessage(alertMessage.message, 'denied')
		setTimeout(() => {
			resetAlertMessage()
		}, 3000)
	}

	if (alertMessage.status === 'confirmed') {
		return (
			<StatusMessageCard
				status="success"
				message="Operation confirmed"
			/>
		)
	} else if (alertMessage.status === 'denied') {
		return (
			<StatusMessageCard status="error" message="Operation denied" />
		)
	}

	return (
		<div className="alert shadow-lg z-20 sticky bottom-5 w-1/2 m-auto text-center">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					className="stroke-info flex-shrink-0 w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<span>{alertMessage.message}</span>
			</div>
			<div className="flex-none">
				<button
					onClick={handleDeny}
					className="btn btn-sm btn-ghost"
				>
					Deny
				</button>
				<button
					onClick={handleAccept}
					className="btn btn-sm btn-primary"
				>
					Accept
				</button>
			</div>
		</div>
	)
}

export default AlertMessageCard
