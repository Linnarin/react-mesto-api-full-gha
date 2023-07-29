import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
    const { isOpen, onClose, onAddPlace } = props;
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    function handleNameChange(evt) {
        setName(evt.target.value);
    }

    function handleLinkChange(evt) {
        setLink(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        onAddPlace({
            name,
            link,
        });
    }

    React.useEffect(() => {
        if (props.isOpen) {
          setName('');
          setLink('');
        }
      }, [props.isOpen]);
      
    return (
        <PopupWithForm
            name='add-card'
            title='Новое место'
            btnText='Создать'
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}>
        <input
            type="text"
            required
            minLength="2" maxLength="30"
            id="popuptitle"
            name="name"
            placeholder="Название"
            className="popup__input-text"
            onChange={handleNameChange} 
            value={name}/>
        <span className="popuptitle-error popup__input-text-error" />
        <input
            type="url"
            required
            id="popupurl"
            name="link"
            placeholder="Ссылка на картинку"
            className="popup__input-text"
            onChange={handleLinkChange} 
            value={link}/>
            <span className="popupurl-error popup__input-text-error" />
        </ PopupWithForm>
    )
}

export default AddPlacePopup;