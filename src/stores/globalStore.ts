import { defineStore } from 'pinia';
import { QNotifyCreateOptions, useQuasar } from 'quasar';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

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

		t(key: string, values: (string | number)[]) {
			return values.reduce(
				(output: string, value: string | number, index) => {
					return output.replace(`[${index}]`, value.toString());
				},
				useI18n().t(key)
			);
		},
	},
});
