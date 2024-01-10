/**
 * @typedef {Object} Rarity
 * @property {number} level Rarity level being used in the game.
 * @property {number} weight The change of rolling with a seed.
 * @property {string} name Name to display in the game.
 * */

/** @type {Rarity[]} */
export const rarities = [
	{ level: 1, weight: 5000, name: 'Common' },
	{ level: 2, weight: 2000, name: 'Uncommon' },
	{ level: 3, weight: 800, name: 'Rare' },
	{ level: 4, weight: 300, name: 'Epic' },
	{ level: 5, weight: 100, name: 'Fabled' },
	{ level: 6, weight: 25, name: 'Mythical' },
	{ level: 7, weight: 8, name: 'Legendary' },
	{ level: 8, weight: 1, name: 'Transcendent' },
];

/**
 * @param {number} seed
 * @returns {Rarity} */
export function rollRarity(seed) {
	let totalWeight = 0;
	for (let i = 0; i < rarities.length; i++) {
		totalWeight += rarities[i].weight;
	}
	const min = (seed % totalWeight) + 1;
	let val = 0;
	for (let i = 0; i < rarities.length; i++) {
		val += rarities[i].weight;
		if (val > min) {
			return rarities[i];
		}
	}
	throw new Error('rollRarity(): Unknown error.');
}
