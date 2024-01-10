import { rollRarity } from './rarity.mjs';
import { minStdRand0 } from './utils.mjs';

export class Merc {
	#seed = {
		rarity: 0,
		gender: 0,
		name: 0,
		phrase2: 0,
		statId: 0,
		timeToDie: 0,
	};
	#createdVia = '';

	rarity = NaN;
	timeToDie = NaN;
	createTime = NaN;
	name = '';
	phrase2 = '';
	roller = {
		seed: 0,
	};

	constructor({ rarity, timeToDie, createTime, name, phrase2, roller }) {
		const rollerSeed = roller.seed;
		this.rarity = rarity;
		this.timeToDie = timeToDie;
		this.createTime = createTime;
		this.name = name;
		this.phrase2 = phrase2;
		this.roller.seed = rollerSeed;
		this.#createdVia = 'constructor';
	}

	/**
	 * Create new merc using a seed.
	 * @param {number} mercRollerSeed Expect the value of the key "mercenaries.mercRoller.seed" in the game save.
	 */
	static plant(mercRollerSeed) {
		/** To becomes #seed in the class. */
		const seed = {};
		/** Each property becomes the property in the class. */
		const data = {};
		seed.gender = minStdRand0(mercRollerSeed);
		// No need gender in data.
		seed.name = minStdRand0(seed.gender);
		data.name = ''; // TODO: Generate name?
		seed.phrase2 = minStdRand0(seed.name);
		data.phrase2 = ''; // TODO: Generate death phrase?
		seed.rarity = minStdRand0(seed.phrase2);
		data.rarity = rollRarity(seed.rarity).level;
		seed.statId = minStdRand0(seed.rarity);
		// TODO: Generate statId? (Remember +1)
		// Reroll if statId is 4 (Lives) and rarity is 1 or 2:
		while (seed.statId % 6 === 4 && data.rarity < 3) {
			seed.statId = minStdRand0(seed.statId);
		}
		seed.timeToDie = minStdRand0(seed.statId);
		data.timeToDie = NaN; // TODO: Gen timeToDie!
		const latestSeed = seed.timeToDie;
		data.createTime = NaN; // TODO: Gen createTime!
		data.roller = {};
		data.roller.seed = latestSeed;
		const m = new Merc(data);
		m.#seed = seed;
		m.#createdVia = 'plant';
		return m;
	}

	get createdVia() {
		return this.#createdVia;
	}
	get seed() {
		return this.#seed;
	}
}
