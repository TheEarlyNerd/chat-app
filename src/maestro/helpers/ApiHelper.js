import { Helper } from 'react-native-maestro';
import mime from 'react-native-mime-types';

export default class ApiHelper extends Helper {
  static get instanceKey() {
    return 'apiHelper';
  }

  _host = (__DEV__) ? 'http://localhost:8000' : 'https://api.webabble.com';

  get(options) {
    return this._request({ ...options, method: 'GET' });
  }

  put(options) {
    return this._request({ ...options, method: 'PUT' });
  }

  post(options) {
    return this._request({ ...options, method: 'POST' });
  }

  patch(options) {
    return this._request({ ...options, method: 'PATCH' });
  }

  delete(options) {
    return this._request({ ...options, method: 'DELETE' });
  }

  uploadFiles(options) {
    const formData = new FormData();

    options.files.forEach(file => {
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: mime.lookup(file.uri),
      });
    });

    if (options.data) {
      Object.key(options.data).forEach(key => {
        if (options.data[key] !== undefined) {
          formData.append(key, options.data[key]);
        }
      });
    }

    return this._request({
      ...options,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options.headers,
      },
    });
  }

  async _request(options) {
    const { userManager } = this.maestro.managers;
    const { dataHelper } = this.maestro.helpers;
    let requestUrl = this._host + options.path;

    options.headers = options.headers || {};
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    options.headers['X-Access-Token'] = (userManager.store.user) ? userManager.store.user.accessToken : null;

    const requestOptions = {
      headers: options.headers,
      method: options.method,
      body: (options.headers['Content-Type'] === 'application/json') ? JSON.stringify(options.data) : options.data,
    };

    if (options.queryParams) {
      const queryString = Object.keys(options.queryParams).reduce((accumulator, paramName) => {
        const paramValue = (typeof options.queryParams[paramName] === 'object')
          ? JSON.stringify(options.queryParams[paramName])
          : options.queryParams[paramName];

        accumulator.push(`${encodeURIComponent(paramName)}=${encodeURIComponent(paramValue)}`);

        return accumulator;
      }, []).join('&');

      requestUrl = `${requestUrl}?${queryString}`;
    }

    const response = await fetch(requestUrl, requestOptions);

    if (response.status === 401) {
      userManager.logout();
      return {};
    }

    return {
      code: response.status,
      body: (response.status !== 204) ? dataHelper.normalizeDataObject(await response.json()) : '',
    };
  }
}
