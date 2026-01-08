import { Box, TextField } from '@mui/material'
import { useState, useEffect } from 'react'
import translation from '../../store/language/translation'

interface BirthdayInputProps {
	value: string
	onChange?: (value: string) => void
	lang: 'uz' | 'ru' | 'en'
	setBirthdayCorrect: React.Dispatch<React.SetStateAction<boolean>>
}

const Birthday: React.FC<BirthdayInputProps> = ({
	value,
	onChange,
	lang,
	setBirthdayCorrect,
}) => {
	const [internalValue, setInternalValue] = useState<string>(value || '')
	const [isValid, setIsValid] = useState<boolean>(true)

	// Синхронизация с внешним value
	useEffect(() => {
		if (value !== internalValue) {
			setInternalValue(value || '')
		}

	}, [value])

const validateDate = (formatted: string): boolean => {
	if (formatted.length < 10) return false

	const [d, m, y] = formatted.split('.')
	const day = Number(d)
	const month = Number(m)
	const year = Number(y)

	if (!day || !month || !year) return false
	if (month < 1 || month > 12) return false
	if (year < 1900 || year > new Date().getFullYear()) return false

	const daysInMonth = new Date(year, month, 0).getDate()
	if (day < 1 || day > daysInMonth) return false

	return true
}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let rawValue = e.target.value.replace(/\D/g, '')

		if (rawValue.length > 8) {
			rawValue = rawValue.slice(0, 8)
		}

		let formatted = rawValue

		if (rawValue.length >= 3) {
			formatted = `${rawValue.slice(0, 2)}.${rawValue.slice(2)}`
		}
		if (rawValue.length >= 5) {
			formatted = `${rawValue.slice(0, 2)}.${rawValue.slice(
				2,
				4
			)}.${rawValue.slice(4)}`
		}

		setInternalValue(formatted)
		onChange?.(formatted)
	}
useEffect(() => {
	const valid = validateDate(internalValue)
	setIsValid(valid)
	setBirthdayCorrect(valid)
}, [internalValue, setBirthdayCorrect])

	return (
		<Box sx={{ width: '100%' }}>
			<TextField
				color='success'
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: '12px',
					},
				}}
				fullWidth
				placeholder={translation[lang].placeHolderDay}
				value={internalValue}
				onChange={handleChange}
				error={!isValid && internalValue.length > 0}
				helperText={
					!isValid && internalValue.length >= 10
						? translation[lang]?.invalid_date
						: ' '
				}
				inputProps={{
					style: {
						fontFamily: 'monospace',
						letterSpacing: '1px',
					},
					maxLength: 10,
				}}
			/>
		</Box>
	)
}

export default Birthday
