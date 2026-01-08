import { Box, CircularProgress } from '@mui/material'

const LoadingProgress = () => {
	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				backgroundColor: 'rgba(0, 0, 0, 0.3)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 9999,
			}}
		>
			<CircularProgress color='primary' size={80} />
		</Box>
	)
}

export default LoadingProgress
