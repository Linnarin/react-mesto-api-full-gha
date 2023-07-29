import closeIcon from '../images/CloseIcon.svg';

function PopupWithForm(props) {
    const { name, title, btnText, children, isOpen, onClose, onSubmit} = props;

    const popupClass = isOpen ? ('popup popup_opened') : ('popup');

    return (
        <div className={popupClass}>
            <div className="popup__container">
                <h2 className="popup__title">{title}</h2>
                <form name={name} noValidate method="post" className={`popup__input`} onSubmit={onSubmit}>
                    {children}
                    <button type="submit" className="popup__btn">{btnText}</button>
                </form>
                <button type="button" className="popup__close" onClick={onClose}>
                    <img className="popup__close-img" src={closeIcon} />
                </button>
            </div>
        </div>
    )

}

export default PopupWithForm;