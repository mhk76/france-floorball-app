import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		children: [
			{ path: '', component: () => import('pages/IndexPage.vue') },
			{ path: 'leagues', component: () => import('pages/LeaguePage.vue') },
			{
				path: 'tournament/:id',
				component: () => import('pages/TournamentPage.vue'),
			},
			{
				path: 'tournament/:tournamentId/match/:id',
				component: () => import('pages/MatchPage.vue'),
			},
			{ path: 'match/:id', component: () => import('pages/MatchPage.vue') },
			{
				path: 'clubs',
				component: () => import('pages/ClubListPage.vue'),
			},
			{
				path: 'clubs/:id',
				component: () => import('pages/ClubPage.vue'),
			},
			{
				path: 'players/:id',
				component: () => import('pages/PlayerPage.vue'),
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
