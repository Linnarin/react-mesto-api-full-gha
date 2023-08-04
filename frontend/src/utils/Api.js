const apiSetting = {
  url: 'https://api.linnarin.students.nomoredomains.sbs',
  //url: 'http://localhost:3000/',
  headers: {
    authorization: `Bearer ${localStorage.getItem('JWT')}`,
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
 
  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      headers: this._headers,
      credentials: 'include'
    })
      .then(this._checkResponse);
  }

  patchUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: data.name,
        about: data.about
      }),
    })
      .then(this._checkResponse);
  }

  getArrCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers,
      credentials: 'include'
    })
      .then(this._checkResponse);
  }

  postUserCard(data) {//ждем объект
    //debugger;
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify(
        data,
      )
    })
      .then(this._checkResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers,
    })
      .then(this._checkResponse);
  }

  patchAvatar(avatar) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify(avatar),
    })
      .then(this._checkResponse);
  }

  putLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      credentials: 'include',
      headers: this._headers,
    })
      .then(this._checkResponse);
  }

  deleteLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers,
    })
      .then(this._checkResponse);
  }
}

const api = new Api(apiSetting);

export default api;
