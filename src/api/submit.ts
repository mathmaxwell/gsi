import api from './axios'
import type { IPerson } from '../types/person/persoon'

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
		alert('onSubmit ishladi try')
		const response = await api.post('/api/v1/gsi/verify_b64', {
			doc_seria,
			doc_number,
			doc_pinfl,
			birth_date,
			video, // base64
			clientId: 'unknown',
			requestId: 'unknown',
			serviceName: 'unknown',
			userId: 'unknown',
			token: 'unknown',
		})

		return response.data as IPerson
	} catch (error) {
		console.error(error)
		alert('onSubmit ishladi catch !!!!')
		throw error
	}
}
