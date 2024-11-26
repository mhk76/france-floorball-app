import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)['fr'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
	// define the locale messages schema
	export interface DefineLocaleMessage extends MessageSchema {}

	// define the datetime format schema
	export interface DefineDateTimeFormat {
		date: {
			year: 'numeric';
			month: 'numeric';
			day: 'numeric';
		};
		datetime: {
			year: 'numeric';
			month: 'numeric';
			day: 'numeric';
			hour: 'numeric';
			minute: 'numeric';
		};
		time: {
			hour: 'numeric';
			minute: 'numeric';
		};
	}

	// define the number format schema
	export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

export default boot(({ app }) => {
	const i18n = createI18n({
		locale: 'fr',
		legacy: false,
		messages,
		datetimeFormats: {
			fr: {
				date: {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				},
				datetime: {
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
					hour: 'numeric',
					minute: 'numeric',
				},
				time: {
					hour: 'numeric',
					minute: 'numeric',
				},
			},
		},
	});

	// Set i18n instance on app
	app.use(i18n);
});
