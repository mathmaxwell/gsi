import api from './axios'
import type { IPerson } from '../types/person/persoon'
import { v4 as uuidv4 } from 'uuid'

const getErrorMessage = (error: any) => {
	let errorMessage = 'Unknown error'
	if (typeof error === 'string') {
		errorMessage = error
	} else if (typeof error === 'object' && error !== null) {
		if (error?.error?.message !== undefined) {
			errorMessage = error.error.message
		} else if (error?.data?.message !== undefined) {
			errorMessage = error.data.message
		} else if (error?.message !== undefined) {
			errorMessage = error.message
		}
	}
	return errorMessage
}

const errorData = (error: Error) => {
	const propertyNames = Object.getOwnPropertyNames(error)
	const result = {}
	propertyNames.forEach(property => {
		const descriptor = Object.getOwnPropertyDescriptor(error, property) || {}
		if ('value' in descriptor) {
			// @ts-ignore
			result[property] = descriptor.value
		}
	})
	return result
}

export async function onSubmit({
	doc_seria,
	doc_number,
	doc_pinfl,
	birth_date,
	video,
}: {
	doc_seria: string
	doc_number: string
	doc_pinfl: string
	birth_date: string
	video: string
}) {
	try {
		const requestId = uuidv4()
		const response = await api.post('/face-api/api/v1/gsi/verify_b64', {
			doc_seria,
			doc_number,
			doc_pinfl,
			birth_date,
			video, // base64
			clientId: 'unknown',
			requestId: requestId,
			serviceName: 'unknown',
			userId: 'unknown',
			token: 'unknown',
		})

		return response.data.data as IPerson
	} catch (error) {
		console.error(error)
		alert(
			JSON.stringify({
				message: getErrorMessage(error),
				error: errorData(error as any),
			})
		)
		throw error
	}
}
export async function onSubmitNative({
	doc_seria,
	doc_number,
	doc_pinfl,
	birth_date,
	video,
}: {
	doc_seria: string
	doc_number: string
	doc_pinfl: string
	birth_date: string
	video: string
}) {
	try {
		const requestId = crypto.randomUUID()
		const response = await fetch(
			'https://face.mbabm.uz/api/v1/gsi/verify_b64',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					doc_seria,
					doc_number,
					doc_pinfl,
					birth_date,
					video, // base64
					clientId: 'unknown',
					requestId,
					serviceName: 'unknown',
					userId: 'unknown',
					token: 'unknown',
				}),
			}
		)

		if (!response.ok) {
			const errorData = await response.json().catch(() => null)
			throw new Error(
				`Request failed with status ${response.status}: ${JSON.stringify(
					errorData
				)}`
			)
		}

		const data = await response.json()
		return data.data as IPerson
	} catch (error) {
		console.error(error)
		alert(
			JSON.stringify({
				message: (error as Error).message,
				error,
			})
		)
		throw error
	}
}
