import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

const useKeyPress = (
	key: string,
	callback: (event: KeyboardEvent) => void,
	node: HTMLElement | null = null
) => {
	// implement the callback ref pattern
	const callbackRef = useRef(callback)
	useLayoutEffect(() => {
		callbackRef.current = callback
	})

	// handle what happens on key press
	const handleKeyPress = useCallback(
		(event: KeyboardEvent) => {
			// check if one of the key is part of the ones we want
			if (event.ctrlKey && key === event.key) {
				callbackRef.current(event)
			}
		},
		[key]
	)

	useEffect(() => {
		// target is either the provided node or the document
		const targetNode = node ?? document
		// attach the event listener
		targetNode &&
			targetNode.addEventListener(
				'keydown',
				handleKeyPress as EventListener
			)

		// remove the event listener
		return () =>
			targetNode &&
			targetNode.removeEventListener(
				'keydown',
				handleKeyPress as EventListener
			)
	}, [handleKeyPress, node])
}

export default useKeyPress
