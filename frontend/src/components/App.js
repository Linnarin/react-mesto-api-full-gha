
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import api from '../utils/Api';
import * as auth from "../utils/Auth";
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import InfoTooltip from "./InfoTooltip";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import resolve from "../images/resolve.svg";
import reject from "../images/reject.svg";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [emailName, setEmailName] = React.useState(null);
  const [popupImage, setPopupImage] = React.useState("");
  const [popupTitle, setPopupTitle] = React.useState("");
  const [infoTooltip, setInfoTooltip] = React.useState(false);

  function onRegister(email, password) {
    auth.registerUser(email, password).then(() => {
      setPopupImage(resolve);
      setPopupTitle("Вы успешно зарегистрировались!");
      navigate("/sign-in");
    }).catch(() => {
      setPopupImage(reject);
      setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
    }).finally(handleInfoTooltip);
  }

  function onLogin(email, password) {
    auth.loginUser(email, password).then((res) => {
      localStorage.setItem("jwt", res.token);
      setIsLoggedIn(true);
      setEmailName(email);
      navigate("/");
    }).catch(() => {
      setPopupImage(reject);
      setPopupTitle("Неверная почта или пароль.");
      handleInfoTooltip();
    });
  }

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth.getToken(jwt).then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setEmailName(res.data.email);
        }
      }).catch(console.log)
    }
  }, []);

  React.useEffect(() => {
    if (isLoggedIn === true) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
    setInfoTooltip(false);
  }

  React.useEffect(() => {
    if (isLoggedIn) {
      api.getUserInfo()
        .then((userData) => {
          setCurrentUser(userData);
        })
        .catch(console.log)
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (isLoggedIn) {
      api.getArrCards()
        .then((cardsData) => {
          setCards(cardsData);
        })
        .catch(console.log)
    }
  }, [isLoggedIn]);

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  };

  function handleAddPlaceSubmit(place) {
    api.postUserCard(place)
      .then((newCard) => {
        console.log(newCard);
        setCards([newCard, ...cards])
        closeAllPopups();
      })
      .catch(console.log)
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  };

  function handleUpdateUser(userData) {
    api.patchUserInfo(userData)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch(console.log);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  };

  function handleUpdateAvatar(avatar) {
    api.patchAvatar(avatar)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch(console.log);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleInfoTooltip() {
    setInfoTooltip(true);
  }

  function onSignOut() {
    setIsLoggedIn(false);
    setEmailName(null);
    navigate("/sign-in");
    localStorage.removeItem("jwt");
  }

  function handleCardLike(card) {
    console.log('лайк');
    const isLiked = card.likes.some(i => i === currentUser._id);
    if (!isLiked) {
      console.log(card._id);
      api.putLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(console.log);
    } else {
      console.log('дизлайк');
      api.deleteLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch(console.log);
    }
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch(console.log);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route path="/sign-in" element={
            <>
              <Header title="Регистрация" route="/sign-up" />
              <Login onLogin={onLogin} />
            </>
          } />

          <Route path="/sign-up" element={
            <>
              <Header title="Войти" route="/sign-in" />
              <Register onRegister={onRegister} />
            </>
          } />

          <Route exact path="/" element={
            <>
              <Header title="Выйти" mail={emailName} onClick={onSignOut} route="" />
              <ProtectedRoute
                component={Main}
                isLogged={isLoggedIn}
                currentUser={currentUser}
                cards={cards}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
              <Footer />
            </>
          } />

          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/sign-in"} />} />
        </Routes>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          currentUser={currentUser}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser} />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar} />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit} />

        <InfoTooltip
          image={popupImage}
          title={popupTitle}
          isOpen={infoTooltip}
          onClose={closeAllPopups}
        />

        <PopupWithForm name='delete-card' title='Вы уверены?' btnText='Да' />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
