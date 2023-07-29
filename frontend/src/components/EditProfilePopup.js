import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditProfilePopup(props) {
    const { isOpen, onClose, currentUser, onUpdateUser } = props;
    const [name, setName] = React.useState(currentUser.name);
    const [description, setDescription] = React.useState(currentUser.about);

    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen ]);

    function handleNameChange(evt) {
        setName(evt.target.value);
    }

    function handleDescriptionChange(evt) {
        setDescription(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();
        onUpdateUser({
            name,
            about: description
        });
    }

    return (
        <PopupWithForm
            name='profile'
            title='Редактировать профиль'
            btnText='Сохранить'
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}>
            <input
                type="text"
                id="nameform"
                required
                minLength="2" maxLength="40"
                name="name"
                placeholder="Имя"
                className="popup__input-text"
                value={(name !== null && name !== undefined) ? name : ''}
                onChange={handleNameChange} />
            <span className="nameform-error popup__input-text-error" />
            <input
                type="text"
                id="professionform"
                required
                minLength="2" maxLength="200"
                name="about"
                placeholder="Описание"
                className="popup__input-text"
                value={(description !== null && description !== undefined) ? description : ''}
                onChange={handleDescriptionChange} />
            <span className="professionform-error popup__input-text-error" />
        </PopupWithForm>
    )
}

export default EditProfilePopup;