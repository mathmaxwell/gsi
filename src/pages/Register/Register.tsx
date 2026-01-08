import { useNavigate, useParams } from 'react-router-dom'
import translation from '../../store/language/translation'
import hamkorbank from '../../../public/hamkorbank.svg'
import { useEffect, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Box, Button, Container, IconButton, Typography } from '@mui/material'
import PassportPinflInput from '../../components/input/PassportPinflInput'
import Birthday from '../../components/input/Birthday'

const allowedLanguages = ['uz', 'ru', 'en'] as const
type Language = (typeof allowedLanguages)[number]
const Register = () => {
	const [pinfl, setPinfl] = useState<string>('')
	const [pinflCorrect, setPinflCorrect] = useState<boolean>(false)
	const [birthday, setBirthday] = useState<string>('')
	const [birthdayCorrect, setBirthdayCorrect] = useState<boolean>(false)
	const { lang } = useParams<{ lang: string }>()
	const navigate = useNavigate()
	const language: Language = allowedLanguages.includes(lang as Language)
		? (lang as Language)
		: 'ru'
	useEffect(() => {
		if (!allowedLanguages.includes(lang as Language)) {
			navigate('/hamkor/ru', { replace: true })
		}
	}, [lang, navigate])

	return (
		<Container
			maxWidth='lg'
			sx={{
				width: '100vw',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<Box
				sx={{
					mt: { xs: '10px', sm: '15px', md: '20px' },
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: { xs: '10px', sm: '15px', md: '20px' },
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
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
					<img
						src={hamkorbank}
						alt='Hamkor Bank'
						style={{ width: '60%', maxHeight: '90px' }}
					/>
					<Box
						sx={{
							height: { xs: '24px', sm: '37px', md: '50px' },
							width: { xs: '24px', sm: '37px', md: '50px' },
						}}
					/>
				</Box>
				<Typography
					textAlign={'center'}
					sx={{
						fontSize: {
							xs: '28px',
							sm: '30px',
							md: '34px',
						},
						fontWeight: 400,
						mb: 5,
					}}
				>
					{translation[language].login_or_registration}
				</Typography>
			</Box>
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'start',
					gap: 2,
				}}
			>
				<Typography>{translation[language].passport_or_pinfl}</Typography>
				<PassportPinflInput
					value={pinfl}
					onChange={setPinfl}
					lang={language}
					setPinflCorrect={setPinflCorrect}
				/>
				<Typography>{translation[language].date_of_birth}</Typography>
				<Birthday
					value={birthday}
					onChange={setBirthday}
					lang={language}
					setBirthdayCorrect={setBirthdayCorrect}
				/>
			</Box>
			<Button
				sx={{ mt: 'auto', borderRadius: '12px', mb: 2 }}
				fullWidth
				variant='contained'
				color='success'
				disabled={!birthdayCorrect || !pinflCorrect}
				onClick={() => {
					navigate(`/hamkor/${language}/${pinfl}/${birthday}`)
				}}
			>
				{translation[language].continue}
			</Button>
		</Container>
	)
}

export default Register
