<template>
	<q-layout view="lHh Lpr lFf" id="main-layout">
		<q-header elevated>
			<q-toolbar>
				<q-toolbar-title> <b>F</b>rance <b>F</b>loorball </q-toolbar-title>
				<q-btn
					flat
					icon="sym_o_trophy"
					class="bg-secondary"
					@click="$router.push(`/leagues`)"
				/>
				<q-btn flat icon="sym_o_groups" class="bg-secondary" />
			</q-toolbar>
		</q-header>

		<q-page-container>
			<q-breadcrumbs separator="" active-color="white" gutter="none">
				<q-breadcrumbs-el icon="sym_o_home" to="/" />
				<q-breadcrumbs-el
					v-for="(path, key) in global.path"
					:label="path.label"
					:to="path.to"
					:key="key"
				/>
			</q-breadcrumbs>

			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
import { useGlobalStore } from 'src/stores/global';

const global = useGlobalStore();
</script>

<style lang="scss">
#main-layout {
	.q-breadcrumbs {
		width: fit-content;
		margin: 0.5rem 0.5rem 0 0.5rem;
		font-size: 0.68rem;

		& > * {
			white-space: nowrap;
			color: white;
			--square-size: 0.9rem;

			& > .flex {
				background-color: $primary;
				padding: 0.1rem 0.6rem;
				line-height: 1.2rem;

				&:first-child {
					border-top-left-radius: 0.2rem;
					border-bottom-left-radius: 0.2rem;
					margin-right: 0.3rem;

					i {
						margin: 0.05rem 0;
						font-size: 160%;
					}
				}

				&:not(:first-child) {
					position: relative;
					padding-left: 1.3rem;
					left: -0.31rem;

					&::before {
						position: absolute;
						content: '';
						width: var(--square-size);
						height: var(--square-size);
						left: -0.46rem;
						transform: rotateZ(45deg);
						background-color: white;
						z-index: 1;
					}
				}

				&:last-child {
					position: relative;
					margin-right: 2rem;

					&::after {
						position: absolute;
						content: '';
						width: var(--square-size);
						height: var(--square-size);
						right: -0.47rem;
						transform: rotateZ(45deg);
						background-color: $primary;
						z-index: -1;
					}
				}
			}
		}

		.q-breadcrumbs__separator {
			width: var(--square-size);
			height: var(--square-size);
			margin-left: -0.75rem;
			transform: rotateZ(45deg);
			background-color: $primary;
			z-index: 2;
		}
	}
}
</style>
