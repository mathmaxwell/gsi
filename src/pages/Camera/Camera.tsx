import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { FaceDetection } from '@mediapipe/face_detection'
import { Camera } from '@mediapipe/camera_utils'
import { blobToBase64 } from '../../functions/scale'
import { onSubmit } from '../../api/submit'
import { parsePinfl } from '../../functions/func'
import { useParams } from 'react-router-dom'
import type { IPerson } from '../../types/person/persoon'
import LoadingProgress from '../../components/loading/LoadingProgress'
const RECORD_TIME = 5000

const CameraVideo = ({
	setPerson,
	setText,
	setOpen,
}: {
	setPerson: React.Dispatch<React.SetStateAction<IPerson | undefined>>
	setText: React.Dispatch<React.SetStateAction<string>>
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const [time, setTime] = useState<number>(Math.ceil(RECORD_TIME / 1000))
	const [isLoading, setIsLoading] = useState<boolean>(false)
	useEffect(() => {
		if (time <= 0) return
		const interval = setInterval(() => {
			setTime(prev => {
				if (prev <= 1) {
					clearInterval(interval)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [time])
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
		const s = seconds % 60
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
	}
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
			const r = 250

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
		const preferredTypes = [
			'video/mp4;codecs=avc1',
			'video/mp4',
			'video/webm;codecs=vp9',
			'video/webm;codecs=vp8',
			'video/webm',
		]

		let mimeType = preferredTypes.find(type =>
			MediaRecorder.isTypeSupported(type)
		)

		if (!mimeType) {
			console.error('Ни один видеоформат не поддерживается браузером')
			return
		}
		const recorder = new MediaRecorder(stream, { mimeType })

		chunksRef.current = []

		recorder.ondataavailable = e => {
			if (e.data.size > 0) {
				chunksRef.current.push(e.data)
			}
		}

		recorder.onstop = async () => {
			const blobType = mimeType.includes('mp4') ? 'video/mp4' : 'video/webm'
			const blob = new Blob(chunksRef.current, { type: blobType })
			const base64 = await blobToBase64(blob)
			const cleanBase64 =
				typeof base64 === 'string' && base64.includes(',')
					? base64.split(',')[1]
					: base64

			try {
				setIsLoading(true)
				const result = await onSubmit({
					doc_number: parsePinfl(pinfl).doc_number,
					doc_pinfl: parsePinfl(pinfl).doc_pinfl,
					doc_seria: parsePinfl(pinfl).doc_seria,
					birth_date: birthday || '',
					video: cleanBase64,
				})
				setPerson(result)
				setIsLoading(false)
				stopAll()
			} catch (err) {
				const axiosError = err as any
				console.error('Ошибка отправки:', axiosError.response.data.error)
				setText(axiosError.response.data.error)
				setOpen(true)
				setIsLoading(false)
			}
		}
		recorder.start()
		setTimeout(() => {
			if (recorder.state !== 'inactive') {
				recorder.stop()
			}
		}, RECORD_TIME)

		mediaRecorderRef.current = recorder
	}

	const stopAll = () => {
		// Сначала останавливаем камеру MediaPipe — это важно!
		if (cameraRef.current) {
			cameraRef.current.stop()
			cameraRef.current = null
		}

		// Затем останавливаем MediaRecorder
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== 'inactive'
		) {
			mediaRecorderRef.current.stop()
		}

		// Останавливаем треки потока
		streamRef.current?.getTracks().forEach(t => t.stop())
		streamRef.current = null

		// В конце закрываем face detection
		if (faceDetectionRef.current) {
			faceDetectionRef.current.close()
			faceDetectionRef.current = null
		}
	}
	useEffect(() => {
		return () => {
			stopAll()
		}
	}, [])

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				height: '100vh',
				backgroundColor: 'white',
				overflow: 'hidden',
			}}
		>
			{isLoading && <LoadingProgress />}
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
			<Typography variant='h4' color='success' textAlign={'center'}>
				{formatTime(time)}
			</Typography>
		</Box>
	)
}

export default CameraVideo
