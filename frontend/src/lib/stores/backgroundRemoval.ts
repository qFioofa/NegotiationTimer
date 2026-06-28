export type BgMode = "off" | "blur" | "remove";

type Results = {
	image: CanvasImageSource;
	segmentationMask: CanvasImageSource;
};

type Segmenter = {
	setOptions: (o: { modelSelection: number }) => void;
	onResults: (cb: (r: unknown) => void) => void;
	send: (i: { image: HTMLVideoElement }) => Promise<void>;
	close: () => void;
};

let segmenter: Segmenter | null = null;
let video: HTMLVideoElement | null = null;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let mode: BgMode = "blur";

function draw(results: Results): void {
	if (!ctx || !canvas) return;
	const w = canvas.width;
	const h = canvas.height;

	ctx.save();
	ctx.clearRect(0, 0, w, h);
	ctx.drawImage(results.segmentationMask, 0, 0, w, h);

	ctx.globalCompositeOperation = "source-in";
	ctx.drawImage(results.image, 0, 0, w, h);

	if (mode === "blur") {
		ctx.globalCompositeOperation = "destination-over";
		ctx.filter = "blur(12px)";
		ctx.drawImage(results.image, 0, 0, w, h);
		ctx.filter = "none";
	}
	ctx.restore();
}

export async function startProcessing(raw: MediaStream, initial: BgMode): Promise<MediaStream> {
	mode = initial;

	const mod = (await import("@mediapipe/selfie_segmentation")) as Record<string, unknown>;
	const SelfieSegmentation = (mod.SelfieSegmentation ??
		(mod.default as Record<string, unknown>)?.SelfieSegmentation) as new (o: {
		locateFile: (f: string) => string;
	}) => Segmenter;

	video = document.createElement("video");
	video.srcObject = raw;
	video.muted = true;
	video.playsInline = true;
	await video.play();

	const s = raw.getVideoTracks()[0].getSettings();
	canvas = document.createElement("canvas");
	canvas.width = s.width ?? 640;
	canvas.height = s.height ?? 480;
	ctx = canvas.getContext("2d");

	segmenter = new SelfieSegmentation({
		locateFile: (f: string) =>
			`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${f}`,
	});
	segmenter.setOptions({ modelSelection: 1 });
	segmenter.onResults(draw as (r: unknown) => void);

	const loop = async () => {
		if (!video || !segmenter) return;
		if (video.readyState >= 2) {
			try {
				await segmenter.send({ image: video });
			} catch {
				void 0;
			}
		}
		raf = requestAnimationFrame(loop);
	};
	loop();

	return canvas.captureStream(30);
}

export function setProcessingMode(next: BgMode): void {
	mode = next;
}

export function stopProcessing(): void {
	if (raf) cancelAnimationFrame(raf);
	raf = 0;
	try {
		segmenter?.close();
	} catch {
		void 0;
	}
	segmenter = null;
	if (video) {
		video.srcObject = null;
		video = null;
	}
	canvas = null;
	ctx = null;
}
