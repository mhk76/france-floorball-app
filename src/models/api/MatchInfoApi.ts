import VenueInfoApi from './VenueInfoApi';

export default interface MatchInfoApi {
	id: number;
	active: boolean | null;
	date: string;
	time: string;
	competition_id: number;
	competition_name: string;
	round_id: number;
	round_name: string;
	description: string;
	score_home: number;
	score_away: number;
	is_confirmed: boolean;
	is_live: boolean;
	is_played: boolean;
	is_started: boolean;
	comments: string | null;
	attendance: number | null;
	team_home_name: string;
	team_away_name: string;
	team_home_logo: string | null;
	team_away_logo: string | null;
	team_home_id: number;
	team_away_id: number;
	club_home_id: number;
	club_away_id: number;
	sporthall_id: number;
	fault_home: number;
	fault_away: number;
	bonus_off_home: number;
	bonus_def_home: number;
	bonus_off_away: number;
	bonus_def_away: number;
	sporthall: VenueInfoApi | null;
	is_forfait_home: boolean;
	is_forfait_away: boolean;
	is_forfait_both: boolean;
	is_canceled: boolean;
	reason_of_cancel: string | null;
	remarkable_conditions: string | null;
	score1H: number;
	score2H: number;
	score3H: number;
	scoreXTH: number;
	scorepenH: number;
	score1A: number;
	score2A: number;
	score3A: number;
	scoreXTA: number;
	scorepenA: number;
	team_home_color: string;
	team_away_color: string;
	daydiff?: number;
	scoreH: number;
	scoreA: number;
}