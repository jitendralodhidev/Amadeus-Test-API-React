import Cookies from 'js-cookie';

const BASE_API_URL = 'https://test.api.amadeus.com';

export default class Abstract {
  /**
   * Constructor
  **/
  constructor() {
    const err = {
      100: 'Cannot instantiate an abstract class.',
    };

    if (new.target === Abstract) {
      throw new TypeError(err[100]);
    }

    this.constants = {
      BASE_URL: BASE_API_URL,
      VERSION: 'v2',
    };
  }

  /**
   * Helper function to generated header by fetching CSRF token from cookies
   * @return {object}
  **/
  getHeaders() {
    const token = Cookies.get('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Hit DELETE {this.constants.ENDPOINT}/{id}
   * @param {integer} id of the analysis
   * @return {object}
  **/
  async delete(id) {
    const query = this.getQuery();
    const res = await fetch(
      `${this.constants.ENDPOINT}/${id}${query}`,
      {
        headers: this.getHeaders(),
        method: 'DELETE',
      }
    );
    return this._handleError(res);
  }


  /**
   * Fetches data from the given API URL using a GET request.
   * @param {string} url - The API endpoint to fetch data from.
   * @returns {Promise<Object|null>} - Resolves to JSON data if successful, otherwise handles error.
  **/
  async fetchFromAPI(url) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (res.ok) {
        return res.json();
      } else {
        return this._handleError(res);
      }
    } catch (error) {
      console.error(`Error fetching from API: ${url}`, error);
    }
  }

  /**
   * Hit GET {this.constants.ENDPOINT}/id to get user detail
   * @param {string} id of the user
   * @param {object} extras
   * @return {object}
  **/
  async getDetail(id, extras = {}) {
    const rQuery = this.getQuery(extras);
    const res = await fetch(
      `${this.constants.ENDPOINT}/${id}${rQuery}`,
      { method: 'GET' },
    );
    return this._handleError(res);
  }

  /**
   * Helper to get query
   * @param {object} query
   * @return {object}
  **/
  getQuery(query = {}) {
    const all = { ...this.query, ...query };
    return Object.keys(all).reduce((rQuery, param) => `${rQuery}&${param}=${all[param]}`, '?');
  }

  /**
   * Hit PUT/POST {this.constants.ENDPOINT}/{id}
   * to save user detail
   * @param {object} user detail
   * @return {object}
  **/
  async save(url, obj) {
    const res = await fetch(url,
      {
        method: obj.id ? 'PUT' : 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(obj)
      }
    );
    if (res.ok) {
      return res.json();
    } else {
      return this._handleError(res);
    }
  }

  /**
   * Protected function to handle any error response
   * @param {object} res from an api request
   * @return {object}
  **/
  async _handleError(res) {
    const errorMsgs = {
      401: 'You don\'t have access to this resource.',
      404: 'Resource not found.',
      500: 'Error retrieving data from API!',
    };

    if (res.status === 401) {
      window.location.href = '/login';
      return {
        error: true,
        msg: 'Session Expired, Please login again',
      };
    }

    if ([200, 201, 202, 204].indexOf(res.status) === -1) {
      let original;
      try {
        original = await res.json() || {};
      } catch (e) {
        original = {};
      }

      return {
        error: true,
        msg: original.errors[0].detail || original.error || errorMsgs[res.status] || errorMsgs[500],
      };
    }

    const contentType = res.headers.get('content-type');
    const isJson = (contentType && contentType.indexOf('application/json') !== -1)
      && ['No Content', 'Not Found'].indexOf(res.statusText) === -1;
    return isJson ? await res.json() : res;
  }

}