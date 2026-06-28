<script>
	let { enabled = true, threshold = 170, hiddenOpacity = 0, children } = $props();

	let wrap;
	let op = $state(1);

	// Не прячем, пока внутри что-то открыто/в фокусе (например, модалка настроек),
	// иначе уход курсора скрыл бы саму открытую панель.
	function isActive() {
		if (!wrap) return false;
		if (wrap.matches?.(":focus-within")) return true;
		return !!wrap.querySelector(
			'[aria-expanded="true"], [role="dialog"], dialog[open]',
		);
	}

	function onMove(e) {
		const t = wrap?.firstElementChild;
		if (!t) return;
		if (isActive()) {
			op = 1;
			return;
		}
		const r = t.getBoundingClientRect();
		const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
		const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
		op = Math.hypot(dx, dy) <= threshold ? 1 : hiddenOpacity;
	}

	$effect(() => {
		if (typeof window === "undefined") return;

		// На тач-устройствах курсора нет — ничего не прячем.
		const noHover = window.matchMedia("(hover: none)").matches;
		if (!enabled || noHover) {
			op = 1;
			return;
		}

		op = isActive() ? 1 : hiddenOpacity;
		window.addEventListener("mousemove", onMove);
		return () => {
			window.removeEventListener("mousemove", onMove);
			op = 1;
		};
	});
</script>

<div
	class="proximity-wrap"
	bind:this={wrap}
	style="opacity:{op}; pointer-events:{op > 0.05 ? 'auto' : 'none'}"
>
	{@render children?.()}
</div>

<style>
	.proximity-wrap {
		transition: opacity 0.35s ease;
	}

	@media (prefers-reduced-motion: reduce) {
		.proximity-wrap {
			transition: none;
		}
	}
</style>
