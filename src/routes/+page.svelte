<script>
  import { onMount } from 'svelte';
  import { ParticleSystem } from '$lib/components/Particales';

  let canvas;
  let particleSystem;

  onMount(() => {
    particleSystem = new ParticleSystem(canvas);
    particleSystem.start();
  });

  function toggle() {
    particleSystem.toggleEmission();
  }
</script>
