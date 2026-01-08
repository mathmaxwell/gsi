import { Box, Input, Typography } from '@mui/material'

const TextField = ({ title, text }: { title: string; text: string }) => {
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'start',
					gap: 2,
					width: '100%',
				}}
			>
				<Typography sx={{ fontSize: '16px', fontWeight: 700, width: '155px' }}>
					{title}
				</Typography>
				<Input fullWidth value={text} />
			</Box>
		</>
	)
}

export default TextField
