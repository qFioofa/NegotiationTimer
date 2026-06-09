export function fileFromUrl(fileUrl: string, name = "uploaded_file"): File | null {
    if (!fileUrl.startsWith("data:")) return null;

    const arr = fileUrl.split(",");
    if (arr.length !== 2) return null;

    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], name, { type: mime });
}

export function extractFilenameFromUrl(fileUrl: string): string | null {
    if (!fileUrl || typeof fileUrl !== "string") return null;

    const base64Data = fileUrl.split(',')[1];
    const decodedStr = atob(base64Data);

    const urlMatch = decodedStr.match(/https?:\/\/[^\s/]+\/[^\s)]+/);
    if (!urlMatch) return null;

    const url = urlMatch[0];
    return url.split('/').pop() ?? null;
}


export function detectFileTypeFromBase64(base64: string): string {
    if (!base64 || typeof base64 !== "string") return "unknown";

    const match = base64.match(/^data:(.*?);base64,/);
    return match ? match[1] : "unknown";
}

export type MediaType = "audio" | "image" | "video" | "unknown";

export function fileTypeFromUrl(fileUrl: string): MediaType {
    if (!fileUrl || typeof fileUrl !== "string") return "unknown";
    const typePart = detectFileTypeFromBase64(fileUrl);

    if (typePart.startsWith("audio/")) return "audio";
    if (typePart.startsWith("image/")) return "image";
    if (typePart.startsWith("video/")) return "video";

    return "unknown";
}

export interface FileUploadResult {
    fileUrl: string | null;
    fileName: string | null;
    fileType: MediaType | null;
    file: File | null;
    error: string | null;
}

export function handleFileUpload(
    event: Event,
    supportedTypes: string[] | false = []
): Promise<FileUploadResult> {
    return new Promise((resolve) => {
        const _result: FileUploadResult = {
            fileUrl: null,
            fileName: null,
            fileType: null,
            file: null,
            error: null
        };

        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) {
            _result.error = "Файл не выбран.";
            return resolve(_result);
        }

        if (supportedTypes !== false && !supportedTypes.includes(file.type)) {
            _result.error = "Неподдерживаемый формат файла.";
            return resolve(_result);
        }

        const reader = new FileReader();
        reader.onload = () => {
            const fileUrl = reader.result as string;
            _result.fileUrl = fileUrl;
            _result.fileName = file.name;
            _result.fileType = fileTypeFromUrl(fileUrl);
            _result.file = fileFromUrl(fileUrl);
            resolve(_result);
        };

        reader.onerror = () => {
            _result.error = "Ошибка при чтении файла.";
            resolve(_result);
        };

        reader.readAsDataURL(file);
    });
}
