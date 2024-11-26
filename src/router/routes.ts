import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/IndexPage.vue') },
			{ path: 'match/:id', component: () => import('pages/MatchPage.vue') },
			{ path: 'leagues', component: () => import('pages/LeaguePage.vue') },
			{
				path: 'tournament/:id',
				component: () => import('pages/TournamentPage.vue'),
			},
			{
				path: 'tournament/:tournamentId/match/:id',
				component: () => import('pages/MatchPage.vue'),
			},
		],
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/ErrorNotFound.vue'),
	},
];

export default routes;
