<template>
	<q-expansion-item
		v-if="trophies.length > 0"
		class="trophy-list"
		icon="sym_o_trophy"
		:label="$t('stats.trophies')"
	>
		<div class="content">
			<div v-for="(trophy, index) in trophies" :key="index">
				<q-icon name="sym_o_trophy" :class="trophy.rank" />
				<span>{{ $t(`ranks.${trophy.rank}`) }}</span>
				<div>{{ trophy.tournament }}</div>
			</div>
		</div>
	</q-expansion-item>
</template>

<script setup lang="ts">
import { Trophy } from 'src/models/Trophy';

defineProps<{
	trophies: Trophy[];
}>();
</script>

<style lang="scss">
.trophy-list {
	.content {
		margin-top: 0.25rem;

		& > div {
			clear: both;

			i {
				position: relative;
				float: left;
				font-size: 3rem;
				font-variation-settings: 'FILL' 1;

				&::after {
					content: '';
					position: absolute;
					left: 1rem;
					top: 0.6rem;
					width: 1rem;
					height: 1rem;
					font-size: 1rem;
					font-family: monospace;
					color: #fff;
					z-index: 1;
				}

				&.CHAMPIONSHIP_WINNER {
					color: #f2bd2e;

					&::after {
						content: '1';
					}
				}

				&.CHAMPIONSHIP_RUNNERUP {
					color: #c9c9c9;

					&::after {
						content: '2';
					}
				}

				&.CHAMPIONSHIP_3RD {
					color: #fc9711;

					&::after {
						content: '3';
					}
				}
			}

			span {
				display: block;
				margin-top: 0.3rem;
				font-variant: small-caps;
				font-weight: bold;
			}

			div {
				margin-top: -0.2rem;
				font-size: 0.95rem;
			}
		}
	}
}
</style>
