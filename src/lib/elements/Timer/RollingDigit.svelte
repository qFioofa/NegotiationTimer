<script>
	import { spring } from "svelte/motion";
	import { onMount } from "svelte";

	export let digit = 0;
	export let height = 72;

	// Используем spring для плавной анимации
	const y = spring(digit * -height, {
		stiffness: 0.3,
		damping: 0.5,
	});

	// Обновляем позицию при изменении цифры
	$: y.set(digit * -height);
</script>

<div class="digit" style="height: {height}px">
	<div class="stack" style="transform: translateY({$y}px)">
		{#each Array(10) as _, i}
			<span class="digit-item" style="height: {height}px">{i}</span>
		{/each}
	</div>
</div>

<style>
	.digit {
		overflow: hidden;
		width: 1ch;
		position: relative;
	}

	.stack {
		display: flex;
		flex-direction: column;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.digit-item {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: inherit;
		font-weight: 700;
		color: var(--accent-light);
		user-select: none;
	}
</style>
