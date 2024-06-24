import Abstract from './abstract';

export default class Flight extends Abstract {
  constructor() {
    super();
    this.constants.ENDPOINT = `${this.constants.BASE_URL}/${this.constants.VERSION}/shopping/flight-offers`;
  }

  getOffers(extras) {
    const rQuery = this.getQuery(extras);
    const url = `${this.constants.ENDPOINT}${rQuery}`;
    return this.fetchFromAPI(url);
  }

  getSuggestions(type, keyword) {
    const url = `${this.constants.BASE_URL}/v1/reference-data/locations?subType=${type}&keyword=${keyword}`;
    return this.fetchFromAPI(url);
  }

  bookTicket(data) {
    const url = `${this.constants.BASE_URL}v1/booking/flight-orders`;
    return this.save(url, data);
  }
}
