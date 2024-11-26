<template>
	<div class="match-list">
		<div v-for="(date, dateKey) in matchDates" :key="dateKey">
			<div class="header">{{ $d(global.date(date)) }}</div>
			<q-markup-table>
				<q-tr
					v-for="(match, timeKey) in matches.get(date)"
					:key="timeKey"
					@click="onGoToMatch(match.id)"
				>
					<q-td>
						<div class="info">
							<span class="time">
								{{ $d(global.date(date, match.time), 'time') }}
							</span>
							<span v-if="!hideDivision" class="division">
								{{ match.round_name }}
							</span>
							<span v-else class="venue">
								{{ venues.get(match.sporthall_id)!.city }}
							</span>
						</div>
						<div class="teams">
							<div class="team">
								<span class="score">
									<template v-if="match.is_played || match.is_started">
										{{ match.score_home }}
									</template>
									<template v-else>
										<q-icon name="sym_o_schedule" />
									</template>
								</span>
								<img
									:src="match.team_home_logo ?? logos.get(match.club_home_id)!"
									width="24"
								/>
								<span class="name">
									{{ match.team_home_name }}
								</span>
							</div>
							<div class="team">
								<span class="score">
									<template v-if="match.is_played || match.is_started">
										{{ match.score_away }}
									</template>
									<template v-else>
										<q-icon name="sym_o_schedule" />
									</template>
								</span>
								<img
									:src="match.team_away_logo ?? logos.get(match.club_away_id)!"
									width="24"
								/>
								<span class="name">
									{{ match.team_away_name }}
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from 'src/stores/global';
import MatchInfo from '../interfaces/MatchInfo';
import LogoInfo from '../interfaces/LogoInfo';
import MatchListInfo from '../interfaces/MatchListInfo';
import VenueInfo from 'src/interfaces/VenueInfo';

const router = useRouter();
const global = useGlobalStore();

const props = defineProps<{
	data: MatchListInfo | undefined;
	hideDivision?: boolean;
	tournamentId?: number;
}>();

const matches = computed(() =>
	(props.data as MatchListInfo).list_match.reduce(
		(dates: Map<string, MatchInfo[]>, match: MatchInfo) => {
			if (dates.has(match.date)) {
				const list = dates.get(match.date)!;

				list.push(match);
				list.sort((a: MatchInfo, b: MatchInfo) =>
					a.time.localeCompare(b.time)
				);

				return dates;
			} else {
				return dates.set(match.date, [match]);
			}
		},
		new Map<string, MatchInfo[]>()
	)
);

const logos = computed(() =>
	(props.data as MatchListInfo).list_logo.reduce(
		(logos: Map<number, string>, logo: LogoInfo) =>
			logos.set(logo.id, logo.logo),
		new Map<number, string>()
	)
);

const venues = computed(() =>
	(props.data as MatchListInfo).list_sporthall.reduce(
		(venues: Map<number, VenueInfo>, venue: VenueInfo) =>
			venues.set(venue.id, venue),
		new Map<number, VenueInfo>()
	)
);

const matchDates = computed(() =>
	Array.from(matches.value.keys()).sort((a, b) => a.localeCompare(b))
);

function onGoToMatch(matchId: number) {
	if (props.tournamentId) {
		router.push(`/tournament/${props.tournamentId}/match/${matchId}`);
	} else {
		router.push(`/match/${matchId}`);
	}
}
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
