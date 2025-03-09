import { useDataStore } from 'src/stores/dataStore';
import {
	PlayerSeasonApi,
	PlayerSeasonInfoApi,
} from 'src/models/api/PlayerSeasonApi';
import {
	PlayerStatisticsInfo,
	PlayerSeasonInfo,
} from 'src/models/PlayerStatisticsInfo';
import PlayerStatistics from 'src/models/PlayerStatistics';
import LogoInfo from 'src/models/LogoInfo';
import API from 'src/enums/API';

const data = useDataStore();

export async function usePlayerStatisticsInfo(
	playerId: number
): Promise<PlayerStatisticsInfo> {
	const api = await data.load<PlayerSeasonApi>(
		`player-stats-${playerId}`,
		API.PLAYER_INFO,
		{
			command: 'season',
			id: playerId,
		}
	);

	return {
		seasons: api.seasons.map(
			(season) =>
				({
					seasonId: season.season_id,
					seasonName: season.season_name,
					clubId: season.club_id,
					clubName: season.club_name,
					tournament: season.agecategory,
					statistics: {
						isGoalkeeper: season.player.isgoalkeeper === 1,
						gamesPlayed: season.player.games_played,
						saves: season.player.saves,
						goalsConceeded: season.player.goal_conceed,
						savePercent:
							season.player.saves /
							(season.player.saves + season.player.goal_conceed),
						goals: season.player.goal,
						assists: season.player.assist,
						mvpCount: season.player.assist,
					} as PlayerStatistics,
				} as PlayerSeasonInfo)
		),
		statistics: api.seasons.reduce(
			(stats: PlayerStatistics, season: PlayerSeasonInfoApi) => {
				stats.isGoalkeeper ||= season.player.isgoalkeeper === 1;
				stats.gamesPlayed += season.player.games_played;
				stats.saves += season.player.saves;
				stats.goalsConceeded += season.player.goal_conceed;
				stats.savePercent =
					stats.saves / (stats.saves + stats.goalsConceeded);
				stats.goals += season.player.goal;
				stats.assists += season.player.assist;
				stats.mvpCount += season.player.assist;

				return stats;
			},
			{
				isGoalkeeper: false,
				gamesPlayed: 0,
				saves: 0,
				goalsConceeded: 0,
				savePercent: 0,
				goals: 0,
				assists: 0,
				mvpCount: 0,
			} as PlayerStatistics
		),
		clubLogos: api.list_logo.reduce(
			(list: Record<number, string>, logo: LogoInfo) => {
				list[logo.id] = logo.logo;

				return list;
			},
			{} as Record<number, string>
		),
	} as PlayerStatisticsInfo;
}
