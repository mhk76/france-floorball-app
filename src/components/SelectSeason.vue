<template>
	<q-tabs v-model="selectedSeason" class="season-list text-primary">
		<q-tab
			v-for="season in seasons"
			:name="season.id"
			:label="season.name"
			:key="season.id"
		/>
	</q-tabs>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useSelectionStore } from 'src/stores/selectionStore';
import { useSeasons } from 'src/composables/useSeasons';
import SeasonInfo from 'src/models/SeasonInfo';

const selection = useSelectionStore();

const seasons = ref<SeasonInfo[]>();

const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
	modelValue: number | undefined;
	selectionKey: string;
}>();

const selectedSeason = computed({
	get: () => props.modelValue,
	set: (newValue: number) => {
		emit('update:modelValue', newValue);
	},
});

onBeforeMount(async () => {
	seasons.value = await useSeasons();

	selectedSeason.value =
		(selection.get(props.selectionKey) as number) ??
		(seasons.value.find((s) => s.iscurrent === 1) ?? { id: 0 }).id;
});
</script>
