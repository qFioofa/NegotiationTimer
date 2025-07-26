<script>
	import { GlobalConfig, IntroGuideVisiable } from "$lib/stores/parameters";
	import IntroContent from "./Intro/IntroContent.svelte";
	import { fade, scale } from "svelte/transition";
	import Actions from "./Intro/Actions.svelte";
	import { writable } from "svelte/store";

	export let headerText;

	function close() {
		IntroGuideVisiable.set(false);
	}

	function closeForever() {
		IntroGuideVisiable.set(false);
		GlobalConfig.set("introGuide", false);
	}
</script>

{#if $IntroGuideVisiable}
	<div class="intro-overlay" transition:fade>
		<div class="intro-modal" transition:scale={{ duration: 200 }}>
			{#if headerText}
				<div class="intro-header">
					<h2>{headerText}</h2>
				</div>
			{/if}
			<IntroContent />
			<Actions
				forgetText="Закрыть и больше не показывать"
				closeText="Закрыть"
				{closeForever}
				onClose={close}
			/>
		</div>
	</div>
{/if}

<style>
	.intro-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.65);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(6px);
	}

	.intro-modal {
		background: var(--bg);
		border: 1px solid var(--accent);
		border-radius: 16px;
		padding: 2.5rem;
		width: 640px;
		max-width: 90vw;
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
		box-shadow: 0 0 24px rgba(0, 0, 0, 0.3);
		overflow: hidden;
	}

	.intro-header h2 {
		color: var(--accent);
		font-size: 2rem;
		margin: 0;
	}
</style>
