import Abstract from './abstract';

export default class Travel extends Abstract {
  constructor() {
    super();
  }

  getSuggestions(location) {
    const rQuery = this.getQuery(location);
    const url = `${this.constants.BASE_URL}/v1/reference-data/locations/pois${rQuery}`;
    return this.fetchFromAPI(url);
  }
}
