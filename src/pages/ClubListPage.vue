<template>
	<div id="club-list-page">
		<q-list>
			<q-item
				v-for="club in clubs"
				:key="club.id"
				clickable
				@click="$router.push(`/clubs/${club.id}`)"
			>
				<q-item-section avatar>
					<q-avatar>
						<img :src="club.logo" />
					</q-avatar>
				</q-item-section>

				<q-item-section>
					<q-item-label class="text-primary name">
						{{ club.name }}
					</q-item-label>
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
			</q-item>
		</q-list>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useGlobalStore } from 'src/stores/globalStore';
import { useI18n } from 'vue-i18n';
import { useClubs } from 'src/composables/useClubs';
import { ClubInfo } from 'src/models/ClubInfo';

const global = useGlobalStore();
const i18n = useI18n();

const clubs = ref<ClubInfo[]>([]);

onBeforeMount(async () => {
	global.setPath([
		{
			label: i18n.t('route.clubs'),
			to: '/clubs',
		},
	]);

	clubs.value = await useClubs();
});
</script>

<style lang="scss">
#club-list-page {
	font-size: 1rem;

	i {
		vertical-align: middle;
		margin-right: 0.2rem;
	}

	.info {
		font-size: 90%;
	}

	.q-item + .q-item {
		border-top: 1px dashed #ccc;
	}
}
</style>
