<script lang="ts">
	import { Video, VideoOff, CameraOff } from "lucide-svelte";
	import {
		cameraStream,
		cameraOn,
		cameraError,
		cameraDevices,
		cameraDeviceId,
		bgMode,
		startCamera,
		stopCamera,
		refreshDevices,
	} from "$lib/stores/camera";
	import { onMount } from "svelte";

	const BG_MODES = [
		{ id: "off", label: "Фон вкл" },
		{ id: "blur", label: "Размытие" },
		{ id: "remove", label: "Убрать фон" },
	] as const;

	onMount(refreshDevices);

	function srcObject(node: HTMLVideoElement, stream: MediaStream | null) {
		node.srcObject = stream;
		return {
			update(s: MediaStream | null) {
				node.srcObject = s;
			},
		};
	}

	function onDeviceChange(e: Event) {
		const id = (e.currentTarget as HTMLSelectElement).value;
		cameraDeviceId.set(id);
		if ($cameraOn) startCamera(id);
	}
</script>

<p class="hint">
	Включи камеру — её увидят участники вместо твоей цифры в центре. Доступ
	запрашивается у браузера.
</p>

<div class="preview">
	{#if $cameraStream}
		<video
			use:srcObject={$cameraStream}
			autoplay
			muted
			playsinline
		></video>
	{:else}
		<div class="placeholder">
			<CameraOff size={40} />
			<span>{$cameraError || "Камера не подключена"}</span>
		</div>
	{/if}
</div>

<div class="controls">
	{#if $cameraOn}
		<button class="btn" onclick={() => stopCamera()}>
			<VideoOff size={18} />Выключить камеру
		</button>
	{:else}
		<button class="btn primary" onclick={() => startCamera($cameraDeviceId || undefined)}>
			<Video size={18} />Включить камеру
		</button>
	{/if}

	{#if $cameraDevices.length > 1}
		<select value={$cameraDeviceId} onchange={onDeviceChange}>
			{#each $cameraDevices as d (d.deviceId)}
				<option value={d.deviceId}>{d.label || "Камера"}</option>
			{/each}
		</select>
	{/if}
</div>

<div class="modes">
	{#each BG_MODES as m (m.id)}
		<button
			class="mode"
			class:active={$bgMode === m.id}
			onclick={() => bgMode.set(m.id)}
		>
			{m.label}
		</button>
	{/each}
</div>
{#if $bgMode !== "off"}
	<p class="note">Обработка фона идёт на твоём устройстве — может нагружать слабые ПК.</p>
{/if}

<style>
	.hint {
		margin: 0 0 0.8rem;
		color: var(--fg-muted);
	}

	.preview {
		width: 100%;
		max-width: 420px;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-lg);
		border: 2px solid var(--accent);
		box-shadow: 4px 4px 0 var(--accent-dark);
		background: var(--bg-overlay);
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.preview video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scaleX(-1);
	}

	.placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		color: var(--fg-muted);
		font-weight: 600;
		text-align: center;
		padding: 1rem;
	}

	.controls {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 0.8rem;
	}

	.modes {
		display: flex;
		gap: 0.4rem;
		margin-top: 0.6rem;
		flex-wrap: wrap;
	}

	.mode {
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 700;
		cursor: pointer;
		padding: 0.45rem 0.8rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--accent);
		background: transparent;
		color: var(--accent-light);
	}

	.mode.active {
		background: var(--accent);
		color: var(--bg);
	}

	.note {
		margin: 0.5rem 0 0;
		font-size: 0.85rem;
		color: var(--fg-muted);
	}

	select {
		font-family: inherit;
		font-size: 0.95rem;
		padding: 0.5rem 0.7rem;
		border-radius: var(--radius-lg);
		border: 2px solid var(--input-border);
		background: var(--input-bg);
		color: var(--input-fg);
	}

	.btn {
		font-family: inherit;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.95rem;
		font-weight: 700;
		border-radius: var(--radius-lg);
		padding: 0.55rem 0.9rem;
		border: 2px solid var(--accent);
		background: transparent;
		color: var(--accent-light);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 4px 4px 0 var(--accent-dark);
	}

	.btn.primary {
		background: var(--accent);
		color: var(--bg);
	}

	@media (prefers-reduced-motion: reduce) {
		.btn {
			transition: none;
		}
	}
</style>
