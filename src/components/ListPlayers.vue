<template>
	<q-card class="player-list">
		<div class="team">
			<span class="photo">
				<img v-if="teamLogo" :src="teamLogo" alt="groups" />
				<q-icon v-else name="sym_o_groups" />
			</span>
			<span class="name">
				{{ teamName }}
			</span>
		</div>
		<div v-for="(player, index) in players" :key="index" class="player">
			<span class="photo">
				<img
					v-if="player.photo"
					:src="player.photo"
					:alt="icons.get(player.gender)?.substring(6)"
				/>
				<q-icon v-else :name="icons.get(player.gender)" />
			</span>
			<span class="number">
				{{ player.number }}
			</span>
			<span class="name">
				{{ player.name }}
				<span v-if="player.isCaptain" class="captain">
					<q-icon name="sym_o_copyright" />
				</span>
				<span v-if="player.isMvp" class="mvp">
					<q-icon name="sym_o_star" />
				</span>
			</span>
			<span v-if="player.isGoalkeeper">
				{{ player.saves }}
				/
				{{ (player.saves ?? 0) + (player.goalsConceeded ?? 0) }}
				=
				{{ ((player.savePercent ?? 0) * 100).toFixed(1) }}%
			</span>
			<span v-else>
				{{ player.goals }}
				+
				{{ player.assists }}
			</span>
		</div>
		<div
			v-for="(official, index) in officials"
			:key="index"
			:class="['official', { first: index === 0 }]"
		>
			<span class="name">
				{{ official.name }}
			</span>
		</div>
	</q-card>
</template>

<script setup lang="ts">
import GENDER from 'src/definitions/Gender';
import MatchOfficialInfo from 'src/models/MatchOfficialInfo';
import MatchPlayerInfo from 'src/models/MatchPlayerInfo';

const icons = new Map<GENDER, string>([
	[GENDER.MALE, 'sym_o_male'],
	[GENDER.FEMALE, 'sym_o_female'],
	[GENDER.UNKNOWN, 'sym_o_male'],
]);

defineProps<{
	teamName: string;
	teamLogo: string | undefined;
	players: MatchPlayerInfo[];
	officials: MatchOfficialInfo[];
}>();
</script>

<style lang="scss">
.player-list {
	padding: 0.5rem;

	.team {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		margin-left: -0.5rem;
		margin-right: -0.5rem;
		border-bottom: 1px dashed #ccc;
		padding-bottom: 0.5rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		font-size: 1.25rem;

		.photo {
			img {
				width: 3rem;
				height: 3rem;
				color: rgba(0, 0, 0, 0.6);

				&::before {
					content: '';
					width: 3rem;
					height: 3rem;
					font-family: 'Material Symbols Outlined';
					font-size: 3rem;
				}
			}

			i {
				font-size: 4rem;
			}
		}
	}

	.player {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding-right: 0.5rem;

		& + .player {
			margin-top: 3px;
		}

		.photo {
			width: 2rem;
			height: 2rem;
			text-align: center;

			img {
				position: relative;
				max-width: 2rem;
				height: 2rem;
				color: rgba(0, 0, 0, 0.1);

				&::before {
					content: '';
					display: inline-block;
					width: 2rem;
					height: 2rem;
					font-family: 'Material Symbols Outlined';
					font-size: 2rem;
					margin-top: -0.5rem;
				}

				&::after {
					content: '';
					display: inline-block;
					position: absolute;
					width: 2rem;
					height: 2rem;
					left: 0;
					top: -1rem;
					outline: 1px solid rgba(0, 0, 0, 0.1);
				}
			}

			i {
				font-size: 2rem;
				color: rgba(0, 0, 0, 0.1);
				outline: 1px solid rgba(0, 0, 0, 0.1);
			}
		}

		.number {
			width: 1.5rem;
			text-align: center;

			&::before {
				content: '#';
			}
		}

		.name {
			font-variant: small-caps;
			flex-grow: 1;

			.captain {
				i {
					font-size: 1.333rem;
					color: #bb0;
					vertical-align: -0.2rem;
				}
			}

			.mvp {
				i {
					font-size: 1.333rem;
					color: #cc0;
					vertical-align: -0.2rem;
				}
			}
		}
	}

	.official {
		line-height: 1.5rem;

		&.first {
			margin-top: 0.5rem;
			border-top: 1px dashed #ccc;
			padding-top: 0.5rem;
		}
	}
}
</style>
