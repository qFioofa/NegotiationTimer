export default class MediaEncoder {
    static async encode(mediaFile) {
        if (!(mediaFile instanceof File) && !(mediaFile instanceof Blob)) {
            throw new Error('Input must be File or Blob object');
        }

        const base64 = await this.fileToBase64(mediaFile);
        const metadata = mediaFile instanceof File ? {
            name: mediaFile.name,
            lastModified: mediaFile.lastModified
        } : {};

        return JSON.stringify({
            data: base64,
            type: mediaFile.type,
            size: mediaFile.size,
            isFile: mediaFile instanceof File,
            metadata: metadata
        });
    }

    static async decode(encodedString) {
        const { data, type, isFile, metadata } = JSON.parse(encodedString);
        const blob = await this.base64ToBlob(data, type);

        if (isFile) {
            return new File([blob], metadata.name, {
                type: type,
                lastModified: metadata.lastModified
            });
        }
        return blob;
    }

    static fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    static base64ToBlob(base64, contentType) {
        const byteString = atob(base64);
        const buffer = new Uint8Array(byteString.length);

        for (let i = 0; i < byteString.length; i++) {
            buffer[i] = byteString.charCodeAt(i);
        }

        return new Blob([buffer], { type: contentType });
    }

    static createMediaElement(blob, elementType = 'video') {
        const url = URL.createObjectURL(blob);
        const element = document.createElement(elementType);

        if (elementType === 'video') {
            element.autoplay = true;
            element.loop = true;
            element.muted = true;
            element.playsInline = true;
        }

        element.src = url;
        return element;
    }

    static releaseMediaElement(element) {
        URL.revokeObjectURL(element.src);
    }
}