import LogoInfoApi from './LogoInfoApi';
import PlayerStatisticsApi from './PlayerStatisticsApi';

export interface PlayerSeasonInfoApi {
	player: PlayerStatisticsApi;
	season_id: number;
	current_season: number;
	season_name: string;
	position?: string;
	number?: number;
	team_id: number;
	team_name: string;
	club_id: number;
	club_name: string;
	agecategory: string;
}

export interface PlayerSeasonApi {
	info: string;
	seasons: PlayerSeasonInfoApi[];
	list_logo: LogoInfoApi[];
}
