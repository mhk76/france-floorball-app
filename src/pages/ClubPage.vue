<template>
	<div id="club-page" v-if="club">
		<div id="club-name">
			<img :src="club.logo" />
			<h1>{{ club.name }}</h1>
			<h2>{{ club.shortName }}</h2>
		</div>

		<div id="club-info">
			<q-item-section>
				<q-item-label class="info" v-if="club.website">
					<q-icon name="sym_o_home" />
					<a :href="club.email" target="_blank">{{ club.website }}</a>
				</q-item-label>
				<q-item-label class="info" v-if="club.phone">
					<q-icon name="sym_o_call" />
					<a :href="`tel:${club.phone}`" target="_blank">{{
						club.phone
					}}</a>
				</q-item-label>
				<q-item-label class="info" v-if="club.email">
					<q-icon name="sym_o_alternate_email" />
					<a :href="`mailto:${club.email}`" target="_blank">{{
						club.email
					}}</a>
				</q-item-label>
				<q-item-label class="info" v-if="club.email">
					<q-icon name="sym_o_signpost" />
					<template v-if="club.streetAddress">
						{{ club.streetAddress }},
					</template>
					<template v-if="club.postCode">
						{{ club.postCode }}&nbsp;
					</template>
					<template v-if="club.city">
						{{ club.city.toLocaleUpperCase().trim() }}
					</template>
				</q-item-label>
			</q-item-section>
		</div>

		<q-expansion-item
			id="jerseys"
			icon="sym_o_trophy"
			:label="$t('stats.jerseys')"
		>
			<div class="content">
				<span>
					<svg
						width="20"
						height="20"
						viewBox="0 0 0.2 0.2"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:svg="http://www.w3.org/2000/svg"
					>
						<path
							:fill="club.colorHome1"
							d="M 0.02,0.11 0.035,0.005 H 0.08 L 0.1,0.02 0.12,0.005 H 0.17 L 0.18,0.11 H 0.155 L 0.145,0.04 0.135,0.11 H 0.065 L 0.06,0.04 0.045,0.11 Z"
							id="shirt"
						/>
						<path
							:fill="club.colorHome2"
							d="m 0.065,0.12 h 0.07 L 0.15,0.195 H 0.11 L 0.1,0.16 0.09,0.195 H 0.05 Z"
							id="pants"
						/>
					</svg>
				</span>
				<span>
					<svg
						width="20"
						height="20"
						viewBox="0 0 0.2 0.2"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:svg="http://www.w3.org/2000/svg"
					>
						<path
							:fill="club.colorAway1"
							d="M 0.02,0.11 0.035,0.005 H 0.08 L 0.1,0.02 0.12,0.005 H 0.17 L 0.18,0.11 H 0.155 L 0.145,0.04 0.135,0.11 H 0.065 L 0.06,0.04 0.045,0.11 Z"
							id="shirt"
						/>
						<path
							:fill="club.colorAway2"
							d="m 0.065,0.12 h 0.07 L 0.15,0.195 H 0.11 L 0.1,0.16 0.09,0.195 H 0.05 Z"
							id="pants"
						/>
					</svg>
				</span>
			</div>
		</q-expansion-item>

		<ListTrophies :trophies="trophies" />

		<SelectSeason v-model="selectedSeason" :selection-key="CLUB_SEASON_KEY" />

		<q-tabs v-model="selectedTeam" class="team-list text-primary">
			<q-tab :name="0" :label="$t('stats.all')" :key="0" />
			<q-tab
				v-for="team in teams"
				:name="team.id"
				:label="team.name"
				:key="team.id"
			/>
		</q-tabs>

		<q-card class="player-list">
			<div
				v-for="(player, index) in players"
				:key="index"
				class="player"
				@click="onShowPlayer(player)"
			>
				<span class="name">
					{{ player.name }}
				</span>
				<template v-if="player.gamesPlayed">
					<span clasS="stats">
						<span v-if="player.isGoalkeeper" class="goalie-stats">
							{{ player.saves }}
							/
							{{ (player.saves ?? 0) + (player.goalsConceeded ?? 0) }}
							=
							{{ ((player.savePercent ?? 0) * 100).toFixed(1) }}%
						</span>
						<span class="player-stats">
							<template
								v-if="
									!player.isGoalkeeper ||
									player.goals > 0 ||
									player.assists > 0
								"
							>
								{{ player.goals }}
								+
								{{ player.assists }}
							</template>
						</span>
					</span>
					/ {{ $t('stats.nMatches', [player.gamesPlayed]) }}
				</template>
			</div>
		</q-card>
	</div>
</template>

<script setup lang="ts">
import SelectSeason from 'src/components/SelectSeason.vue';

import { onBeforeMount, ref, watch } from 'vue';
import { useSelectionStore } from 'src/stores/selectionStore';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from 'src/stores/globalStore';
import { useI18n } from 'vue-i18n';
import { useClubs } from 'src/composables/useClubs';
import { useClubTrophies } from 'src/composables/useClubsTrophies';
import { useClubTeams } from 'src/composables/useClubTeams';
import { useClubPlayers } from 'src/composables/useClubPlayers';
import { useTeamPlayers } from 'src/composables/useTeamPlayers';
import { ClubInfo } from 'src/models/ClubInfo';
import { Trophy } from 'src/models/Trophy';
import MatchPlayerInfo from 'src/models/MatchPlayerInfo';
import TeamInfo from 'src/models/TeamInfo';
import ListTrophies from 'src/components/ListTrophies.vue';

const CLUB_SEASON_KEY = 'club-season';
const CLUB_TEAM_KEY = 'club-team';

const selection = useSelectionStore();
const route = useRoute();
const router = useRouter();
const global = useGlobalStore();
const i18n = useI18n();

const selectedSeason = ref(0);
const selectedTeam = ref(-1);

const clubId = parseInt(route.params.id as string, 10);
const club = ref<ClubInfo>();
const trophies = ref<Trophy[]>([]);
const players = ref<MatchPlayerInfo[]>([]);
const teams = ref<TeamInfo[]>([]);

function onShowPlayer(player: MatchPlayerInfo) {
	router.push(`/players/${player.id}`);
}

onBeforeMount(async () => {
	selectedSeason.value = selection.get(CLUB_SEASON_KEY, 0) as number;

	club.value = (await useClubs()).filter((club) => club.id === clubId)[0];
	trophies.value = await useClubTrophies(clubId);

	global.setPath([
		{
			label: i18n.t('route.clubs'),
			to: '/clubs',
		},
		{
			label: club.value.name,
		},
	]);
});

watch(
	() => selectedSeason.value,
	async () => {
		selection.set(CLUB_SEASON_KEY, selectedSeason.value);

		teams.value = await useClubTeams(selectedSeason.value, clubId);
		selectedTeam.value = 0;
	}
);

watch(
	() => selectedTeam.value,
	async () => {
		selection.set(CLUB_TEAM_KEY, selectedTeam.value);

		if (selectedTeam.value === 0) {
			players.value = await useClubPlayers(selectedSeason.value, clubId);
		} else {
			players.value = await useTeamPlayers(selectedTeam.value);
		}
	}
);
</script>

<style lang="scss">
#club-page {
	font-size: 1rem;
	padding: 0.5rem;

	#club-name {
		img {
			float: left;
			height: 3rem;
			margin-right: 1rem;
		}

		h1 {
			display: block;
			margin: 0;
			padding: 0;
			font-weight: bold;
			font-size: 1.25rem;
			line-height: 1.5rem;
		}

		h2 {
			display: block;
			margin: 0;
			padding: 0;
			font-size: 1rem;
			line-height: 1.5rem;
			font-variant: small-caps;
		}
	}

	#club-info {
		margin-top: 0.5rem;
		padding: 0.25rem;
	}

	#jerseys {
		margin-top: 0.5rem;

		.content {
			margin-top: 0.5rem;
			display: flex;
			justify-content: space-around;

			span {
				width: 25vw;
				height: 25vw;
				padding: 0.5rem;
				border: 1px solid rgba(0, 0, 0, 0.1);
				border-radius: 0.5rem;
				background-color: #ddd;
				text-align: center;

				svg {
					width: calc(25vw - 1rem);
					height: calc(25vw - 1rem);
				}
			}
		}
	}

	.trophy-list {
		margin-top: 0.5rem;
	}

	.season-list {
		margin-top: 0.5rem;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;

		.q-tab:not(.q-tab--active) {
			.q-tab__indicator {
				opacity: 1;
				height: 0;
				border-bottom: 1px dashed rgba(0, 0, 255, 0.2);
				background: transparent;
			}
		}
	}

	.team-list {
		margin-bottom: 0.5rem;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}

	.player-list {
		padding: 0.25rem;
		font-size: 86%;

		& + .player {
			margin-top: 3px;
		}

		.player {
			display: flex;
			align-items: center;
			gap: 0.25rem;
			padding-right: 0.5rem;

			& + .player {
				border-top: 1px dashed #ccc;
			}

			& + .player {
				margin-top: 0.2rem;
			}

			.name {
				font-variant: small-caps;
				flex-grow: 1;
			}

			.stats {
				display: flex;
				flex-direction: column;
			}

			.player-stats {
				min-width: 3rem;
				text-align: right;
			}
		}
	}
}
</style>
