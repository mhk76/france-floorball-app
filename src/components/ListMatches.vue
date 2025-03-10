<template>
	<div class="match-list">
		<div v-for="(date, dateKey) in matchDates" :key="dateKey">
			<div class="header">{{ $d(date) }}</div>
			<q-markup-table>
				<q-tr
					v-for="(match, timeKey) in matches.get(date)"
					:key="timeKey"
					@click="onGoToMatch(match.id)"
				>
					<q-td>
						<div class="info">
							<span class="time">
								{{ $d(match.date, 'time') }}
							</span>
							<span v-if="!hideDivision" class="division">
								{{ match.tournamentName }}
							</span>
							<span v-else class="venue">
								{{ venues.get(match.venueId)!.city }}
							</span>
						</div>
						<div class="teams">
							<div class="team">
								<span class="score">
									<template v-if="match.isFinished || match.isStarted">
										{{ match.homeTeamScore }}
									</template>
									<template v-else>
										<q-icon name="sym_o_schedule" />
									</template>
								</span>
								<img
									:src="match.homeTeamLogo ?? logos.get(match.homeTeamClubId)!"
									width="24"
								/>
								<span class="name">
									{{ match.homeTeamName }}
								</span>
							</div>
							<div class="team">
								<span class="score">
									<template v-if="match.isFinished || match.isStarted">
										{{ match.awayTeamScore }}
									</template>
									<template v-else>
										<q-icon name="sym_o_schedule" />
									</template>
								</span>
								<img
									:src="match.awayTeamLogo ?? logos.get(match.awayTeamClubId)!"
									width="24"
								/>
								<span class="name">
									{{ match.awayTeamName }}
								</span>
							</div>
						</div>
					</q-td>
				</q-tr>
			</q-markup-table>
		</div>
		<div v-if="matchDates.length === 0" class="no-matches">
			{{ $t('match.noMatches') }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSelectionStore } from 'src/stores/selectionStore';
import MatchInfo from '../models/MatchInfo';
import LogoInfo from '../models/LogoInfo';
import MatchListInfo from '../models/MatchListInfo';
import VenueInfo from 'src/models/VenueInfo';

const MATCH_LIST_SCROLL = 'match-list-scroll';
const MATCH_LIST_SCROLL_VALUE = 'match-list-scroll-value';

const router = useRouter();
const selection = useSelectionStore();

const props = defineProps<{
	id: string;
	data: MatchListInfo | undefined;
	hideDivision?: boolean;
	tournamentId?: number;
}>();

const matches = computed(() =>
	(props.data as MatchListInfo).matches.reduce(
		(dates: Map<Date, MatchInfo[]>, match: MatchInfo) => {
			if (dates.has(match.date)) {
				const list = dates.get(match.date)!;

				list.push(match);
				list.sort(
					(a: MatchInfo, b: MatchInfo) =>
						a.date.getTime() - b.date.getTime()
				);

				return dates;
			} else {
				return dates.set(match.date, [match]);
			}
		},
		new Map<Date, MatchInfo[]>()
	)
);

const logos = computed(() =>
	(props.data as MatchListInfo).logos.reduce(
		(logos: Map<number, string>, logo: LogoInfo) =>
			logos.set(logo.id, logo.logo),
		new Map<number, string>()
	)
);

const venues = computed(() =>
	(props.data as MatchListInfo).venues.reduce(
		(venues: Map<number, VenueInfo>, venue: VenueInfo) =>
			venues.set(venue.id, venue),
		new Map<number, VenueInfo>()
	)
);

const matchDates = computed(() =>
	Array.from(matches.value.keys()).sort((a, b) => a.getTime() - b.getTime())
);

function onGoToMatch(matchId: number) {
	selection.set(MATCH_LIST_SCROLL, props.id);
	selection.set(MATCH_LIST_SCROLL_VALUE, document.documentElement.scrollTop);

	if (props.tournamentId) {
		router.push(`/tournament/${props.tournamentId}/match/${matchId}`);
	} else {
		router.push(`/match/${matchId}`);
	}
}

onMounted(() => {
	if (selection.get(MATCH_LIST_SCROLL) === props.id) {
		setTimeout(() => {
			window.scrollTo(0, selection.get(MATCH_LIST_SCROLL_VALUE) as number);
		});
	}
});
</script>

<style lang="scss">
.match-list {
	.header {
		padding: 0.5rem;
		font-weight: bold;
		opacity: 0.6;
	}

	table {
		tr {
			&:hover td {
				cursor: pointer;
				background-color: $primary-hover;
			}

			& + tr td {
				border-top: 1px dashed #ccc;
			}

			td {
				.info {
					.time {
						display: inline-block;
						width: 2.5rem;
						font-weight: 600;
						text-align: center;
						margin-right: 0.5rem;
					}

					.division {
						font-variant: small-caps;
						font-weight: 600;
					}

					.venue {
						font-variant: small-caps;
						font-weight: 600;
					}
				}

				.teams {
					.team {
						display: flex;
						align-items: center;
						justify-items: flex-start;

						.score {
							width: 2.5rem;
							margin-right: 0.5rem;
							text-align: center;
						}

						img {
							margin-right: 0.5rem;
						}

						.name {
							flex-grow: 1;
						}
					}
				}
			}
		}
	}

	.no-matches {
		line-height: 5rem;
		text-align: center;
	}
}
</style>
