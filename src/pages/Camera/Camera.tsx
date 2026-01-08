import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { FaceDetection } from '@mediapipe/face_detection'
import { Camera } from '@mediapipe/camera_utils'
import { blobToBase64 } from '../../functions/scale'
import { onSubmit } from '../../api/submit'
import { parsePinfl } from '../../functions/func'
import { useParams } from 'react-router-dom'

const RECORD_TIME = 5000 // 5 секунд

const CameraVideo = () => {
	const { pinfl, birthday } = useParams()
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const chunksRef = useRef<Blob[]>([])
	const faceDetectionRef = useRef<FaceDetection | null>(null)
	const cameraRef = useRef<Camera | null>(null)

	const [isInside, setIsInside] = useState(false)

	useEffect(() => {
		startCamera()
		return stopAll
	}, [])

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { width: 1280, height: 720 },
				audio: false,
			})

			streamRef.current = stream

			if (videoRef.current) {
				videoRef.current.srcObject = stream
			}

			startFaceDetection()
			startRecording(stream)
		} catch (e) {
			console.error('Camera error', e)
		}
	}

	const startFaceDetection = () => {
		const faceDetection = new FaceDetection({
			locateFile: file =>
				`https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
		})

		faceDetection.setOptions({
			model: 'short',
			minDetectionConfidence: 0.7,
		})

		faceDetection.onResults(results => {
			if (!results.detections.length) {
				setIsInside(false)
				return
			}

			const box = results.detections[0].boundingBox
			const x = box.xCenter! * 1280
			const y = box.yCenter! * 720

			const cx = 640
			const cy = 360
			const r = 250 // Немного увеличил радиус проверки под новый большой круг

			const dx = x - cx
			const dy = y - cy

			setIsInside(dx * dx + dy * dy <= r * r)
		})

		faceDetectionRef.current = faceDetection

		if (videoRef.current) {
			const camera = new Camera(videoRef.current, {
				onFrame: async () => {
					if (faceDetectionRef.current && videoRef.current) {
						await faceDetectionRef.current.send({ image: videoRef.current })
					}
				},
				width: 1280,
				height: 720,
			})
			camera.start()
			cameraRef.current = camera
		}
	}

	const startRecording = (stream: MediaStream) => {
		const recorder = new MediaRecorder(stream, {
			mimeType: 'video/webm',
		})

		chunksRef.current = []

		recorder.ondataavailable = e => {
			if (e.data.size) chunksRef.current.push(e.data)
		}

		recorder.onstop = async () => {
			const blob = new Blob(chunksRef.current, { type: 'video/webm' })
			const base64 = await blobToBase64(blob)
			const result = await onSubmit({
				doc_number: parsePinfl(pinfl).doc_number,
				doc_pinfl: parsePinfl(pinfl).doc_pinfl,
				doc_seria: parsePinfl(pinfl).doc_seria,
				birth_date: birthday || '',
				video: base64,
			})
			console.log('result', result)
		}

		recorder.start()
		mediaRecorderRef.current = recorder

		setTimeout(() => recorder.stop(), RECORD_TIME)
	}

	const stopAll = () => {
		mediaRecorderRef.current?.stop()
		streamRef.current?.getTracks().forEach(t => t.stop())
		cameraRef.current?.stop()
		faceDetectionRef.current?.close()
	}

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				height: '100vh', // Полноэкранно, чтобы круг занимал почти весь экран
				backgroundColor: 'white',
				overflow: 'hidden',
			}}
		>
			{/* Клиппинг-контейнер: видео только внутри круга */}
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '60vw',
					height: '90vh',
					borderRadius: '50%',
					overflow: 'hidden',
					pointerEvents: 'none',
				}}
			>
				<video
					ref={videoRef}
					autoPlay
					muted
					playsInline
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			</Box>

			{/* Индикатор круга (border) */}
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '60vw',
					height: '90vh',
					borderRadius: '50%',
					border: `6px solid ${isInside ? 'green' : 'red'}`,
					pointerEvents: 'none',
					boxSizing: 'border-box',
				}}
			/>
		</Box>
	)
}

export default CameraVideo
