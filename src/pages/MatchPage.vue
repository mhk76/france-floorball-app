<template>
	<q-page id="matchPage" v-if="match">
		<div class="date-info">
			<span class="time">
				{{ $d(match.date, 'datetime') }}
			</span>
			<span v-if="match.isLive" class="live">
				<q-icon name="sym_o_live_tv" />
				{{ $t('match.live') }}
			</span>
			<span v-else-if="match.isFinished" class="history">
				<q-icon name="sym_o_history" />
				{{ $t('match.played') }}
			</span>
			<span v-else>
				<q-icon name="sym_o_scheduled" class="scheduled" />
				{{ $t('match.scheduled') }}
			</span>
			<span class="tournament">
				{{ match.tournamentName }}
			</span>
		</div>

		<q-card class="team-score">
			<div class="team">
				<img :src="match.homeTeamLogo!" />
				<div class="name">
					{{ match.homeTeamName }}
				</div>
				<div class="score" v-if="match.isFinished || match.isStarted">
					{{ finalScore[0] }}
				</div>
			</div>
			<div class="team">
				<img :src="match.awayTeamLogo!" />
				<div class="name">
					{{ match.awayTeamName }}
				</div>
				<div class="score" v-if="match.isFinished || match.isStarted">
					{{ finalScore[1] }}
				</div>
			</div>
		</q-card>

		<div class="venue">
			<q-icon name="sym_o_location_on" size="sm" />
			{{ match.description }}
			{{ match.venueName }}
		</div>

		<div class="referees" v-if="referees?.length ?? 0 > 0">
			<q-icon name="sym_o_sports" size="md" />
			<span v-for="referee in referees" :key="referee.id">
				{{ referee.name }}
			</span>
		</div>

		<q-tabs v-model="selectedView" class="textPrimary">
			<q-tab
				:name="TAB_EVENTS"
				icon="sym_o_sports_hockey"
				:label="$t('match.events')"
			/>
			<q-tab
				:name="TAB_PLAYERS"
				icon="sym_o_groups"
				:label="$t('match.players')"
			/>
		</q-tabs>

		<q-tab-panels v-model="selectedView" animated>
			<q-tab-panel :name="TAB_EVENTS" swipeable>
				<ListMatchEvents
					:match="match"
					:events="events"
					:periods="periods"
				/>
			</q-tab-panel>
			<q-tab-panel :name="TAB_PLAYERS" swipeable>
				<ListPlayers
					:team-name="match.homeTeamName"
					:team-logo="match.homeTeamLogo"
					:players="players?.get('home') ?? []"
					:officials="officials?.get('home') ?? []"
				/>
				&nbsp;
				<ListPlayers
					:team-name="match.awayTeamName"
					:team-logo="match.awayTeamLogo"
					:players="players?.get('away') ?? []"
					:officials="officials?.get('away') ?? []"
				/>
			</q-tab-panel>
		</q-tab-panels>
	</q-page>
</template>

<script setup lang="ts">
import ListMatchEvents from '../components/ListMatchEvents.vue';
import ListPlayers from '../components/ListPlayers.vue';

import { computed, nextTick, onBeforeMount, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDataStore } from 'src/stores/dataStore';
import { useGlobalStore } from 'src/stores/globalStore';
import {
	useMatch,
	useMatchEvents,
	useMatchOfficials,
	useMatchPlayers,
	useMatchReferees,
} from 'src/composables/useMatches';
import MatchInfo from 'src/models/MatchInfo';
import MatchEventInfo from 'src/models/MatchEventInfo';
import MatchRefereeInfo from 'src/models/MatchRefereeInfo';
import MatchPlayerInfo from 'src/models/MatchPlayerInfo';
import MatchOfficialInfo from 'src/models/MatchOfficialInfo';
import { EVENT_TYPE } from 'src/definitions/EventType';

const LIVE_POLLING_START = 5 * 60 * 1000; // five minutes
const LIVE_INTERVAL = 10 * 1000; // 30 seconds
const TAB_EVENTS = 'events';
const TAB_PLAYERS = 'players';

const route = useRoute();
const i18n = useI18n();
const data = useDataStore();
const global = useGlobalStore();

const matchId = parseInt(route.params.id as string, 10);
const tournamentId = parseInt(route.params.tournamentId as string, 10);

const match = ref<MatchInfo>();
const events = ref<MatchEventInfo[]>([]);
const referees = ref<MatchRefereeInfo[]>([]);
const officials = ref<Map<string, MatchOfficialInfo[]>>();
const players = ref<Map<string, MatchPlayerInfo[]>>();
const selectedView = ref(TAB_EVENTS);

let livePollingTimeout: NodeJS.Timeout | undefined;
let livePollingInterval: NodeJS.Timeout | undefined;

const periods = computed(() =>
	events.value?.reduce((periods, event) => {
		if (periods.has(event.period)) {
			const period = periods.get(event.period);

			period!.push(event);
		} else {
			periods.set(event.period, [event]);
		}

		return periods;
	}, new Map<string, MatchEventInfo[]>())
);

const finalScore = computed(() => {
	const lastEvent = events.value.slice(-1)[0];

	if (lastEvent) {
		return [lastEvent.runningScoreHome, lastEvent.runningScoreAway];
	} else {
		return [0, 0];
	}
});

const getEventDescription = (event: MatchEventInfo) => {
	if (event.type === EVENT_TYPE.GOAL && event.code === 'OG') {
		return i18n.t('eventType.OwnGoal');
	} else if (event.type === EVENT_TYPE.TIMEOUT) {
		return i18n.t('eventType.Timeout');
	} else {
		let description = [];

		if (event.player1Name) {
			description.push(event.player1Name);
		}
		if (event.player2Name) {
			description.push(event.player2Name);
		}
		if (
			event.penalty !== '' &&
			event.type !== EVENT_TYPE.MISSED_PENALTY_SHOT
		) {
			description.push(i18n.t(`penalties.${event.code}`));
		}

		return description.join(' ');
	}
};

const getTeamLogo = (event: MatchEventInfo) =>
	event.teamId === match.value!.homeTeamId
		? match.value!.homeTeamLogo ?? undefined
		: event.teamId === match.value!.awayTeamId
		? match.value!.awayTeamLogo ?? undefined
		: undefined;

const reducePlayerInfo = (
	team: Map<string, MatchPlayerInfo[]>,
	player: MatchPlayerInfo
) => {
	const teamType = player.teamId === match.value!.homeTeamId ? 'home' : 'away';
	const playerList = team.get(teamType)!;

	playerList.push(player);
	playerList.sort((a: MatchPlayerInfo, b: MatchPlayerInfo) =>
		a.isGoalkeeper > b.isGoalkeeper
			? -1
			: a.isGoalkeeper < b.isGoalkeeper
			? 1
			: a.number - b.number
	);

	return team;
};

async function updateData(noCache: boolean) {
	match.value = await useMatch(matchId, noCache);

	events.value = await useMatchEvents(match.value, noCache);

	referees.value = await useMatchReferees(matchId, noCache);

	officials.value = (await useMatchOfficials(matchId, noCache)).reduce(
		(team: Map<string, MatchOfficialInfo[]>, official: MatchOfficialInfo) => {
			const teamType =
				official.teamId === match.value!.homeTeamId ? 'home' : 'away';

			team.get(teamType)?.push(official);

			return team;
		},
		new Map<string, MatchOfficialInfo[]>([
			['home', []],
			['away', []],
		])
	);

	players.value = (await useMatchPlayers(matchId, noCache)).reduce(
		reducePlayerInfo,
		new Map<string, MatchPlayerInfo[]>([
			['home', []],
			['away', []],
		])
	);
}

function startLivePolling() {
	let isLive = match.value?.isLive ?? false;

	livePollingInterval = setInterval(async () => {
		const lastEventsCount = events.value?.length ?? 0;

		// Poll new data
		events.value = await useMatchEvents(match.value!, true);

		// Show notification(s) for new event(s)
		if ((events.value?.length ?? 0) > lastEventsCount) {
			nextTick(() => {
				window.scrollTo(0, document.body.scrollHeight);
			});

			events.value!.slice(lastEventsCount).forEach((event) => {
				const eventInfo = `${event.time} ${event.runningScoreHome}-${
					event.runningScoreAway
				} ${i18n.t(`eventType.${event.type}${event.code}`)}`;

				global.notify({
					message: eventInfo,
					caption: getEventDescription(event),
					avatar: getTeamLogo(event),
				});
			});
		}

		// TODO: Update player data related to events

		if (isLive) {
			// TODO: Currently not polling for match ending, because of big data package
			if (!match.value?.isLive) {
				global.notify({
					message: i18n.t('endOfMatch'),
				});
				clearInterval(livePollingInterval);
				livePollingInterval = undefined;
			}
		} else if (!match.value?.isLive) {
			isLive = true;
		}
	}, LIVE_INTERVAL);
}

onBeforeMount(async () => {
	await updateData(false);

	const matchData = match.value!;

	if (matchData.isLive) {
		// Match is live -> start polling
		startLivePolling();
	} else if (!matchData.isFinished) {
		// Match hasn't been played yet
		const gameTime = matchData.date.getTime();
		const now = new Date().getTime();

		if (gameTime - now <= LIVE_POLLING_START) {
			// Match start is soon -> start polling
			startLivePolling();
		} else {
			// Wait for match start
			const expiration = gameTime - LIVE_POLLING_START;

			data.setExpiration(`match-info-${matchId}`, expiration);
			data.setExpiration(`match-events-${matchId}`, expiration);
			data.setExpiration(`match-referees-${matchId}`, expiration);

			livePollingTimeout = setTimeout(() => {
				startLivePolling();
			}, expiration - now);
		}
	}

	// Build path for navigation bar
	if (tournamentId) {
		global.setPath([
			{
				label: i18n.t('route.leagues'),
				to: '/leagues',
			},
			{
				label: matchData.tournamentName,
				to: `/tournament/${tournamentId}`,
			},
			{
				label: i18n.t('route.match'),
			},
		]);
	} else {
		global.setPath([
			{
				label: i18n.t('route.match'),
			},
		]);
	}
});

onUnmounted(() => {
	if (livePollingTimeout) {
		clearTimeout(livePollingTimeout);
		livePollingTimeout = undefined;
	}
	if (livePollingInterval) {
		clearInterval(livePollingInterval);
		livePollingInterval = undefined;
	}
});
</script>

<style lang="scss">
#matchPage {
	.date-info {
		display: flex;
		align-items: center;
		gap: 1rem;

		span {
			display: inline-flex;
			align-items: center;

			&.live {
				color: #f00;
				font-weight: 600;
			}

			&.scheduled {
				color: #090;
				font-weight: 600;
			}

			i {
				font-size: 1.25rem;
			}
		}
	}

	.team-score {
		display: flex;
		height: 6rem;
		overflow: hidden;

		.team {
			position: relative;
			width: 50%;

			.name {
				position: absolute;
				width: 100%;
				top: 0.5rem;
				text-align: center;
				font-size: 1.2rem;
				font-variant: small-caps;
				text-shadow: 1px 0 2px #fff, 0 1px 2px #fff, -1px 0 2px #fff,
					0 -1px 2px #fff;
				z-index: 1;
			}

			.score {
				position: absolute;
				width: 100%;
				top: 1.5rem;
				text-align: center;
				font-size: 3rem;
				text-shadow: 1px 0 2px #fff, 0 1px 2px #fff, -1px 0 2px #fff,
					0 -1px 2px #fff;
				z-index: 1;
			}

			img {
				position: absolute;
				width: calc(50vw - 1rem);
				top: calc(4.5rem - (50vw + 1rem) / 2);
				opacity: 0.4;
			}
		}
	}

	.venue {
		display: flex;
		align-items: center;
		margin-top: 0.5rem;
	}

	.referees {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.events {
		margin: 0;

		.q-timeline__heading-title {
			padding: 0;
			font-size: 1.1rem;
			font-variant: small-caps;
			font-weight: 600;
			opacity: 0.6;
		}

		.q-timeline__entry {
			padding-left: 1.5rem;

			.q-timeline__subtitle {
				margin: 0;
			}

			.q-timeline__content {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				padding-bottom: 0.25rem;

				.score {
					white-space: nowrap;
				}

				img,
				.q-icon {
					height: 2rem;
				}

				.own-goal {
					color: #666;
					font-style: italic;
				}

				.penalty {
					color: #c00;
				}

				.timeout {
					font-weight: 600;
				}

				.end-of-match {
					font-weight: 600;
				}
			}
		}
	}
}
</style>
