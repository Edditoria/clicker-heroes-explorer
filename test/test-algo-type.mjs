import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import { guessGameSaveAlgo, AlgoEnums } from '../src/game-save.mjs';
import { lagacyGameSave1, lagacyGameSave2 } from './mock-data/lagacy-game-saves.mjs';
import { myGameSave1 } from './mock-data/my-game-saves.mjs';

describe('guessGameSaveAlgo', () => {
	it('should be lagacy', () => {
		const a1 = guessGameSaveAlgo(lagacyGameSave1);
		// console.log(a1);
		deepStrictEqual(a1, AlgoEnums.Lagacy);
		const a2 = guessGameSaveAlgo(lagacyGameSave2);
		// console.log(a2);
		deepStrictEqual(a2, AlgoEnums.Lagacy);
	});
	it('should be deflect', () => {
		const a1 = guessGameSaveAlgo(myGameSave1);
		// console.log(a3);
		deepStrictEqual(a1, AlgoEnums.Deflect);
	});
});
