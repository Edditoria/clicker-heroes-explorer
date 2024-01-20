import { browser } from '$app/environment';
import { keyNames } from '$lib/index.js';
import { writable } from 'svelte/store';

function newGameSaveStore() {
	const initStr = browser ? window.localStorage.getItem(keyNames.gameSaveStr) ?? '' : '';
	const { subscribe, set } = writable(initStr);

	let shortStr = '';
	const data = {};

	// Subscribe itself to trigger actions:
	subscribe((newStr) => {
		// Update decoded object:
		// TODO: Implement decodeGameSave().

		// Update shortStr:
		shortStr = newStr.length > 19 ? newStr.substring(0, 8) + '...' + newStr.slice(-8) : newStr;

		// Update localStorage:
		if (browser) {
			console.log('[GameSaveStore:subscribe] Value changed:', shortStr);
			window.localStorage.setItem(keyNames.gameSaveStr, newStr);
		}
	});

	function write(gameSaveStr) {
		set(gameSaveStr);
	}

	function remove() {
		if (browser) {
			window.localStorage.setItem(keyNames.gameSaveStr, '');
		}
		set('');
	}

	function getShortStr() {
		return shortStr;
	}

	return { subscribe, write, remove, getShortStr };
}

export const GameSaveStore = newGameSaveStore();
