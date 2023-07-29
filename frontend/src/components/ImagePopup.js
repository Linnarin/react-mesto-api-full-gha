import closeIcon from '../images/CloseIcon.svg';

function ImagePopup (props) {
    const { card, onClose } = props;
    
    const popupClass = card._id ? ('popup popup-img popup_opened') : ('popup popup-img');
  
    return (
      <div className={popupClass}>
      <div className="popup-img">
        <div className="popup__img-container">
          <img className="popup__photo" alt={card.name} src={card.link} />
          <button type="button" className="popup__close" onClick={onClose}>
        <img className="popup__close-img" src={closeIcon}/>
        </button>
          <h2 className="popup__title-photo">{card.name}</h2>
        </div>
      </div>
    </div>
  )
  }
  export default ImagePopup;