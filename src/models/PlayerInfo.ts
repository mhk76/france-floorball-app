export interface PlayerPosition {
	position: string;
	'0': string;
}

export default interface PlayerInfo {
	id: number;
	name: string;
	firstname: string;
	lastname: string;
	birthplace: string;
	birthdate: string;
	sex: string;
	email: null;
	phone: null;
	isprivate: number;
	permissions: null;
	admincurseasonid: null;
	streetaddress: null;
	postcode: null;
	city: null;
	documentcertificate: null;
	datecertificate: null;
	doctor: null;
	approvalnumber: null;
	haspassword: null;
	photo: string;
	nationality: null;
	nationality2: null;
	nationality3: null;
	height: number;
	grip_throw: null;
	selectionNT: null;
	selectionNTU19: null;
	age: number;
	licenseOptions: null;
	nat1: string;
	licencenumber: number | null;
	nat2: string;
	nat3: string;
	clubid: number;
	clubname: string;
	clublogo: string;
	position: PlayerPosition[];
	number: number;
	grip: string;
}
