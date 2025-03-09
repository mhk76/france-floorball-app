import VenueInfoApi from 'src/models/api/VenueInfoApi';
import VenueInfo from 'src/models/VenueInfo';

export function useVenueInfoMapper(api: VenueInfoApi): VenueInfo {
	return {
		id: api.id,
		name: api.name,
		address: api.streetaddress,
		postCode: api.postcode,
		city: api.city,
		email: api.email,
		phoneNumber: api.phone,
	};
}
