export default interface PlayerInfo {
	id: number;
	firstname: string;
	lastname: string;
	teamid: number;
	matchid: null;
	goal: number;
	assist: number;
	isgoalkeeper: number;
	saves: string | null;
	goal_conceed: number | null;
	pc_saves: number | null;
	has_stats: boolean | null;
	has_fullstats: boolean;
	mvp: boolean;
	fault: number;
	number: number;
	iscaptain: boolean;
	isprivate: boolean;
	photo: string | 'assets/default/playerW.jpg' | 'assets/default/playerM.jpg';
	sex: 'Male' | 'Female';
	name?: string;
}
