import { useEffect, useState } from 'react'

import { get } from 'lodash'
import { _base64ChunksToBlob } from '../../functions/scale'

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

	const [videoBlob, setVideoBlob] = useState<Blob | null>(null) // хранение видео

	useEffect(() => {
		const videoChunks: string[] = []

		// Функция для добавления чанк видео
		window.addBase64Chunk = chunk => {
			videoChunks.push(chunk)
		}

		// Функция для завершения записи и отправки видео
		window.submitVideo = () => {
			const blob = _base64ChunksToBlob(videoChunks)
			setVideoBlob(blob)
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
		</>
	)
}

export default Video
