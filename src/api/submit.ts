import api from './axios'
import type { IPerson } from '../types/person/person'
import { v4 as uuidv4 } from 'uuid'

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
		const response = await api.post('/v1/gsi/verify_b64', {
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
		throw error
	}
}
