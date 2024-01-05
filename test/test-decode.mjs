import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import { decodeGameSave } from '../src/game-save.mjs';
import { myGameSave1 } from './mock-data/my-game-saves.mjs';

describe('decodeGameSave', () => {
	it('should returns good object', () => {
		const expected = {
			isBanned: false,
			skillDouble: false,
			lastPrimalLevelResult: false,
			transcendent: false,
			hasSeenZone100Tip: false,
		};
		const decoded = decodeGameSave(myGameSave1);
		const decodedObj = JSON.parse(decoded);
		// TODO: Better test?
		const actual = {
			isBanned: decodedObj.isBanned,
			skillDouble: decodedObj.skillDouble,
			lastPrimalLevelResult: decodedObj.lastPrimalLevelResult,
			transcendent: decodedObj.transcendent,
			hasSeenZone100Tip: decodedObj.hasSeenZone100Tip,
		};
		// console.log(actual);
		deepStrictEqual(actual, expected);
	});
});
