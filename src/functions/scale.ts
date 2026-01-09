export function _base64ChunksToBlob(videoChunks: string[]) {
	const byteArrays = videoChunks.map(chunk => {
		const base64Data = chunk.split(',')[1] || chunk
		const binaryString = atob(base64Data)
		const byteArray = new Uint8Array(binaryString.length)
		for (let i = 0; i < binaryString.length; i++) {
			byteArray[i] = binaryString.charCodeAt(i)
		}
		return byteArray
	})
	return new Blob(byteArrays, { type: 'video/mp4' })
}
export const blobToBase64 = (blob: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			const dataUrl = reader.result as string
			const base64 = dataUrl.split(',')[1]
			resolve(base64)
		}
		reader.onerror = reject
		reader.readAsDataURL(blob)
	})
}
export function createObjectUrlFromBase64Sync(
	base64: string,
	mimeType: string = 'image/jpeg'
): string {
	const binaryString = atob(base64)
	const len = binaryString.length
	const bytes = new Uint8Array(len)

	for (let i = 0; i < len; i++) {
		bytes[i] = binaryString.charCodeAt(i)
	}

	const blob = new Blob([bytes], { type: mimeType })
	return URL.createObjectURL(blob)
}
