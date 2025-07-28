<script>
	import { onMount } from "svelte";
	import { spring } from "svelte/motion";

	export let digit = 0;
	export let fontSize = 100;
	export let maxDigit = 10;

	let springValue;
	let lastSetDigit = digit;
	let rotations = 0;
	const height = fontSize;

	onMount(() => {
		springValue = spring(digit, {
			stiffness: 0.15,
			damping: 0.7,
		});
		lastSetDigit = digit;
	});

	$: if (springValue && digit !== lastSetDigit) {
		let diff = digit - lastSetDigit;

		if (diff > 5) diff -= 10;
		if (diff < -5) diff += 10;

		if (diff === 1 && lastSetDigit === 9) {
			rotations += 1;
		} else if (diff === -1 && lastSetDigit === 0) {
			rotations -= 1;
		} else if (diff === 9 && lastSetDigit === 9) {
			rotations -= 1;
		} else if (diff === -9 && lastSetDigit === 0) {
			rotations += 1;
		}

		const targetValue = digit + rotations * 10;

		springValue.set(targetValue);
		lastSetDigit = digit;
	}

	function getOpacity(animatedValue, number) {
		const effectiveValue = animatedValue - rotations * 10;
		let diff = number - effectiveValue;

		if (diff > 5) diff -= 10;
		if (diff < -5) diff += 10;

		const absDiff = Math.abs(diff);
		if (absDiff < 0.1) {
			return 1;
		} else if (absDiff < 1.1) {
			return 0.7;
		} else {
			return 0;
		}
	}

	function getTransform(animatedValue, number) {
		const effectiveValue = animatedValue - rotations * 10;
		let diff = number - effectiveValue;

		if (diff > 5) diff -= 10;
		if (diff < -5) diff += 10;

		const y = diff * height;
		const rotateX = diff * 100;
		const translateZ = -Math.abs(diff) * (height * 0.3);
		const scale = 1 - Math.abs(diff) * 0.1;
		const opacity = Math.max(0.7, 1 - Math.abs(diff) * 0.6);

		return `translateY(${y}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) scale(${scale})`;
	}
</script>

<div
	class="digit-container"
	style="
        height: ${height}px;
        width: ${height * 0.7}px;
        font-size: ${fontSize}px;
    "
>
	{#each Array(maxDigit)
		.fill(0)
		.map((_, i) => i) as number}
		{#if springValue}
			<span
				class="digit"
				style="
                    transform: {getTransform($springValue, number)};
                    opacity: {getOpacity($springValue, number)};
                "
			>
				{number}
			</span>
		{/if}
	{/each}
</div>

<style>
	.digit-container {
		position: relative;
		overflow: visible;
		perspective: 1000px;
		transform-style: preserve-3d;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.digit {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: none;
		will-change: transform, opacity;
		backface-visibility: hidden;
		transform-style: preserve-3d;
		transform-origin: center;
	}

	.digit {
		font-size: 6rem;
		color: var(--accent-light);
		font-family: var(--font-family-simple);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		text-shadow: 0 0 8px var(--shadow);
		user-select: none;
	}
</style>
