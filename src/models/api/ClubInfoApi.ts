import VenueInfoApi from './VenueInfoApi';

export interface ClubInfoApi {
	id: number;
	name: string;
	streetaddress: string;
	city: string;
	postcode: string;
	region: string;
	email: string;
	phone: string;
	matriculation: number;
	shortname: string;
	isactive: number;
	website: string;
	bankaccount: string | null;
	colorhome1: string;
	colorhome2: string;
	coloraway1: string;
	coloraway2: string;
	type: string;
	asblnumber: string;
	assocuserid1: number;
	assocuserid2: number;
	assocuserid3: number;
	logo: string;
	halls: VenueInfoApi[];
}
