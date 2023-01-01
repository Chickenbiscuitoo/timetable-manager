import { NextPage } from 'next'

import { useEffect, useState } from 'react'

interface ErrorMessageProps {
	errorMessage: string
}

const ErrorMessageCard: NextPage<ErrorMessageProps> = ({
	errorMessage,
}) => {
	const [show, setShow] = useState(true)

	useEffect(() => {
		const timeId = setTimeout(() => {
			setShow(false)
		}, 3000)

		return () => {
			clearTimeout(timeId)
		}
	}, [])

	if (!show) {
		return null
	}

	return (
		<div className="z-20 w-1/2 absolute bottom-5 left-0 right-0 m-auto text-center alert alert-warning shadow-lg">
			<div className="text-center m-auto">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<span className="text-center">{errorMessage}</span>
			</div>
		</div>
	)
}

export default ErrorMessageCard
