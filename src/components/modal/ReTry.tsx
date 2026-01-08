import { Box, Modal, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

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
	const navigate = useNavigate()
	const { lang } = useParams<{ lang: string }>()
	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		pt: 2,
		px: 4,
		pb: 3,
	}

	return (
		<>
			<Modal
				open={open}
				onClose={() => {
					setOpen(false)
					navigate(`/hamkor/${lang}`)
					setText('')
				}}
				aria-labelledby='parent-modal-title'
				aria-describedby='parent-modal-description'
				sx={{ zIndex: 100 }}
			>
				<Box sx={{ ...style, width: 400 }}>
					<Typography>{text}</Typography>
				</Box>
			</Modal>
		</>
	)
}

export default ReTry
