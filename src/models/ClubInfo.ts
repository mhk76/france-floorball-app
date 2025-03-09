import VenueInfo from './VenueInfo';

export interface ClubInfo {
	id: number;
	name: string;
	shortName: string;
	streetAddress: string;
	postCode: string;
	city: string;
	region: string;
	email: string;
	phone: string;
	website: string;
	colorHome1: string;
	colorHome2: string;
	colorAway1: string;
	colorAway2: string;
	logo: string;
	halls: VenueInfo[];
}
