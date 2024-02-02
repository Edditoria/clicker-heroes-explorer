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

	/** TODO: Verify Hero Souls (1), Gold (2) */
	const bonuses = [
		{ assetId: 1, shortName: 'Hero Souls' },
		{ assetId: 2, shortName: 'Gold' },
		{ assetId: 3, shortName: 'Rubies' },
		{ assetId: 4, shortName: 'Skills' },
		{ assetId: 5, shortName: 'Extra Lives' },
		{ assetId: 6, shortName: 'Recruit Speed' },
	];

	/** TODO: Verify position: Relic */
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

	function updateQuestStatus(merc) {
		if (merc.lastQuestRewardType === 0) {
			return { startedSecAgo: -1, status: 'Idle', action: 'Start a quest', countDownSec: 0 }; // Early.
		}
		/** @type {number} */
		const completeTimestamp = merc.lastQuestStartTime + merc.lastQuestDuration * 1000;
		const nowTimestamp = new Date().getTime();
		/** Time to die after quest. Merc is already dead during quest if negative */
		const updatedTimeToDie = merc.timeToDie - merc.lastQuestDuration;
		const startedSecAgo = Math.floor((nowTimestamp - merc.lastQuestStartTime) / 1000);

		if (updatedTimeToDie > 0) {
			// Will survive and complete the quest:
			const countDownSec = Math.floor((completeTimestamp - nowTimestamp) / 1000);
			if (nowTimestamp < completeTimestamp) {
				// Still in quest:
				return { startedSecAgo, status: 'Way to complete', action: formatTimeInterval(countDownSec), countDownSec };
			} else {
				// Quest completed successfully:
				return { startedSecAgo, status: 'Completed', action: 'Collect reward', countDownSec };
			}
		} else {
			// Die during quest:
			const countDownSec = Math.floor((merc.lastQuestStartTime + merc.timeToDie * 1000 - nowTimestamp) / 1000);
			if (nowTimestamp < completeTimestamp) {
				// Still in quest:
				return { startedSecAgo, status: 'Prepare to die', action: formatTimeInterval(countDownSec), countDownSec };
			} else {
				// Already dead:
				return { startedSecAgo, status: 'Failed', action: 'Revive or bury', countDownSec };
			}
		}
	}

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
			<th>Mercenary</th><th>Action</th><th>Reward</th><th>Quest</th><th>Life</th>
		</thead>
		<tbody>
			{#each sortedMercs as merc}
				{@const questStatus = updateQuestStatus(merc)}
				<tr>
					<td>
						{merc.name}<br />
						{getMercenaryLevelInfo(merc.level).rank}<br />
						{getRarityName(merc.rarity)}<br />
						Bonus: +{bonuses[merc.statId - 1].shortName}
						<hr />
						Level: {merc.level} ({Math.floor(merc.experience * 100)}%)<br />
						<progress value={merc.experience} max="1"></progress>
					</td>
					<td>
						{#if questStatus.status === 'Idle'}
							Start a quest
						{:else if questStatus.status === 'Completed'}
							{questStatus.action}
							<hr />
							{questStatus.status}<br />
							<span data-tooltip={new Date(merc.lastQuestStartTime + merc.lastQuestDuration * 1000).toLocaleString('sv')}>
								{formatTimeInterval(questStatus.countDownSec * -1)} ago
							</span>
						{:else if questStatus.status === 'Failed'}
							{questStatus.action}<br />
							<hr />
							{questStatus.status}<br />
							<span data-tooltip={new Date(merc.lastQuestStartTime + merc.timeToDie * 1000).toLocaleString('sv')}>
								{formatTimeInterval(questStatus.countDownSec * -1)} ago
							</span>
							<hr />
							Time-to-complete: {formatTimeInterval(merc.lastQuestDuration - merc.timeToDie)}<br />
							Completion rate: {Math.floor((merc.timeToDie / merc.lastQuestDuration) * 100)}%
						{:else if questStatus.status === 'Way to complete'}
							{questStatus.status}:
							<span data-tooltip={new Date(merc.lastQuestStartTime + merc.lastQuestDuration * 1000).toLocaleString('sv')}>
								{formatTimeInterval(questStatus.countDownSec)} later
							</span>
						{:else if questStatus.status === 'Prepare to die'}
							To die:
							<span data-tooltip={new Date(merc.lastQuestStartTime + merc.timeToDie * 1000).toLocaleString('sv')}>
								{formatTimeInterval(questStatus.countDownSec)} later
							</span><br />
							Time-to-complete: {formatTimeInterval(merc.lastQuestDuration - merc.timeToDie)}<br />
							Completion rate: {Math.floor((merc.timeToDie / merc.lastQuestDuration) * 100)}%
						{:else}
							{questStatus.status}<br />
							{questStatus.action}
						{/if}
					</td>
					<td>
						{questTypes[merc.lastQuestRewardType].singular}
					</td>
					<td>
						{#if questStatus.status === 'Idle'}
							No Quest
						{:else}
							Duration: {formatTimeInterval(merc.lastQuestDuration)}<br />
							Started:
							<span data-tooltip={new Date(merc.lastQuestStartTime).toLocaleString('sv')}>
								{formatTimeInterval(questStatus.startedSecAgo)} ago
							</span>
						{/if}
					</td>
					<td>
						Born:
						<span data-tooltip={new Date(merc.createTime).toLocaleString('sv')}>
							{formatTimeInterval(Math.floor((new Date().getTime() - merc.createTime) / 1000))} ago
						</span><br />
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
