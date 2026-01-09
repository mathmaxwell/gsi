// try {
// 	await verify()
// } catch (e: any) {
// 	const errorCode = e.response?.data?.errorCode
// 	setError(getVerificationErrorMessage(errorCode))
// }

enum VerificationErrorCode {
	// 1. GSI API Errors
	GSI_API_ERROR = 'GSI_API_ERROR',
	GSI_NO_DATA = 'GSI_NO_DATA',

	// 2. Liveness Check Errors
	LIVENESS_NOT_ALIVE = 'LIVENESS_NOT_ALIVE',
	LIVENESS_NO_AVERAGE = 'LIVENESS_NO_AVERAGE',
	LIVENESS_NO_BEST_FACE = 'LIVENESS_NO_BEST_FACE',
	LIVENESS_NO_NORMALIZED = 'LIVENESS_NO_NORMALIZED',
	LIVENESS_SCORE_TOO_LOW = 'LIVENESS_SCORE_TOO_LOW',

	// 3. Face Detection Errors in Liveness Photo
	LIVENESS_MULTIPLE_FACES = 'LIVENESS_MULTIPLE_FACES',

	// 4. Eyes and Head Position Errors
	EYES_CLOSED_OR_HIDDEN = 'EYES_CLOSED_OR_HIDDEN',
	HEAD_TURNED = 'HEAD_TURNED',

	// 5. Face Detection Errors in GSI Photo
	GSI_PHOTO_MULTIPLE_FACES = 'GSI_PHOTO_MULTIPLE_FACES',
	GSI_PHOTO_NO_FACE = 'GSI_PHOTO_NO_FACE',

	// 6. Face Verification Errors
	FACEIDS_API_ERROR = 'FACEIDS_API_ERROR',
	SIMILARITY_SCORE_TOO_LOW = 'SIMILARITY_SCORE_TOO_LOW',

	// 7. Passport Validation Errors
	PASSPORT_INVALID = 'PASSPORT_INVALID',
	DOCUMENT_EXPIRED = 'DOCUMENT_EXPIRED',

	// 8. Request Validation Errors
	INVALID_PAYLOAD = 'INVALID_PAYLOAD',

	// Generic Error
	UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export const VerificationErrorMessage: Record<VerificationErrorCode, string> = {
	// 1. GSI API Errors
	[VerificationErrorCode.GSI_API_ERROR]: 'ГЦП недоступен. Попробуйте позже',
	[VerificationErrorCode.GSI_NO_DATA]:
		'ГЦП не передал данные. Проверьте серию и номер паспорта',

	// 2. Liveness Check Errors
	[VerificationErrorCode.LIVENESS_NOT_ALIVE]: 'Не пройден liveness (#1)',
	[VerificationErrorCode.LIVENESS_NO_AVERAGE]: 'Не пройден liveness (#2)',
	[VerificationErrorCode.LIVENESS_NO_BEST_FACE]: 'Не пройден liveness (#3)',
	[VerificationErrorCode.LIVENESS_NO_NORMALIZED]: 'Не пройден liveness (#4)',
	[VerificationErrorCode.LIVENESS_SCORE_TOO_LOW]: 'Не пройден liveness (#5)',

	// 3. Face Detection Errors in Liveness Photo
	[VerificationErrorCode.LIVENESS_MULTIPLE_FACES]:
		'Фото содержит больше одного лица. Обратитесь в поддержку',

	// 4. Eyes and Head Position Errors
	[VerificationErrorCode.EYES_CLOSED_OR_HIDDEN]: 'Глаза закрыты или не видны',
	[VerificationErrorCode.HEAD_TURNED]: 'Голова повернута',

	// 5. Face Detection Errors in GSI Photo
	[VerificationErrorCode.GSI_PHOTO_MULTIPLE_FACES]:
		'Фото из ГЦП содержит больше одного лица. Обратитесь в поддержку',
	[VerificationErrorCode.GSI_PHOTO_NO_FACE]:
		'Фото из ГЦП не содержит лицо. Обратитесь в поддержку',

	// 6. Face Verification Errors
	[VerificationErrorCode.FACEIDS_API_ERROR]: 'Ошибка из API FaceIds',
	[VerificationErrorCode.SIMILARITY_SCORE_TOO_LOW]:
		'Низкое сходство с фото из ГЦП',

	// 7. Passport Validation Errors
	[VerificationErrorCode.PASSPORT_INVALID]: 'Паспорт недействителен',
	[VerificationErrorCode.DOCUMENT_EXPIRED]: 'Истек срок действия документа',

	// 8. Request Validation Errors
	[VerificationErrorCode.INVALID_PAYLOAD]:
		'Неверные параметры запроса. Проверьте данные',

	// Generic Error
	[VerificationErrorCode.UNKNOWN_ERROR]: 'Произошла неизвестная ошибка',
}
export function getVerificationErrorMessage(
	errorCode: string | undefined
): string {
	if (!errorCode)
		return VerificationErrorMessage[VerificationErrorCode.UNKNOWN_ERROR]

	// Если errorCode есть в enum, вернуть сообщение
	if (
		Object.values(VerificationErrorCode).includes(
			errorCode as VerificationErrorCode
		)
	) {
		return VerificationErrorMessage[errorCode as VerificationErrorCode]
	}

	// Если неизвестный код
	return VerificationErrorMessage[VerificationErrorCode.UNKNOWN_ERROR]
}
export function getErrorText(text: string) {
	if (text == 'ГЦП недоступен. Попробуйте позже') {
		return 'error_late'
	} else if (text == 'ГЦП не передал данные. Проверьте серию и номер паспорта')
		return 'error_check'
	else if (text.includes('Не пройден liveness')) {
		return 'error_live'
	} else if (
		text == 'Фото содержит больше одного лица. Обратитесь в поддержку'
	) {
		return 'error_more'
	} else if (text == 'Глаза закрыты или не видны') {
		return 'eyes_closed'
	} else if (text == 'Голова повернута') {
		return 'head_turned'
	} else if (
		text == 'Фото из ГЦП содержит больше одного лица. Обратитесь в поддержку'
	) {
		return 'multiple_faces'
	} else if (text == 'Фото из ГЦП не содержит лицо. Обратитесь в поддержку') {
		return 'no_face'
	} else if (text == 'Низкое сходство с фото из ГЦП') {
		return 'low_similarity'
	} else if (text == 'Паспорт недействителен') {
		return 'invalid_passport'
	} else if (text == 'Истек срок действия документа') {
		return 'document_expired'
	} else if (text == 'Неверные параметры запроса. Проверьте данные') {
		return 'invalid_request'
	} else {
		return 'unknown_error'
	}
}
