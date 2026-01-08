import { useEffect, useState } from 'react'

import { get } from 'lodash'
import { _base64ChunksToBlob, blobToBase64 } from '../../functions/scale'
import type { IPerson } from '../../types/person/persoon'
import { onSubmit } from '../../api/submit'
import { useParams } from 'react-router-dom'
import { parsePinfl } from '../../functions/func'
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

	const [videoBlob, setVideoBlob] = useState<Blob | null>(null) // хранение видео
	const [videoBase, setVideoBase] = useState<string>('')
	const [person, setPerson] = useState<IPerson>()
	useEffect(() => {
		const videoChunks: string[] = []
		// Функция для добавления чанк видео
		window.addBase64Chunk = chunk => {
			videoChunks.push(chunk)
		}

		// Функция для завершения записи и отправки видео
		window.submitVideo = async () => {
			const blob = _base64ChunksToBlob(videoChunks)
			setVideoBlob(blob)
			const base64Video = await blobToBase64(blob)
			setVideoBase(base64Video)
			const result = await onSubmit({
				doc_number: parsePinfl(pinfl).doc_number,
				doc_pinfl: parsePinfl(pinfl).doc_pinfl,
				doc_seria: parsePinfl(pinfl).doc_seria,
				birth_date: birthday || '',
				video: videoBase,
			})
			alert(result)
			setPerson(result)
		}

		// Функция для отмены записи видео
		window.cancelVideo = () => {
			setVideoBlob(null)
			console.log('Запись видео отменена')
		}

		// Запрос видео на iOS
		if (get(window, 'webkit.messageHandlers.requestVideoMessage.postMessage')) {
			window.webkit?.messageHandlers?.requestVideoMessage?.postMessage()
		}

		// Запрос видео на Android
		if (get(window, 'AndroidBinding.requestVideoMessage')) {
			window.AndroidBinding?.requestVideoMessage()
		}
	}, [])
	return (
		<>
			{videoBlob ? (
				<video
					src={URL.createObjectURL(videoBlob)}
					controls
					autoPlay
					style={{ width: '100%' }}
				/>
			) : (
				<p>Видео еще не записано</p>
			)}
			{person?.birth_country ? person.first_name : 'undefined person'}
		</>
	)
}

export default Video
