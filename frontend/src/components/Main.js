import React from 'react';
import Card from './Card.js';
import Profileedit from '../images/Profileedit.svg';
import AddButton from '../images/addbutton.svg';
import { useContext } from "react";
import CurrentUserContext from '../contexts/CurrentUserContext.js'

function Main(props) {
  const { onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete} = props;
  const currentUser = useContext(CurrentUserContext);
  return (
    <main>
      <section
        className="profile">
        <div className="profile__data">
          <div className="profile__avatar-container">
            <img
              src={currentUser.avatar} alt="Аватар профиля."
              className="profile__avatar"
              onClick={onEditAvatar} />
          </div>
          <div className="profile__change">
            <div className="profile__info">
              <h1 className="profile__name">{currentUser.name}</h1>
              <p className="profile__profession">{currentUser.about}</p>
            </div>
            <button className="profile__edit" type="button" onClick={onEditProfile}>
              <img className="profile__edit-img" alt="картинка карандаша" src={Profileedit} />
            </button>
          </div>
        </div>
        <button className="profile__add" type="button" onClick={onAddPlace}>
          <img className="profile__add-img" alt="плюс" src={AddButton} />
        </button>
      </section>
      <section
        className="attractions">
          {cards.map((card) => {
            return (
              <Card 
                card={card} 
                key={card._id} 
                onCardClick={onCardClick} 
                currentUser = {currentUser} 
                onCardLike={onCardLike} 
                onCardDelete={onCardDelete}/>
                 )
                })}
      </section>
    </main>
    )
}
export default Main;