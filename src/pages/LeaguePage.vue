<template>
	<q-page id="league-page">
		<q-tabs v-model="selectedSeason" class="text-primary">
			<q-tab
				v-for="season in seasons"
				:name="season.id"
				:label="season.name"
				:key="season.id"
			/>
		</q-tabs>

		<q-list id="tournament-list">
			<q-item
				v-for="tournament in tournaments"
				:key="tournament.id"
				clickable
				@click="$router.push(`/tournament/${tournament.id}`)"
			>
				<q-item-section avatar>
					<q-avatar
						color="secondary"
						text-color="white"
						icon="sym_o_trophy"
					/>
				</q-item-section>

				<q-item-section>
					<q-item-label class="text-primary name">
						{{ tournament.name }}
					</q-item-label>
				</q-item-section>
			</q-item>
		</q-list>
	</q-page>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useGlobalStore } from 'src/stores/global';
import { useI18n } from 'vue-i18n';
import SeasonInfo from 'src/interfaces/SeasonInfo';
import TournamentInfo from 'src/interfaces/TournamentInfo';
import API from 'src/enums/API';

const global = useGlobalStore();
const i18n = useI18n();

global.setPath([
	{
		label: i18n.t('route.leagues'),
		to: '/leagues',
	},
]);

const seasons = ref<SeasonInfo[]>();
const tournaments = ref<TournamentInfo[]>();
const selectedSeason = ref(0);

onBeforeMount(async () => {
	seasons.value = await global.loadData<SeasonInfo[]>(
		'season-info',
		API.SEASON_LIST
	);

	selectedSeason.value =
		global.selectedSeason ??
		(seasons.value.find((s) => s.iscurrent === 1) ?? { id: 0 }).id;
});

watch(
	() => selectedSeason.value,
	async () => {
		global.selectedSeason = selectedSeason.value;
		global.selectedDivision = undefined;

		tournaments.value = (
			await global.loadData<TournamentInfo[]>(
				`season-tournaments-${selectedSeason.value}`,
				API.TOURNAMENT_INFO,
				{ seasonid: selectedSeason.value, command: 'getall' }
			)
		).sort((a, b) => a.id - b.id);

		tournaments.value.forEach((t) =>
			global.setData(`tournament-info-${t.id}`, t)
		);
	}
);
</script>

<style lang="scss">
#league-page {
	#tournament-list {
		margin-top: 1rem;

		.name {
			font-variant: small-caps;
			font-size: 1.1rem;
			font-weight: 600;
		}
	}
}
</style>
