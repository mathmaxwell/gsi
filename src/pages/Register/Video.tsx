import { useEffect, useState } from 'react'
import { get } from 'lodash'
import { _base64ChunksToBlob, blobToBase64 } from '../../functions/scale'
import type { IPerson } from '../../types/person/persoon'
import { onSubmit } from '../../api/submit'
import { useParams } from 'react-router-dom'
import { parsePinfl } from '../../functions/func'
import Camera from '../Camera/Camera'
declare global {
	interface Window {
		addBase64Chunk(chunk: string): void
		submitVideo(): void
		cancelVideo(): void
		webkit: {
			messageHandlers: {
				requestVideoMessage: {
					postMessage: () => void
				}
			}
		}

		AndroidBinding: {
			requestVideoMessage: () => void
		}
	}
}
const Video = () => {
	const { pinfl, birthday } = useParams()

	const [person, setPerson] = useState<IPerson>()
	const [browser, setBrowser] = useState(false)
	useEffect(() => {
		const videoChunks: string[] = []
		window.addBase64Chunk = chunk => {
			videoChunks.push(chunk)
		}
		window.submitVideo = async () => {
			const blob = _base64ChunksToBlob(videoChunks)

			const base64Video = await blobToBase64(blob)
			const result = await onSubmit({
				doc_number: parsePinfl(pinfl).doc_number,
				doc_pinfl: parsePinfl(pinfl).doc_pinfl,
				doc_seria: parsePinfl(pinfl).doc_seria,
				birth_date: birthday || '',
				video: base64Video,
			})
			setPerson(result)
		}
		window.cancelVideo = () => {
			console.log('Запись видео отменена')
		}
		if (get(window, 'webkit.messageHandlers.requestVideoMessage.postMessage')) {
			window.webkit?.messageHandlers?.requestVideoMessage?.postMessage()
			setBrowser(false)
		} else if (get(window, 'AndroidBinding.requestVideoMessage')) {
			window.AndroidBinding?.requestVideoMessage()
			setBrowser(false)
		} else {
			setBrowser(true)
		}
	}, [])
	return (
		<>
			{browser && (
				<>
					<Camera />
				</>
			)}
			{person?.birth_country && person.birth_country}
		</>
	)
}

export default Video
