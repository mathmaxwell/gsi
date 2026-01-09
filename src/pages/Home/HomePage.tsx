import { Box, Button, Container, Typography } from '@mui/material'
import hamkorbank from '../../../public/hamkorbank.svg'
import english from '../../../public/en.svg'
import uzbek from '../../../public/uz.svg'
import rus from '../../../public/ru.svg'
import aba from '../../../public/aba.svg'

import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
const HomePage = () => {
	const navigate = useNavigate()
	useEffect(() => {
		navigate('/hamkor')
	}, [])
	return (
		<>
			<Container
				maxWidth='lg'
				sx={{
					width: '100vw',
					height: '100vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
					}}
				>
					<img src={hamkorbank} alt='Hamkor Bank' style={{ width: '80%' }} />
				</Box>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: 2,
						justifyContent: 'center',
						width: '100%',
					}}
				>
					{[
						{ label: 'English', img: english, path: 'en' },
						{ label: 'Русский', img: rus, path: 'ru' },
						{ label: "O'zbekcha", img: uzbek, path: 'uz' },
					].map(({ label, img, path }) => (
						<Button
							key={path}
							onClick={() => navigate(`/hamkor/${path}`)}
							sx={{
								flex: { xs: '1 1 100%', sm: '1 1 calc(33.33% - 16px)' }, // на sm и выше три кнопки в ряд
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 2,
								padding: { xs: '16px 24px', sm: '12px 24px' },
								border: '2px solid',
								borderColor: 'rgb(46, 125, 50)',
								borderRadius: '12px',
								backgroundColor: 'transparent',
							}}
						>
							<Typography variant='h5' color='black' sx={{ fontWeight: 500 }}>
								{label}
							</Typography>
							<img
								src={img}
								alt={label}
								style={{ height: '32px', width: 'auto' }}
							/>
						</Button>
					))}
				</Box>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 2,
					}}
				>
					<img src={aba} alt='' />
					<a href='' style={{ color: 'rgb(46, 125, 50)', fontSize: '16px' }}>
						mbabm.uz
					</a>
				</Box>
			</Container>
		</>
	)
}

export default HomePage
