export default interface PlayerStatisticsApi {
	isgoalkeeper: number;
	pc_saves: number;
	saves: number;
	goal_conceed: number;
	games_played: number;
	goal: number;
	assist: number;
	mvp: number;
	fault: number;
	position?: string;
}
