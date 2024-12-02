export default interface RankingInfo {
	id_rk: number;
	team_id: number;
	team_name: string;
	round_id: number;
	ranking_order: number;
	PTS: number;
	GP: number;
	WIN: number;
	OT_WIN: number;
	DRAW: number;
	OT_LOST: number;
	LOST: number;
	FORFEIT: number;
	BONUS_OFF: number;
	BONUS_DEF: number;
	points_modification: number;
	GOAL_FOR: number;
	GOAL_AGAINST: number;
	GOAL_DIFF: number;
	FAULT: number;
	clubid: number;
}
