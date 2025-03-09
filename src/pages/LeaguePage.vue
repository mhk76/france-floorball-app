<template>
	<q-page id="league-page">
		<SelectSeason
			v-model="selectedSeason"
			:selection-key="LEAGUE_SEASON_KEY"
		/>

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
import SelectSeason from 'src/components/SelectSeason.vue';

import { onBeforeMount, ref, watch } from 'vue';
import { useSelectionStore } from 'src/stores/selectionStore';
import { useGlobalStore } from 'src/stores/globalStore';
import { useI18n } from 'vue-i18n';
import { useTournaments } from 'src/composables/useTournaments';
import TournamentInfo from 'src/models/TournamentInfo';

const LEAGUE_SEASON_KEY = 'league-season';

const selection = useSelectionStore();
const global = useGlobalStore();
const i18n = useI18n();

global.setPath([
	{
		label: i18n.t('route.leagues'),
	},
]);

const tournaments = ref<TournamentInfo[]>([]);
const selectedSeason = ref<number>(0);

onBeforeMount(() => {
	selectedSeason.value = selection.get(LEAGUE_SEASON_KEY, 0) as number;
});

watch(
	() => selectedSeason.value,
	async () => {
		selection.set(LEAGUE_SEASON_KEY, selectedSeason.value);
		selection.set('league-division', undefined);

		tournaments.value = await useTournaments(selectedSeason.value);
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
