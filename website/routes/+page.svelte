<script>
	import { appName, appDesc } from '$lib/index.js';
	import SaveManager from '$lib/SaveManager.svelte';
</script>

<header class="container">
	<h1>{appName}</h1>

	<p>{appDesc}</p>
</header>

<main class="container">
	<div>
		<SaveManager />
	</div>
</main>
