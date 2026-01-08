import { useEffect, useState } from 'react'
import { get } from 'lodash'
import { _base64ChunksToBlob, blobToBase64 } from '../../functions/scale'
import type { IPerson } from '../../types/person/persoon'
import { onSubmit } from '../../api/submit'
import { useNavigate, useParams } from 'react-router-dom'
import { parsePinfl } from '../../functions/func'
import Camera from '../Camera/Camera'
import ReTry from '../../components/modal/ReTry'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Box, Button, Container, IconButton, Typography } from '@mui/material'
import translation from '../../store/language/translation'
import TextField from '../../components/textField/TextField'
const allowedLanguages = ['uz', 'ru', 'en'] as const
type Language = (typeof allowedLanguages)[number]
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
	const { lang } = useParams<{ lang: string }>()
	const navigate = useNavigate()
	const language: Language = allowedLanguages.includes(lang as Language)
		? (lang as Language)
		: 'ru'
	const { pinfl, birthday } = useParams()
	const [person, setPerson] = useState<IPerson | undefined>(undefined)
	const [browser, setBrowser] = useState(false)
	const [open, setOpen] = useState(false)
	const [text, setText] = useState('')
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
		window.cancelVideo = () => {}
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
	if (person) {
		return (
			<>
				<Container
					maxWidth='lg'
					sx={{
						width: '100vw',
						height: '100vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						alignItems: 'center',
						gap: 2,
					}}
				>
					<Box
						sx={{
							mt: { xs: '10px', sm: '15px', md: '20px' },
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: { xs: '10px', sm: '15px', md: '20px' },
						}}
					>
						<IconButton
							onClick={() => {
								navigate('/hamkor')
							}}
						>
							<ChevronLeftIcon
								color='success'
								sx={{
									height: { xs: '24px', sm: '37px', md: '50px' },
									width: { xs: '24px', sm: '37px', md: '50px' },
								}}
							/>
						</IconButton>
						<Typography
							textAlign={'center'}
							sx={{
								fontSize: {
									xs: '28px',
									sm: '30px',
									md: '34px',
								},
								fontWeight: 400,
							}}
						>
							{translation[language].identity_verification}
						</Typography>
						<Box
							sx={{
								height: { xs: '24px', sm: '37px', md: '50px' },
								width: { xs: '24px', sm: '37px', md: '50px' },
							}}
						/>
					</Box>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							gap: 2,
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
								alignItems: 'center',
							}}
						>
							<img
								src={`data:image/png;base64,${person.capture}`}
								alt='Base64'
								style={{ width: '100%', height: 'auto' }}
							/>
							<Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
								{translation[language].photo_from_camera}
							</Typography>
						</Box>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
								alignItems: 'center',
							}}
						>
							<img
								src={`data:image/png;base64,${person.photo}`}
								alt='Base64'
								style={{ width: '100%', height: 'auto' }}
							/>
							<Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
								{translation[language].photo_from_passport}
							</Typography>
						</Box>
					</Box>
					<Box
						sx={{
							padding: '16px',
							width: '100%',
							bgcolor: 'rgba(0, 0, 0, 0.08)',
							height: '100px',
							borderRadius: '16px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography sx={{ fontWeight: 400, fontSize: '32px' }}>
							{translation[language].similarity}:
							{person.score.toString().slice(0, 6)}
						</Typography>
					</Box>
					<TextField
						title={translation[language].subject_state}
						text={person.subject_state_name}
					/>
					<TextField title={translation[language].PINFL} text={person.pin} />
					<TextField
						title={translation[language].last_name}
						text={person.last_name}
					/>
					<TextField
						title={translation[language].first_name}
						text={person.first_name}
					/>
					<TextField
						title={translation[language].middle_name}
						text={person.patronym}
					/>
					<TextField
						title={translation[language].date_of_birth}
						text={person.birth_date}
					/>
					<TextField
						title={translation[language].gender}
						text={person.gender_name}
					/>
					<TextField
						title={translation[language].document_series}
						text={person.doc_seria}
					/>
					<TextField
						title={translation[language].document_number}
						text={person.doc_number}
					/>
					<TextField
						title={translation[language].date_of_issue}
						text={person.date_issue}
					/>{' '}
					<TextField
						title={translation[language].expiration_date}
						text={person.date_expiry}
					/>
					<TextField
						title={translation[language].issuing_authority}
						text={person.give_place_name}
					/>
					<TextField
						title={translation[language].country_of_birth}
						text={person.birth_country_name}
					/>{' '}
					<TextField
						title={translation[language].nationality}
						text={person.nationality}
					/>
					<TextField
						title={translation[language].citizenship}
						text={person.citizenship_name}
					/>
					<TextField
						title={translation[language].subject_state_id}
						text={person.subject_state.toString()}
					/>{' '}
					<TextField
						title={translation[language].gender_id}
						text={person.gender.toString()}
					/>
					<TextField
						title={translation[language].issue_place_id}
						text={person.give_place.toString()}
					/>
					<TextField
						title={translation[language].birth_country_id}
						text={person.birth_country.toString()}
					/>{' '}
					<TextField
						title={translation[language].nationality_id}
						text={person.nationality.toString()}
					/>{' '}
					<TextField
						title={translation[language].citizenship_id}
						text={person.citizenship.toString()}
					/>
					<Button
						variant='contained'
						color='success'
						onClick={() => {
							navigate('/')
						}}
						fullWidth
						sx={{ borderRadius: '12px', padding: '6px 16px' }}
					>
						{translation[language].status}
					</Button>
					<Button
						sx={{ borderRadius: '12px', padding: '6px 16px', mb: 2 }}
						fullWidth
						color='error'
						onClick={() => {
							navigate('/')
						}}
						variant='outlined'
					>
						{translation[language].action}
					</Button>
				</Container>
			</>
		)
	}
	return (
		<>
			<ReTry open={open} setOpen={setOpen} text={text} setText={setText} />
			{browser ? (
				<Camera setPerson={setPerson} setText={setText} setOpen={setOpen} />
			) : null}
		</>
	)
}

export default Video
