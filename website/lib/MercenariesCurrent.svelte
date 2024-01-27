<script>
	import { GameSaveStore } from '$lib/stores';
	import { rarities } from '$che/rarity.mjs';

	/**
	 * TODO: Move to rarity.mjs. But, as an API, need to throw error for edge cases.
	 * @param {number} level The value of "rarity" in the game save.
	 */
	function getRarityName(level) {
		return rarities[level - 1].name;
	}

	/**
	 * Ref: https://clickerheroes.fandom.com/wiki/Mercenaries#Leveling_Up
	 * TODO: Move to mercenary.mjs. But, as an API, need to throw error for edge cases.
	 * @param {number} level The value of "mercenaries['x'].level" in the game save.
	 */
	function getMercenaryLevelInfo(level) {
		const mercenaryRanks = ['Noob', 'Rookie', 'Journeyman', 'Expert', 'Master', 'Grandmaster', 'Legend', 'Demigod']; // And continue...;
		let rankName;
		const len = mercenaryRanks.length;
		if (level < len) {
			// E.g. Level 8: Demigod
			rankName = mercenaryRanks[level - 1];
		} else {
			// E.g. Level 9: Demigod + 1
			rankName = `${mercenaryRanks[len - 1]} + ${level - len}`;
		}
		return {
			level: level,
			rank: rankName,
		};
	}

	/** TODO: Verify position: Gold, Relic */
	const questTypes = [
		{ singular: '', plural: '' },
		{ singular: 'New Mercenary', plural: 'New Mercenaries' },
		{ singular: 'Gold', plural: 'Gold' },
		{ singular: 'Hero Soul', plural: 'Hero Soul' },
		{ singular: 'Relic', plural: 'Relics' },
		{ singular: 'Skill Activation', plural: 'Skills Activation' },
		{ singular: 'Ruby', plural: 'Rubies' },
		{ singular: 'Clickmas Present', plural: 'Clickmas Presents' },
	];

	/** @param {number} sec */
	function formatTimeInterval(sec) {
		const d = Math.floor(sec / 86400);
		const h = Math.floor(sec / 3600) % 24;
		const m = Math.ceil(sec / 60) % 60;
		return `${d} d ${h} h ${m} m`;
	}

	function sortMercs(mercsInSave) {
		return Object.values(mercsInSave).sort((a, b) => b.level - a.level);
	}

	$: saveTimestamp = $GameSaveStore.data.unixTimestamp; // Or prevLoginTimestamp?
	$: console.log('Save time:', new Date(saveTimestamp).toLocaleString('sv'));
	$: shouldShowTable = $GameSaveStore.data.hasOwnProperty('mercenaries') && $GameSaveStore.data.mercenaries.hasOwnProperty('mercenaries');
	$: sortedMercs = shouldShowTable && sortMercs($GameSaveStore.data.mercenaries.mercenaries);
	$: console.log('sortedMercs:', sortedMercs);
</script>

<h2>Mercenaries</h2>

{#if shouldShowTable}
	<table>
		<thead>
			<th>Slot</th><th>Info</th><th>Quest</th><th>Life</th>
		</thead>
		<tbody>
			{#each sortedMercs as merc}
				<tr>
					<td>{+merc.slotId + 1}</td>
					<td>
						{merc.name}<br />
						{getMercenaryLevelInfo(merc.level).rank} (Lvl {merc.level})<br />
						{getRarityName(merc.rarity)}
					</td>
					<td>
						{#if merc.lastQuestRewardType > 0}
							Type: {questTypes[merc.lastQuestRewardType].singular}<br />
							Duration: {formatTimeInterval(merc.lastQuestDuration)}<br />
							Start: {new Date(merc.lastQuestStartTime).toLocaleString('sv')}
							<hr />
							{#if merc.timeToDie - merc.lastQuestDuration > 0}
								Complete: {new Date(merc.lastQuestStartTime + merc.lastQuestDuration * 1000).toLocaleString('sv')}
							{:else}
								Die: {new Date(merc.lastQuestStartTime + merc.timeToDie * 1000).toLocaleString('sv')}<br />
								Time-to-complete: {formatTimeInterval(merc.lastQuestDuration - merc.timeToDie)}<br />
								Completion rate: {Math.floor((merc.timeToDie / merc.lastQuestDuration) * 100)}%
							{/if}
						{:else}
							No Quest
						{/if}
					</td>
					<td>
						Born: {new Date(merc.createTime).toLocaleString('sv')}<br />
						Remaining: {formatTimeInterval(merc.timeToDie)} (pre-quest)
						<hr />
						Remaining: {formatTimeInterval(merc.timeToDie - merc.lastQuestDuration)} (post-quest)
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{:else}
	<p>Waiting for data...</p>
{/if}
