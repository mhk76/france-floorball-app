<template>
	<div id="player-page">
		<q-card v-if="player && stats" class="player">
			<span class="photo">
				<img
					v-if="player.photo"
					:src="player.photo"
					:alt="icons.get(player.gender)?.substring(6)"
				/>
				<q-icon v-else :name="icons.get(player.gender)" />
			</span>
			<span class="stats">
				<div class="name">
					{{ player.name }}
				</div>
				<div>
					{{ $d(player.birthDate) }}
				</div>
				<div v-if="stats.statistics.isGoalkeeper">
					{{ stats.statistics.saves }}
					/
					{{
						(stats.statistics.saves ?? 0) +
						(stats.statistics.goalsConceeded ?? 0)
					}}
					=
					{{ ((stats.statistics.savePercent ?? 0) * 100).toFixed(1) }}%
				</div>
				<div
					v-if="stats.statistics.goals > 0 || stats.statistics.assists > 0"
				>
					{{ $t('stats.nGoals', [stats.statistics.goals]) }}
					|
					{{ $t('stats.nAssists', [stats.statistics.assists]) }}
				</div>
				<div>
					{{ $t('stats.nMatches', [stats.statistics.gamesPlayed]) }}
					<template v-if="stats.statistics.mvpCount">
						|
						{{ $t('stats.nMVP', [stats.statistics.mvpCount]) }}
					</template>
				</div>
			</span>
		</q-card>

		<ListTrophies :trophies="trophies" />

		<q-expansion-item
			v-if="stats"
			class="season-list"
			icon="sym_o_calendar_month"
			:label="$t('stats.seasons')"
		>
			<div
				v-for="season in stats.seasons"
				:key="season.seasonId"
				class="season"
			>
				<span class="photo">
					<img :src="stats.clubLogos[season.clubId]" />
				</span>
				<span class="stats">
					<div>
						{{ season.seasonName }}
					</div>
					<div class="name">
						{{ season.clubName }}
					</div>
					<div v-if="season.statistics.isGoalkeeper">
						{{ season.statistics.saves }}
						/
						{{
							(season.statistics.saves ?? 0) +
							(season.statistics.goalsConceeded ?? 0)
						}}
						=
						{{ ((season.statistics.savePercent ?? 0) * 100).toFixed(1) }}%
					</div>
					<div
						v-if="
							season.statistics.goals > 0 ||
							season.statistics.assists > 0
						"
					>
						{{ $t('stats.nGoals', [season.statistics.goals]) }}
						|
						{{ $t('stats.nAssists', [season.statistics.assists]) }}
					</div>
					<div>
						{{ $t('stats.nMatches', [season.statistics.gamesPlayed]) }}
						<template v-if="season.statistics.mvpCount">
							|
							{{ $t('stats.nMVP', [season.statistics.mvpCount]) }}
						</template>
					</div>
				</span>
			</div>
		</q-expansion-item>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from 'src/stores/globalStore';
import { usePlayer } from 'src/composables/usePlayer';
import { usePlayerTrophies } from 'src/composables/usePlayerTrophies';
import { Trophy } from 'src/models/Trophy';
import { usePlayerStatisticsInfo } from 'src/composables/usePlayerSeasons';
import PlayerInfo from 'src/models/PlayerInfo';
import ListTrophies from 'src/components/ListTrophies.vue';
import GENDER from 'src/enums/GENDER';
import { PlayerStatisticsInfo } from 'src/models/PlayerStatisticsInfo';

const route = useRoute();
const global = useGlobalStore();
const i18n = useI18n();

const playerId = parseInt(route.params.id as string, 10);
const player = ref<PlayerInfo>();
const trophies = ref<Trophy[]>([]);
const stats = ref<PlayerStatisticsInfo>();

const icons = new Map<GENDER, string>([
	[GENDER.MALE, 'sym_o_male'],
	[GENDER.FEMALE, 'sym_o_female'],
	[GENDER.UNKNOWN, 'sym_o_male'],
]);

onBeforeMount(async () => {
	player.value = await usePlayer(playerId);
	trophies.value = await usePlayerTrophies(playerId);
	stats.value = await usePlayerStatisticsInfo(playerId);
	console.log(player.value);
	global.setPath([
		{
			label: i18n.t('route.players'),
		},
		{
			label: player.value.name,
		},
	]);
});
</script>

<style lang="scss">
#player-page {
	font-size: 1rem;
	padding: 0.5rem;

	.player {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;

		.photo {
			padding: 0.5rem 0 0.1rem 0.5rem;
			border: 1px solid rgba(0, 0, 0, 0.1);

			img {
				height: 6rem;
			}
		}
	}

	.season {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-size: 90%;

		& + .season {
			margin-top: 0.25rem;
			border-top: 1px dashed #ccc;
		}

		.photo {
			padding: 0.5rem 0 0.1rem 0.5rem;

			img {
				max-width: 4rem;
				max-height: 4rem;
			}
		}
	}
}
</style>
