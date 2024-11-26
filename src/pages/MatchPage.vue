<template>
	<q-page id="match-page" v-if="match">
		<div class="date-info">
			<span class="time">
				{{ $d(global.date(match.date, match.time), 'datetime') }}
			</span>
			<span v-if="match.is_live" class="live">
				<q-icon name="sym_o_live_tv" />
				{{ $t('match.live') }}
			</span>
			<span v-else-if="match.is_played" class="history">
				<q-icon name="sym_o_history" />
				{{ $t('match.played') }}
			</span>
			<span v-else>
				<q-icon name="sym_o_scheduled" class="scheduled" />
				{{ $t('match.scheduled') }}
			</span>
			<span class="round">
				{{ match.round_name }}
			</span>
		</div>

		<q-card class="team-score">
			<div class="team">
				<img :src="match.team_home_logo!" />
				<div class="name">
					{{ match.team_home_name }}
				</div>
				<div class="score" v-if="match.is_played || match.is_started">
					{{ finalScore[0] }}
				</div>
			</div>
			<div class="team">
				<img :src="match.team_away_logo!" />
				<div class="name">
					{{ match.team_away_name }}
				</div>
				<div class="score" v-if="match.is_played || match.is_started">
					{{ finalScore[1] }}
				</div>
			</div>
		</q-card>

		<div class="venue">
			<q-icon name="sym_o_location_on" size="sm" />
			{{ match.description }}
			{{ match.sporthall?.name }}
		</div>

		<div class="referees" v-if="referees?.length ?? 0 > 0">
			<q-icon name="sym_o_sports" size="md" />
			<span v-for="referee in referees" :key="referee.id">
				{{ referee.lastname.toLocaleUpperCase() }}
				{{ referee.firstname }}
			</span>
		</div>

		<q-tabs v-model="selectedView" class="text-primary">
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
			<q-tab-panel :name="TAB_EVENTS">
				<q-timeline class="events">
					<template
						v-for="(period, periodIndex) in periods"
						:key="periodIndex"
					>
						<q-timeline-entry heading>
							{{ $t(`period.${period[0]}`) }}
						</q-timeline-entry>
						<q-timeline-entry
							v-for="(event, eventIndex) in period[1]"
							:key="eventIndex"
							:subtitle="`${
								period[0] === 'PEN' ? '' : event.time.substring(3)
							} ${$t(`eventType.${event.type}${event.code}`)}`"
						>
							<div class="score">
								{{ event.runningscore }}
							</div>
							<img
								v-if="event.teamid === match.team_home_id"
								:src="match.team_home_logo ?? ''"
								:alt="match.team_home_name"
							/>
							<img
								v-if="event.teamid === match.team_away_id"
								:src="match.team_away_logo ?? ''"
								:alt="match.team_away_name"
							/>
							<div v-if="event.code === 'OG'" class="own-goal">
								{{ $t('eventType.ownGoal') }}
							</div>
							<div v-else-if="event.type === 'Timeout'" class="timeout">
								<template v-if="event.teamid === match.team_home_id">
									{{ match.team_away_name }}
								</template>
								<template v-else>
									{{ match.team_away_name }}
								</template>
							</div>
							<div v-else-if="event.player1Name" class="players">
								<div>
									{{ event.player1lastname.toLocaleUpperCase() }}
									{{ event.player1firstname }}
								</div>
								<div v-if="event.player2Name">
									({{ event.player2lastname.toLocaleUpperCase() }}
									{{ event.player2firstname }})
								</div>
							</div>
							<div
								v-if="event.penality !== '' && event.code !== 'MPS'"
								class="penalty"
							>
								{{ $t(`penalties.${event.code}`) }}
							</div>
						</q-timeline-entry>
						<q-timeline-entry
							v-if="periodIndex < periods.length - 1 || match.is_played"
							:subtitle="
								period[0] === 'PEN' ? $t('period.endOfMatch') : '20:00'
							"
						>
							{{ period[1].slice(-1)[0].runningscore }}
							<q-icon name="sym_o_sports" size="lg" />
							<span
								v-if="periodIndex < periods.length - 1"
								class="end-of-period"
							>
								{{ $t('period.endOfPeriod') }}
							</span>
							<span v-else class="end-of-match">
								{{ $t('period.endOfMatch') }}
							</span>
						</q-timeline-entry>
					</template>
				</q-timeline>
			</q-tab-panel>
			<q-tab-panel :name="TAB_PLAYERS"> </q-tab-panel>
		</q-tab-panels>
	</q-page>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from 'src/stores/global';
import API from 'src/enums/API';
import MatchInfo from 'src/interfaces/MatchInfo';
import EventInfo from 'src/interfaces/EventInfo';
import RefereeInfo from 'src/interfaces/RefereeInfo';
import PlayerInfo from 'src/interfaces/PlayerInfo';

const LIVE_POLLING_START = 5 * 60 * 1000; // five minutes
const LIVE_INTERVAL = 10 * 1000; // 30 seconds
const TAB_EVENTS = 'events';
const TAB_PLAYERS = 'players';

const route = useRoute();
const i18n = useI18n();
const global = useGlobalStore();

const matchId = parseInt(route.params.id as string, 10);
const tournamentId = parseInt(route.params.tournamentId as string, 10);

const match = ref<MatchInfo>();
const events = ref<EventInfo[]>();
const referees = ref<RefereeInfo[]>();
const players = ref<PlayerInfo[]>();
const selectedView = ref(TAB_EVENTS);

let livePollingTimeout: NodeJS.Timeout | undefined;
let livePollingInterval: NodeJS.Timeout | undefined;

interface EventReduceItem {
	periods: Map<string, EventInfo[]>;
	goals: Map<number, number>;
}

const periods = computed(() =>
	Array.from(
		events.value
			?.reduce(
				(reduceItem: EventReduceItem, event: EventInfo) => {
					if (event.period === 'PEN') {
						if (event.code === 'PSAET') {
							event.type = 'Goal';
						}
					} else if (event.type === 'Own Goal') {
						if (event.teamid === match.value!.team_home_id) {
							event.teamid = match.value!.team_away_id;
						} else {
							event.teamid = match.value!.team_home_id;
						}

						event.type = 'Goal';
					}

					if (event.type === 'Goal') {
						reduceItem.goals.set(
							event.teamid,
							reduceItem.goals.get(event.teamid)! + 1
						);
					}

					event.runningscore = `${reduceItem.goals.get(
						match.value!.team_home_id
					)} - ${reduceItem.goals.get(match.value!.team_away_id)}`;

					if (reduceItem.periods.has(event.period)) {
						const period = reduceItem.periods.get(event.period);

						period!.push(event);

						reduceItem;
					} else {
						reduceItem.periods.set(event.period, [event]);
					}

					return reduceItem;
				},
				{
					periods: new Map<string, EventInfo[]>(),
					goals: new Map<number, number>([
						[match.value!.team_home_id, 0],
						[match.value!.team_away_id, 0],
					]),
				} as EventReduceItem
			)
			.periods.entries() ?? []
	)
);

const finalScore = computed(() =>
	periods.value.length
		? periods.value.slice(-1)[0][1].slice(-1)[0].runningscore.split(' - ')
		: ['', '']
);

const getEventDescription = (event: EventInfo) => {
	if (event.type === 'Own Goal') {
		return i18n.t('eventType.ownGoal');
	} else if (event.type === 'Timeout') {
		return i18n.t('eventType.Timeout');
	} else {
		let description = [];

		if (event.player1Name) {
			description.push(
				`${event.player1lastname.toLocaleUpperCase()} ${
					event.player1firstname
				}`
			);
		}
		if (event.player2Name) {
			description.push(
				`${event.player2lastname.toLocaleUpperCase()} ${
					event.player2firstname
				}`
			);
		}
		if (event.penality !== '' && event.code !== 'MPS') {
			description.push(i18n.t(`penalties.${event.code}`));
		}

		return description.join(' ');
	}
};

const getTeamLogo = (event: EventInfo) =>
	event.teamid === match.value!.team_home_id
		? match.value!.team_home_logo ?? undefined
		: event.teamid === match.value!.team_away_id
		? match.value!.team_away_logo ?? undefined
		: undefined;

async function updateData(noCache: boolean) {
	match.value = await global.loadData<MatchInfo>(
		`match-info-${matchId}`,
		API.MATCH_INFO,
		{ id: matchId, command: 'match', old: true },
		noCache
	);

	events.value = await global.loadData<EventInfo[]>(
		`match-events-${matchId}`,
		API.MATCH_INFO,
		{ id: matchId, command: 'event', old: true },
		noCache
	);

	referees.value = (
		await global.loadData<RefereeInfo[]>(
			`match-referees-${matchId}`,
			API.MATCH_INFO,
			{ id: matchId, command: 'referee', old: true },
			noCache
		)
	).filter((r) => r.id > 0);

	players.value = (
		await global.loadData<PlayerInfo[]>(
			`match-referees-${matchId}`,
			API.MATCH_INFO,
			{ id: matchId, command: 'player', old: true },
			noCache
		)
	).filter((r) => r.id > 0);
}

function startLivePolling() {
	let isLive = match.value?.is_live ?? false;

	livePollingInterval = setInterval(async () => {
		const lastEventsCount = events.value?.length ?? 0;

		events.value = await global.loadData<EventInfo[]>(
			`match-events-${matchId}`,
			API.MATCH_INFO,
			{ id: matchId, command: 'event', old: true },
			true
		);

		if ((events.value?.length ?? 0) > lastEventsCount) {
			nextTick(() => {
				window.scrollTo(0, document.body.scrollHeight);
			});

			events.value!.slice(lastEventsCount).forEach((event) => {
				const eventInfo = `${event.time.substring(3)} ${
					event.runningscore
				} ${i18n.t(`eventType.${event.type}${event.code}`)}`;

				global.notify({
					message: eventInfo,
					caption: getEventDescription(event),
					avatar: getTeamLogo(event),
				});
			});
		}

		if (isLive) {
			if (!match.value?.is_live) {
				global.notify({
					message: i18n.t('endOfMatch'),
				});
				clearInterval(livePollingInterval);
				livePollingInterval = undefined;
			}
		} else if (!match.value?.is_live) {
			isLive = true;
		}
	}, LIVE_INTERVAL);
}

onBeforeMount(async () => {
	await updateData(false);

	const matchData = match.value!;

	if (matchData.is_live) {
		startLivePolling();
	} else if (!matchData.is_played) {
		const gameTime = global.date(matchData.date, matchData.time).getTime();
		const now = new Date().getTime();

		if (gameTime - now <= LIVE_POLLING_START) {
			startLivePolling();
		} else {
			const expiration = gameTime - LIVE_POLLING_START;

			global.setExpiration(`match-info-${matchId}`, expiration);
			global.setExpiration(`match-events-${matchId}`, expiration);
			global.setExpiration(`match-referees-${matchId}`, expiration);

			livePollingTimeout = setTimeout(() => {
				startLivePolling();
			}, expiration - now);
		}
	}

	if (tournamentId) {
		global.setPath([
			{
				label: i18n.t('route.leagues'),
				to: '/leagues',
			},
			{
				label: matchData.round_name,
				to: `/tournament/${tournamentId}`,
			},
			{
				label: i18n.t('route.match'),
				to: `/tournament/${tournamentId}/match/${matchId}`,
			},
		]);
	} else {
		global.setPath([
			{
				label: i18n.t('route.match'),
				to: `/match/${matchId}`,
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
#match-page {
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
