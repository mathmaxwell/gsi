export interface IPerson {
	subject_state: number
	subject_state_name: string
	pin: string
	last_name: string
	first_name: string
	patronym: string
	surname: string
	givenname: string
	birth_date: string
	gender: number
	gender_name: string
	document: string
	doc_seria: string
	doc_number: string
	date_issue: string
	date_expiry: string
	give_place: string
	give_place_name: string
	birth_country: string
	birth_country_name: string
	birth_place: string
	nationality: string
	nationality_name: string
	citizenship: string
	citizenship_name: string
	score: number
	capture: string // base64 строка с изображением
	photo: string // base64 строка с изображением
}
