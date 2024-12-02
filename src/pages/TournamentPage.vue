<template>
	<q-page id="tournament-page">
		<q-tabs v-model="selectedDivision" v-if="divisions.length > 0">
			<q-tab
				v-for="(round, index) in divisions"
				:name="index"
				:label="round.name"
				:key="index"
				class="text-primary"
			/>
		</q-tabs>

		<q-markup-table
			id="ranking"
			v-if="
				divisions.length > 0 &&
				selectedDivision !== UNSELECTED &&
				divisions[selectedDivision].type === DIVISION_TYPE.LEAGUE
			"
		>
			<q-tr v-for="ranking in rankings" :key="ranking.id_rk">
				<q-td>
					<div class="team" @click="onToggleVisibility(ranking.id_rk)">
						<span class="rank">
							{{ ranking.ranking_order }}
						</span>
						<span class="name">
							{{ ranking.team_name }}
						</span>
						<span class="points">
							{{ ranking.PTS }}
						</span>
						<span class="matches">
							{{ ranking.GP }}
						</span>
					</div>
					<div
						v-if="visibleInfo[ranking.id_rk]"
						class="games"
						@click="onToggleVisibility(ranking.id_rk)"
					>
						<span>
							<span>{{ $t('ranking.wins') }}</span>
							<span>{{ ranking.WIN }}</span>
							(<span>{{ ranking.OT_WIN }}</span
							>)
						</span>
						<span>
							<span>{{ $t('ranking.draws') }}</span>
							<span>{{ ranking.DRAW }}</span>
						</span>
						<span>
							<span>{{ $t('ranking.loses') }}</span>
							<span>{{ ranking.LOST }}</span>
							(<span>{{ ranking.OT_LOST }}</span
							>)
						</span>
					</div>
					<div
						v-if="visibleInfo[ranking.id_rk]"
						class="goals"
						@click="onToggleVisibility(ranking.id_rk)"
					>
						<span>
							<span>{{ $t('ranking.goalsFor') }}</span>
							<span>{{ ranking.GOAL_FOR }}</span>
						</span>
						<span>
							<span>{{ $t('ranking.goalsAgainst') }}</span>
							<span>{{ ranking.GOAL_AGAINST }}</span>
						</span>
						<span>
							<span>{{ $t('ranking.goalDifference') }}</span>
							<span>
								{{ ranking.GOAL_DIFF > 0 ? '+' : '' }}
								{{ ranking.GOAL_DIFF }}
							</span>
						</span>
					</div>
				</q-td>
			</q-tr>
		</q-markup-table>

		<ListMatches
			:data="matches"
			:tournament-id="tournamentId"
			hide-division
		/>
	</q-page>
</template>

<script setup lang="ts">
import ListMatches from '../components/ListMatches.vue';

import { onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useSelectionStore } from 'src/stores/selectionStore';
import { useGlobalStore } from 'src/stores/globalStore';
import {
	useDivisionRankings,
	useTournament,
	useTournamentDivisions,
} from 'src/composables/useTournaments';
import { useDivisionMatches } from 'src/composables/useMatchLists';
import DivisionInfo from 'src/models/DivisionInfo';
import RankingInfo from 'src/models/RankingInfo';
import MatchListInfo from 'src/models/MatchListInfo';

const SELECTED_DIVISION_KEY = 'tournament-division';
const UNSELECTED = -1;

const route = useRoute();
const i18n = useI18n();
const selection = useSelectionStore();
const global = useGlobalStore();

enum DIVISION_TYPE {
	LEAGUE = '2',
	PLAYOFFS = '3',
}

const tournamentId = parseInt(route.params.id as string, 10);
const divisions = ref<DivisionInfo[]>([]);
const rankings = ref<RankingInfo[]>([]);
const matches = ref<MatchListInfo>({
	logos: [],
	matches: [],
	venues: [],
});

const selectedDivision = ref(UNSELECTED);
const visibleInfo = ref<Record<number, boolean>>({});

function onToggleVisibility(id: number) {
	visibleInfo.value[id] = !visibleInfo.value[id];
}

onBeforeMount(async () => {
	const tournament = await useTournament(tournamentId);

	divisions.value = await useTournamentDivisions(tournamentId);

	if (divisions.value.length > 0) {
		selectedDivision.value = selection.get(
			SELECTED_DIVISION_KEY,
			0
		) as number;
	}

	global.setPath([
		{
			label: i18n.t('route.leagues'),
			to: '/leagues',
		},
		{
			label: tournament.name,
		},
	]);
});

watch(
	() => selectedDivision.value,
	async () => {
		selection.set(SELECTED_DIVISION_KEY, selectedDivision.value);

		const id = divisions.value[selectedDivision.value].id;

		rankings.value = await useDivisionRankings(id);
		matches.value = await useDivisionMatches(id);
	}
);
</script>

<style lang="scss">
#tournament-page {
	#ranking {
		margin-top: 0.5rem;

		.q-tr {
			&:hover td {
				cursor: pointer;
				background-color: $primary-hover;
			}

			.q-td {
				padding: 0.25rem 1rem;

				.team {
					display: flex;
					align-items: center;
					gap: 0.5rem;

					.rank::after {
						display: inline;
						content: '.';
					}

					.name {
						flex-grow: 1;
						font-variant: small-caps;
						font-weight: 600;
					}

					.points {
						width: 2rem;
						text-align: right;
						font-weight: 600;
					}

					.matches {
						font-weight: 600;
						opacity: 0.6;

						&::before {
							display: inline;
							content: '(';
						}

						&::after {
							display: inline;
							content: ')';
						}
					}
				}

				.games,
				.goals {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 0.5rem;
					width: calc(100% - 1rem);
					padding-left: 0.5rem;
					font-size: 0.8rem;
					opacity: 0.6;

					& > span {
						span:first-child {
							display: inline-block;
							margin-right: 0.4rem;
						}

						span:last-child {
							font-weight: 600;
						}
					}
				}
			}

			&:first-child td {
				padding-top: 0.5rem;
			}

			&:last-child td {
				padding-bottom: 0.5rem;
			}

			&:not(:first-child) td {
				border-top: 1px dashed #ccc;
			}
		}
	}
}
</style>
