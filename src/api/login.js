import Abstract from './abstract';
import config from '../config';
import Password from 'antd/es/input/Password';

export default class Login extends Abstract {
  /**
   * Constructor
  **/
  constructor() {
    super();
    this.constants.ENDPOINT = `${this.constants.BASE_URL}/v1/security/oauth2/token`;
  }

  /**
   * Helper function to generated header by fetching CSRF token from cookies
   * @return {object}
  **/
  async getToken({ username, password }) {
    const params = new URLSearchParams();
    params.append('grant_type', config.grantType);
    params.append('client_id', config.clientId);
    params.append('client_secret', config.clientSecret);
    if (username === config.userName && password === config.password) {
      try {
        const res = await fetch(`${this.constants.ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        });
        const data = await res.json();
        return { ...data, msg: 'Login successfully' };
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    } else {
      return ({ error: { msg: 'Invalid User name' } });
    }
  }

}