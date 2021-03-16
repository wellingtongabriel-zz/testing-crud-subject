function base64ToBlob(base64String) {
    try {
        const arquivo = base64String.split(',');

        const raw = window.atob(arquivo[1]);
        const rawLength = raw.length;
        const blobArray = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            blobArray[i] = raw.charCodeAt(i);
        }

        const blob = new Blob([blobArray], { type: arquivo[0] });
        return window.URL.createObjectURL(blob)
    } catch (error) {
        console.error(error);
    }
}

export default base64ToBlob;

