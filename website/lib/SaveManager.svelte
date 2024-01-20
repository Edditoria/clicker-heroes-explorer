<script>
	import { onMount } from 'svelte';
	import { keyNames } from '$lib/index.js';
	import { GameSaveStore } from '$lib/stores';

	let textareaCtn = '';

	function update() {
		// TODO: If no change on textarea, prompt message on UI.
		GameSaveStore.write(textareaCtn);
	}

	function remove() {
		GameSaveStore.remove();
		console.log('[SaveManager:remove] Removed.', GameSaveStore.getShortStr());
	}

	onMount(() => {
		GameSaveStore.subscribe(() => {
			textareaCtn = localStorage.getItem(keyNames.gameSaveStr) || '';
		});
		// Expected that change in another browser/tab will update the textarea.
		window.addEventListener('storage', (evt) => {
			textareaCtn = evt.newValue || '';
		});
	});
</script>

<textarea name="gameSaveTextarea" id="gameSaveTextarea" rows="10" placeholder="Paste your game save to process..." bind:value={textareaCtn} />
<div class="grid">
	<button on:click={update}>Update</button>
	<button class="secondary" on:click={remove}>Remove</button>
</div>
