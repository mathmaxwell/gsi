export function parsePinfl(pinfl: string | undefined) {
	if (pinfl == undefined) {
		return {
			doc_seria: '',
			doc_number: '',
			doc_pinfl: '',
		}
	}
	const isNumeric = /^\d+$/.test(pinfl)
	if (isNumeric && pinfl.length === 14) {
		return {
			doc_seria: '',
			doc_number: '',
			doc_pinfl: pinfl,
		}
	} else {
		const match = pinfl.match(/^([A-Z]+)(\d+)$/i)
		if (match) {
			const [, seria, number] = match
			return {
				doc_seria: seria,
				doc_number: number,
				doc_pinfl: '',
			}
		} else {
			return {
				doc_seria: '',
				doc_number: '',
				doc_pinfl: '',
			}
		}
	}
}
