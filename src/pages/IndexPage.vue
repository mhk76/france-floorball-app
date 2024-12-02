<template>
	<q-page id="indexPage">
		<q-tabs v-model="selectedView" class="textPrimary">
			<q-tab
				:name="TAB_LIVE"
				icon="sym_o_live_tv"
				:label="$t('match.live')"
				:class="{
					'text-secondary': liveMatches?.matches.length ?? 0 > 0,
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
					<ListMatches v-if="liveMatches" :data="liveMatches" />
				</q-pull-to-refresh>
			</q-tab-panel>

			<q-tab-panel :name="TAB_COMING">
				<q-pull-to-refresh @refresh="onRefreshComing">
					<ListMatches v-if="comingMatches" :data="comingMatches" />
				</q-pull-to-refresh>
			</q-tab-panel>

			<q-tab-panel :name="TAB_RECENT">
				<q-pull-to-refresh @refresh="onRefreshRecent">
					<ListMatches v-if="recentMatches" :data="recentMatches" />
				</q-pull-to-refresh>
			</q-tab-panel>
		</q-tab-panels>
	</q-page>
</template>

<script setup lang="ts">
import ListMatches from '../components/ListMatches.vue';

import { onBeforeMount, ref, watch } from 'vue';
import { useSelectionStore } from 'src/stores/selectionStore';
import { useGlobalStore } from 'src/stores/globalStore';
import { useI18n } from 'vue-i18n';
import {
	useComingMatches,
	useLiveMatches,
	useRecentMatches,
} from 'src/composables/useMatchLists';
import MatchListInfo from 'src/models/MatchListInfo';
import MatchInfo from 'src/models/MatchInfo';

const POLLING_START_DELAY = 1 * 60 * 60 * 1000; // One hour
const POLLING_INTERVAL = 60 * 1000; // One minute
const SELECTED_VIEW_KEY = 'frontpage-view';

const selection = useSelectionStore();
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
	let hasLive = liveMatches.value?.matches.length ?? 0 > 0;

	if (!hasLive) {
		const dates = Array.from(
			comingMatches.value?.matches
				.reduce(
					(dates: Set<Date>, match: MatchInfo) => dates.add(match.date),
					new Set<Date>()
				)
				.keys() ?? []
		);

		const pollingStart = new Date().getTime() + POLLING_START_DELAY;

		hasLive = dates.some((date) => date.getTime() < pollingStart);
	}

	if (hasLive) {
		livePollingInterval = setInterval(onPolling, POLLING_INTERVAL);
	} else if (livePollingInterval) {
		clearInterval(livePollingInterval);
		livePollingInterval = undefined;
	}
}

async function onPolling() {
	const previousLive = liveMatches.value?.matches ?? [];

	await onRefreshLive();

	let refreshComing = false;

	// Check started matches
	liveMatches.value?.matches.forEach((match) => {
		if (!previousLive.find((previous) => previous.id === match.id)) {
			refreshComing = true;
			global.notify({
				message: i18n.t('match.matchStarted'),
				caption: `${match.homeTeamName} vs. ${match.awayTeamName}`,
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
			!liveMatches.value?.matches.find((match) => match.id === previous.id)
		) {
			refreshRecent = true;
			global.notify({
				message: i18n.t('match.matchEnded'),
				caption: `${previous.homeTeamName} vs. ${previous.awayTeamName}`,
			});
		}
	});

	if (refreshRecent) {
		await onRefreshRecent();
	}
}

async function onRefreshLive(done?: DoneFunction) {
	liveMatches.value = await useLiveMatches();

	checkLivePolling();

	if (done) {
		done();
	}
}

async function onRefreshComing(done?: DoneFunction) {
	comingMatches.value = await useComingMatches();

	checkLivePolling();

	if (done) {
		done();
	}
}

async function onRefreshRecent(done?: DoneFunction) {
	recentMatches.value = await useRecentMatches();

	if (done) {
		done();
	}
}

onBeforeMount(async () => {
	await onRefreshLive();

	await onRefreshComing();

	await onRefreshRecent();

	if (selection.get(SELECTED_VIEW_KEY) === undefined) {
		if (liveMatches.value!.matches.length > 0) {
			selectedView.value = TAB_LIVE;
		} else if (
			liveMatches.value!.matches.length === 0 &&
			comingMatches.value!.matches.length === 0
		) {
			selectedView.value = TAB_RECENT;
		} else {
			selectedView.value = TAB_COMING;
		}
	} else {
		selectedView.value = selection.get(SELECTED_VIEW_KEY) as string;
	}
});

watch(
	() => selectedView.value,
	() => {
		selection.set(SELECTED_VIEW_KEY, selectedView.value);
	}
);
</script>
