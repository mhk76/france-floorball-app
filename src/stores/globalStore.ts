import { defineStore } from 'pinia';
import { QNotifyCreateOptions, useQuasar } from 'quasar';
import { ref } from 'vue';

export interface PathItem {
	label: string;
	to?: string;
}

export const useGlobalStore = defineStore('global', {
	state: () => ({
		path: ref<PathItem[]>([]),
		timezone: new Intl.DateTimeFormat('fr-FR', {
			timeZone: 'Europe/Paris',
			timeZoneName: 'longOffset',
		})
			.format(new Date())
			.split(' UTC')[1],
	}),

	actions: {
		date(date: string, time: string = '00:00:00'): Date {
			return new Date(`${date}T${time}.000${this.timezone}`);
		},

		name(firstname: string | null, lastname: string | null): string {
			if (lastname) {
				return `${lastname.toLocaleUpperCase()} ${
					firstname ? firstname : ''
				}`;
			} else {
				return '';
			}
		},

		notify(options: QNotifyCreateOptions) {
			useQuasar().notify(options);
		},

		setPath(pathItems: PathItem[]) {
			this.path = pathItems;
		},
	},
});
