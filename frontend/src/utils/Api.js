const apiSetting = {
  url: 'https://api.linnarin.students.nomoredomains.sbs',
  //url: 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
};

class Api {
  constructor(data) {
    this._url = data.url;
    this._headers = data.headers;
  }
  
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      Promise.reject(res.status);
    }
  }

  _getHeaders() {
    return {
      ...this._headers,
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    }
  }
 
  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      headers: this._getHeaders(),
    })
      .then(this._checkResponse);
  }

  patchUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify({
        name: data.name,
        about: data.about
      }),
    })
      .then(this._checkResponse);
  }

  getArrCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._getHeaders(),
    })
      .then(this._checkResponse);
  }

  postUserCard(data) {//ждем объект
    //debugger;
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(
        data,
      )
    })
      .then(this._checkResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    })
      .then(this._checkResponse);
  }

  patchAvatar(avatar) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._getHeaders(),
      body: JSON.stringify(avatar),
    })
      .then(this._checkResponse);
  }

  putLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._getHeaders(),
    })
      .then(this._checkResponse);
  }

  deleteLike(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: this._getHeaders(),
    }).then((res) => {
      return this._handleRes(res);
    });
  }
}

const api = new Api(apiSetting);

export default api;
