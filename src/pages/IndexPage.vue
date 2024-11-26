<template>
	<q-page id="index-page">
		<q-tabs v-model="selectedView" class="text-primary">
			<q-tab
				:name="TAB_LIVE"
				icon="sym_o_live_tv"
				:label="$t('match.live')"
				:class="{
					'text-secondary': liveMatches?.list_match.length ?? 0 > 0,
				}"
			/>
			<q-tab
				:name="TAB_COMING"
				icon="sym_o_schedule"
				:label="$t('match.scheduled')"
			/>
			<q-tab
				:name="TAB_RECENT"
				icon="sym_o_history"
				:label="$t('match.recent')"
			/>
		</q-tabs>

		<q-tab-panels v-model="selectedView" animated>
			<q-tab-panel :name="TAB_LIVE">
				<q-pull-to-refresh @refresh="onRefreshLive">
					<match-list v-if="liveMatches" :data="liveMatches" />
				</q-pull-to-refresh>
			</q-tab-panel>

			<q-tab-panel :name="TAB_COMING">
				<q-pull-to-refresh @refresh="onRefreshComing">
					<match-list v-if="comingMatches" :data="comingMatches" />
				</q-pull-to-refresh>
			</q-tab-panel>

			<q-tab-panel :name="TAB_RECENT">
				<q-pull-to-refresh @refresh="onRefreshRecent">
					<match-list v-if="recentMatches" :data="recentMatches" />
				</q-pull-to-refresh>
			</q-tab-panel>
		</q-tab-panels>
	</q-page>
</template>

<script setup lang="ts">
import matchList from '../components/MatchList.vue';

import { onBeforeMount, ref, watch } from 'vue';
import { useGlobalStore } from 'src/stores/global';
import { useI18n } from 'vue-i18n';
import MatchListInfo from 'src/interfaces/MatchListInfo';
import API from 'src/enums/API';
import MatchInfo from 'src/interfaces/MatchInfo';

const POLLING_START_DELAY = 1 * 60 * 60 * 1000; // One hour
const POLLING_INTERVAL = 60 * 1000; // One minute

const global = useGlobalStore();
const i18n = useI18n();

const TAB_LIVE = 'live';
const TAB_COMING = 'coming';
const TAB_RECENT = 'recent';

global.setPath([]);

defineOptions({
	name: 'IndexPage',
});

const selectedView = ref(TAB_COMING);
const liveMatches = ref<MatchListInfo | undefined>(undefined);
const comingMatches = ref<MatchListInfo | undefined>(undefined);
const recentMatches = ref<MatchListInfo | undefined>(undefined);

let livePollingInterval: NodeJS.Timeout | undefined;

type DoneFunction = () => void;

function checkLivePolling() {
	let hasLive = liveMatches.value?.list_match.length ?? 0 > 0;

	if (!hasLive) {
		const dates = Array.from(
			comingMatches.value?.list_match
				.reduce(
					(dates: Set<string>, match: MatchInfo) => dates.add(match.date),
					new Set<string>()
				)
				.keys() ?? []
		);

		const pollingStart = new Date().getTime() + POLLING_START_DELAY;

		hasLive = dates.some(
			(d) => global.date(d, '9:00').getTime() < pollingStart
		);
	}

	if (hasLive) {
		livePollingInterval = setInterval(onPolling, POLLING_INTERVAL);
	} else if (livePollingInterval) {
		clearInterval(livePollingInterval);
		livePollingInterval = undefined;
	}
}

async function onPolling() {
	const previousLive = liveMatches.value?.list_match ?? [];

	await onRefreshLive();

	let refreshComing = false;

	// Check started matches
	liveMatches.value?.list_match.forEach((match) => {
		if (!previousLive.find((previous) => previous.id === match.id)) {
			refreshComing = true;
			global.notify({
				message: i18n.t('match.matchStarted'),
				caption: `${match.team_home_name} vs. ${match.team_away_name}`,
			});
		}
	});

	if (refreshComing) {
		await onRefreshComing();
	}

	// Check if any matches have ended
	let refreshRecent = false;

	previousLive.forEach((previous) => {
		if (
			!liveMatches.value?.list_match.find(
				(match) => match.id === previous.id
			)
		) {
			refreshRecent = true;
			global.notify({
				message: i18n.t('match.matchEnded'),
				caption: `${previous.team_home_name} vs. ${previous.team_away_name}`,
			});
		}
	});

	if (refreshRecent) {
		await onRefreshRecent();
	}
}

async function onRefreshLive(done?: DoneFunction) {
	liveMatches.value = await global.loadData<MatchListInfo>(
		'live-matches',
		API.MATCH_LIST,
		{ command: 'live' },
		true
	);

	checkLivePolling();

	if (done) {
		done();
	}
}

async function onRefreshComing(done?: DoneFunction) {
	comingMatches.value = await global.loadData<MatchListInfo>(
		'coming-matches',
		API.MATCH_LIST,
		{ command: 'next' },
		true
	);

	checkLivePolling();

	if (done) {
		done();
	}
}

async function onRefreshRecent(done?: DoneFunction) {
	recentMatches.value = await global.loadData<MatchListInfo>(
		'recent-matches',
		API.MATCH_LIST,
		{ command: 'played' },
		true
	);

	if (done) {
		done();
	}
}

onBeforeMount(async () => {
	await onRefreshLive();

	await onRefreshComing();

	await onRefreshRecent();

	if (global.selectedView === undefined) {
		if (liveMatches.value!.list_match.length > 0) {
			selectedView.value = TAB_LIVE;
		} else if (
			liveMatches.value!.list_match.length === 0 &&
			comingMatches.value!.list_match.length === 0
		) {
			selectedView.value = TAB_RECENT;
		} else {
			selectedView.value = TAB_COMING;
		}
	} else {
		selectedView.value = global.selectedView;
	}
});

watch(
	() => selectedView.value,
	() => (global.selectedView = selectedView.value)
);
</script>
