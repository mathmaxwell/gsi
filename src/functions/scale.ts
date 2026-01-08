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
export function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onloadend = () => {
			resolve(reader.result as string)
		}
		reader.onerror = reject
		reader.readAsDataURL(blob)
	})
}
