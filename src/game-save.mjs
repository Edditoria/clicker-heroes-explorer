import { inflateSync, strFromU8 } from 'fflate';
import { base64ToBytes } from './utils.mjs';

/** @typedef {string} GameSaveStr The game save exported from Clicker Heroes game. */

/** @typedef {string} JsonStr A stringified JSON, or a string supposed to parse to JSON object. Please note that the string may not pass `JSON.parse()`. Therefore, you need to test it manually. */

/**
 * The algo type used in a game save. Act as an enum member.
 * @see {@link AlgoEnums}.
 * @typedef {Object} Algo
 * @property {string} Name
 * @property {string} Hash
 */

/**
 * Collection of algos. You may want to freeze this object by yourself.
 * @readonly
 * @enum {Algo}
 */
export const AlgoEnums = {
	Zlib: {
		Name: 'zlib',
		Hash: '7a990d405d2c6fb93aa8fbb0ec1a3b23',
	},
	Deflect: {
		Name: 'deflect',
		Hash: '7e8bb5a89f2842ac4af01b3b7e228592',
	},
	Lagacy: {
		Name: 'lagacy',
		Hash: 'Fe12NAfA3R6z4k0z', // Commonly known as "anti cheat code".
	},
};

/**
 * It is only guessing by search string.
 * It does not guarantee that the game save is valid.
 * @param {GameSaveStr} gameSaveStr
 * @returns {Algo}
 * @throws Unknown algo type.
 */
export function guessGameSaveAlgo(gameSaveStr) {
	const head = gameSaveStr.substring(0, 32);
	if (head === AlgoEnums.Zlib.Hash) {
		return AlgoEnums.Zlib;
	}
	if (head === AlgoEnums.Deflect.Hash) {
		return AlgoEnums.Deflect;
	}
	if (gameSaveStr.includes(AlgoEnums.Lagacy.Hash)) {
		return AlgoEnums.Lagacy;
	}
	// Else:
	throw new Error('Unknown algo type. First 32 characters: ' + head);
}

/**
 * @todo Implement zlib decoding.
 * @todo Implement lagacy decoding.
 * @param {GameSaveStr} gameSaveStr
 * @returns {JsonStr}
 * @throws Fail to decode the game save, or not support the algo.
 */
export function decodeGameSave(gameSaveStr) {
	const algo = guessGameSaveAlgo(gameSaveStr);
	// console.log(algo);
	if (algo.Name === 'zlib') {
		throw new Error('Not support zlib decoding, yet. Please rise an issue on Github repo.');
	}
	if (algo.Name === 'deflect') {
		const gameSaveU8A = base64ToBytes(gameSaveStr.substring(32));
		const decodedU8A = inflateSync(gameSaveU8A);
		return strFromU8(decodedU8A);
	}
	if (algo.Name === 'lagacy') {
		throw new Error('Not support lagacy decoding, yet. Please rise an issue on Github repo.');
	}
	// Else:
	throw new Error('Unknown error.'); // It's unkonwn because guessGameSaveAlgo() should throw error at the first place.
}
