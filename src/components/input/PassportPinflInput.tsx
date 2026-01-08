import React, { useState, useEffect } from 'react'
import { TextField, Box, Typography } from '@mui/material'
import translation from '../../store/language/translation'
interface PassportPinflInputProps {
	value: string
	onChange?: (value: string) => void
	lang: 'uz' | 'ru' | 'en'
	setPinflCorrect: React.Dispatch<React.SetStateAction<boolean>>
}
const PassportPinflInput: React.FC<PassportPinflInputProps> = ({
	value,
	onChange,
	lang,
	setPinflCorrect,
}) => {
	const [internalValue, setInternalValue] = useState(value.toUpperCase())
	useEffect(() => {
		setInternalValue(value.toUpperCase())
	}, [value])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.toUpperCase()
		value = value.replace(/[^A-Z0-9]/g, '')
		if (value[0] && /[A-Z]/.test(value[0])) {
			const letters = value.slice(0, 2).replace(/[^A-Z]/g, '')
			const digits = value.slice(2).replace(/[^0-9]/g, '')
			value = (letters + digits).slice(0, 9)
		} else {
			value = value.replace(/[^0-9]/g, '').slice(0, 14)
		}
		setInternalValue(value)
		onChange?.(value)
	}

	const isPassportValid = /^[A-Z]{2}[0-9]{7}$/.test(internalValue)

	const isPinflValid = /^\d{14}$/.test(internalValue)
	const isValid = isPassportValid || isPinflValid
	const getTypeLabel = () => {
		if (!internalValue) return ''
		return /^[A-Z]/.test(internalValue)
			? translation[lang].passport_used
			: translation[lang].pinfl_used
	}
	useEffect(() => {
		setPinflCorrect(isValid)
	}, [isValid, setPinflCorrect])
	return (
		<Box sx={{ width: '100%' }}>
			{getTypeLabel() && (
				<Typography
					variant='caption'
					sx={{
						mb: '4px',
						display: 'block',
						color: isValid ? 'success.main' : 'text.secondary',
						fontWeight: 500,
					}}
				>
					{getTypeLabel()}
				</Typography>
			)}

			<TextField
				color='success'
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: '12px',
					},
				}}
				fullWidth
				placeholder={`AA1234567 | ${translation[lang].PINFL}`}
				value={internalValue}
				onChange={handleChange}
				error={!!internalValue && !isValid}
				inputProps={{
					style: {
						textTransform: 'uppercase',
						letterSpacing: '1px',
						fontFamily: 'monospace',
						borderRadius: '12px',
					},
				}}
			/>
		</Box>
	)
}

export default PassportPinflInput
