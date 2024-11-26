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

		<match-list :data="matches" :tournament-id="tournamentId" hide-division />
	</q-page>
</template>

<script setup lang="ts">
import matchList from '../components/MatchList.vue';

import { onBeforeMount, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from 'src/stores/global';
import TournamentInfo from 'src/interfaces/TournamentInfo';
import DivisionInfo from 'src/interfaces/DivisionInfo';
import RankingInfo from 'src/interfaces/RankingInfo';
import MatchListInfo from 'src/interfaces/MatchListInfo';
import API from 'src/enums/API';

const route = useRoute();
const i18n = useI18n();
const global = useGlobalStore();

enum DIVISION_TYPE {
	LEAGUE = '2',
	PLAYOFFS = '3',
}

const tournamentId = parseInt(route.params.id as string, 10);
const divisions = ref<DivisionInfo[]>([]);
const rankings = ref<RankingInfo[]>([]);
const matches = ref<MatchListInfo>({
	info: '',
	list_logo: [],
	list_match: [],
	list_sporthall: [],
});

const selectedDivision = ref(-1);
const visibleInfo = ref<Record<number, boolean>>({});

function onToggleVisibility(id: number) {
	visibleInfo.value[id] = !visibleInfo.value[id];
}

onBeforeMount(async () => {
	const tournament = await global.loadData<TournamentInfo>(
		`tournament-info-${tournamentId}`,
		API.TOURNAMENT_INFO,
		{ id: tournamentId, command: 'get' }
	);

	divisions.value = (
		await global.loadData<DivisionInfo[]>(
			`tournament-divisions-${tournamentId}`,
			API.DIVISION_INFO,
			{ tournament_id: tournamentId, command: 'getall' }
		)
	)
		.map((d) => toRaw(d))
		.filter((d) => d.reasonofcancel != null)
		.sort((a, b) => a.comp_order - b.comp_order);

	if (divisions.value.length > 0) {
		selectedDivision.value = global.selectedDivision ?? 0;
	}

	global.setPath([
		{
			label: i18n.t('route.leagues'),
			to: '/leagues',
		},
		{
			label: tournament.name,
			to: `/tournament/${tournamentId}`,
		},
	]);
});

watch(
	() => selectedDivision.value,
	async () => {
		global.selectedDivision = selectedDivision.value;

		const id = divisions.value[selectedDivision.value].id;

		rankings.value = await global.loadData<RankingInfo[]>(
			`division-rankings-${id}`,
			API.DIVISION_INFO,
			{ id: id, command: 'get_ranking' }
		);

		matches.value = await global.loadData<MatchListInfo>(
			`division-matches-${id}`,
			API.MATCH_LIST,
			{ id: id, command: 'round' }
		);
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
