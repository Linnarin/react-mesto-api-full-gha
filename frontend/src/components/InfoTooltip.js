import closeIcon from '../images/CloseIcon.svg';

function InfoTooltip(props) {
  const { isOpen, onClose } = props;
  const popupClass = isOpen ? ('popup popup_opened') : ('popup');

    return (
      <div className={popupClass}>
        <div className="popup__info">
          <img className="popup__result" src={props.image} alt={props.title}/>
          <h2 className="popup__message">{props.title}</h2>
          <button type="button" className="popup__close" onClick={onClose}>
            <img className="popup__close-img" src={closeIcon} />
          </button>
        </div>
      </div>
    );
  }
  
  export default InfoTooltip;