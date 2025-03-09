import PlayerStatistics from './PlayerStatistics';

export interface PlayerSeasonInfo {
	seasonId: number;
	seasonName: string;
	clubId: number;
	clubName: string;
	tournament: string;
	statistics: PlayerStatistics;
}

export interface PlayerStatisticsInfo {
	seasons: PlayerSeasonInfo[];
	statistics: PlayerStatistics;
	clubLogos: Record<number, string>;
}
