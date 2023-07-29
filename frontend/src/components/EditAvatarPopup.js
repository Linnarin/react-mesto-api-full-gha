import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
    const { isOpen, onClose, onUpdateAvatar } = props;
    const ref = React.useRef();

    function handleSubmit(evt) { 
        evt.preventDefault();
        onUpdateAvatar({
            avatar: ref.current.value
        });
    }

    React.useEffect(() => {
        ref.current.value = '';
      }, [props.isOpen]);

    return (
        <PopupWithForm
            name='avatar'
            title='Обновить аватар'
            btnText='Создать'
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}>
            <input
                type="url"
                required
                id="avatar"
                name="avatar"
                placeholder="Ссылка на картинку"
                className="popup__input-text"
                ref={ref} />
            <span className="popup__input-text-error" />
        </ PopupWithForm>
    )
}

export default EditAvatarPopup;