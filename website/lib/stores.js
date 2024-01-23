import { browser } from '$app/environment';
import { keyNames } from '$lib/index.js';
import { writable } from 'svelte/store';
import { decodeGameSave } from '$che/game-save.mjs';

/** @typedef {string} GameSaveCode Expects the game-save exported from the game, but user may provide other things. */
/** @typedef {string} GameSaveShortCode Shorten version of {@link GameSaveCode} for UI and messages. */
/** @typedef {Record<string, string|number|Object>} GameSaveData An object decoded from {@link GameSaveCode}. */

/**
 * @typedef {Object} GameSaveStoreData
 * @property {GameSaveCode} code Should be a valid save.
 * @property {GameSaveShortCode} shortCode
 * @property {GameSaveData} data
 */

/**
 * @param {GameSaveCode} gameSaveCode
 * @returns {GameSaveShortCode}
 */
function shortenCode(gameSaveCode) {
	if (gameSaveCode.length > 19) {
		return gameSaveCode.substring(0, 8) + '...' + gameSaveCode.slice(-8);
	} else {
		return gameSaveCode;
	}
}

function newGameSaveStore() {
	/** @returns {GameSaveStoreData} Empty object for the store. */
	function createEmpty() {
		return { code: '', shortCode: '', data: {} };
	}

	/** @returns {GameSaveStoreData} Initiate a VALID object for the store. */
	function init() {
		let code = browser ? window.localStorage.getItem(keyNames.gameSaveStr) ?? '' : '';
		code = code.trim();

		if (code === '') {
			return createEmpty();
		}
		try {
			const shortCode = shortenCode(code);
			const decoded = decodeGameSave(code);
			const data = JSON.parse(decoded);
			return { code, shortCode, data };
		} catch (error) {
			console.error('[GameSaveStore:init] Error in localStorage:', error);
			return createEmpty();
		}
	}

	const { subscribe, set } = writable(init());

	// Subscribe itself to update localStorage:
	subscribe((updatedObj) => {
		if (browser) {
			console.log('[GameSaveStore:subscribe] Value changed:', updatedObj.shortCode);
			window.localStorage.setItem(keyNames.gameSaveStr, updatedObj.code);
		}
	});

	/** @param {GameSaveCode} gameSaveCode */
	function write(gameSaveCode) {
		if (typeof gameSaveCode !== 'string') {
			// TODO: Notify error on UI?
			console.error('[GameSaveStore:write] Input not a string.');
			return;
		}
		try {
			const code = gameSaveCode.trim();
			const decoded = decodeGameSave(code);
			const data = JSON.parse(decoded);
			const shortCode = shortenCode(code);
			set({ code, data, shortCode });
		} catch (error) {
			// TODO: Notify error on UI?
			console.error('[GameSaveStore:write]', error);
		}
	}

	function remove() {
		if (browser) {
			window.localStorage.setItem(keyNames.gameSaveStr, '');
		}
		set(createEmpty());
	}

	return { subscribe, write, remove };
}

export const GameSaveStore = newGameSaveStore();
