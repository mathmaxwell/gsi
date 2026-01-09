import { Box, Modal, Typography, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getErrorText } from '../../functions/error'
import translation from '../../store/language/translation'
import Lottie from 'lottie-react'

import questioning from '../../../public/animation/Questioning.json'
import nodata from '../../../public/animation/NoData.json'
import expired from '../../../public/animation/CertificateExpired.json'
import glasses from '../../../public/animation/glasses.json'
import love from '../../../public/animation/Love.json'
import empty from '../../../public/animation/Empty.json'
import face from '../../../public/animation/face.json'
import falied from '../../../public/animation/Failed.json'
import passport from '../../../public/animation/Passport.json'

const allowedLanguages = ['uz', 'ru', 'en'] as const
type Language = (typeof allowedLanguages)[number]

const errorAnimations: Record<string, any> = {
	unknown_error: questioning,
	error_check: nodata,
	document_expired: expired,
	invalid_request: expired,
	eyes_closed: glasses,
	error_live: glasses,
	error_more: love,
	multiple_faces: love,
	no_face: empty,
	low_similarity: face,
	head_turned: face,
	error_late: falied,
	default: passport,
}

const ReTry = ({
	open,
	setOpen,
	text,
	setText,
}: {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	text: string
	setText: React.Dispatch<React.SetStateAction<string>>
}) => {
	const err = getErrorText(text)
	const { lang } = useParams<{
		lang: string
	}>()
	const navigate = useNavigate()

	const language: Language = allowedLanguages.includes(lang as Language)
		? (lang as Language)
		: 'ru'

	const animationData = errorAnimations[err] || errorAnimations.default

	const handleClose = () => {
		setOpen(false)
		setText('')
		if (
			err == 'document_expired' ||
			err == 'error_check' ||
			err == 'error_late' ||
			err == 'invalid_passport' ||
			err == 'invalid_request' ||
			err == 'unknown_error'
		) {
			navigate(`/hamkor/${lang}`)
		} else {
			window.location.reload()
		}
	}

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='retry-modal-title'
			sx={{ zIndex: 1300 }}
		>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: { xs: '90%', sm: '500px' },
					maxWidth: '600px',
					bgcolor: 'background.paper',
					borderRadius: 3,
					boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
					p: { xs: 3, sm: 4 },
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 3,
				}}
			>
				<Lottie
					animationData={animationData}
					loop={true}
					style={{
						height: 'min(400px, 70vw)',
						width: 'min(400px, 70vw)',
					}}
				/>

				<Typography
					id='retry-modal-title'
					variant='h5'
					component='h2'
					textAlign='center'
					fontWeight={600}
				>
					{translation[language][err] || translation[language].unknown_error}
				</Typography>

				<Button
					variant='contained'
					color='primary'
					size='large'
					onClick={handleClose}
					sx={{ mt: 1 }}
				>
					{translation[language].action}
				</Button>
			</Box>
		</Modal>
	)
}

export default ReTry
