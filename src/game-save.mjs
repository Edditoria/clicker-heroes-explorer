/** @typedef {string} GameSaveStr The game save exported from Clicker Heroes game. */

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
