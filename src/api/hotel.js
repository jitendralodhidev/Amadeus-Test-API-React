import Abstract from './abstract';

export default class Hotel extends Abstract {
  constructor() {
    super();
    // this.constants.ENDPOINT = `${this.constants.BASE_URL}/${this.constants.VERSION}/shopping/flight-offers`;
  }

  getHotel(city) {
    const url = `${this.constants.BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${city}`;
    return this.fetchFromAPI(url);
  }

  hotelOffers(extras) {
    const rQuery = this.getQuery(extras);
    const url = `${this.constants.BASE_URL}/v3/shopping/hotel-offers${rQuery}`
    return this.fetchFromAPI(url);
  }

  getHotelSuggestion(extras) {
    const rQuery = this.getQuery(extras);
    const url = `${this.constants.BASE_URL}/v1/reference-data/locations/hotel${rQuery}`;
    return this.fetchFromAPI(url);
  }

}
