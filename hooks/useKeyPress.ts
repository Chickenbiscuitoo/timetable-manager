import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

const useKeyPress = (
	key: string,
	ctrlKeyEnabled: boolean = true,
	callback: (event: KeyboardEvent) => void,
	node: HTMLElement | null = null
) => {
	const callbackRef = useRef(callback)
	useLayoutEffect(() => {
		callbackRef.current = callback
	})

	const handleKeyPress = useCallback(
		(event: KeyboardEvent) => {
			if (ctrlKeyEnabled) {
				if (event.ctrlKey && key === event.key) {
					callbackRef.current(event)
				}
			} else {
				if (key === event.key) {
					callbackRef.current(event)
				}
			}
		},
		[key]
	)

	useEffect(() => {
		const targetNode = node ?? document
		targetNode &&
			targetNode.addEventListener(
				'keydown',
				handleKeyPress as EventListener
			)

		return () =>
			targetNode &&
			targetNode.removeEventListener(
				'keydown',
				handleKeyPress as EventListener
			)
	}, [handleKeyPress, node])
}

export default useKeyPress
