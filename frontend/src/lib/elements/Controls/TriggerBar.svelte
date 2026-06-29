<!--
	Группа управляющих иконок в правом верхнем углу (часы/сервер/настройки и т.п.).
	Раскладка — обычный flex-ряд: скрытие любого элемента (например, часов у не-хоста)
	схлопывает ряд без «дыр» в макете. Сами триггеры рендерятся как in-flow кнопки,
	их выпадающие панели/модалки остаются position: fixed и живут отдельно.
-->
<script>
	let { children } = $props();
</script>

<div class="trigger-bar">
	{@render children()}
</div>

<style>
	.trigger-bar {
		position: fixed;
		top: var(--trigger-edge);
		right: var(--trigger-edge);
		z-index: 1001;
		display: flex;
		align-items: center;
		gap: var(--trigger-gap);
		/* Промежутки между иконками не должны перехватывать клики по странице;
		   сами триггеры (и proximity-обёртки) включают pointer-events обратно. */
		pointer-events: none;
	}

	.trigger-bar > :global(*) {
		pointer-events: auto;
	}
</style>
