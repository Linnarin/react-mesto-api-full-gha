function Card(props) {
    const { card, onCardClick, currentUser, onCardLike, onCardDelete } = props;
    const isOwner = card.owner._id === currentUser._id;
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    const cardLikeButtonClassName = (
        `place__like ${isLiked && 'place__like_active'}`
    );
    const cardDeleteButtonClassName = (
        `place__delete ${isOwner && 'place__delete_active'}`
    );

    function handleLike () {
        onCardLike(card);
    }

    function handleDeleteClick() {
        onCardDelete(card);
    }

    function handleCardClick() {
        onCardClick(card);
    }

    return (
        <article className="place">
            <img className="place__img" src={card.link} alt={card.name}
                onClick={handleCardClick} />
            <div className="place__caption">
                <h2 className="place__title">{card.name}</h2>
                <div className="place__like-container">
                    <button type="button" aria-label="Мне нравится." className={cardLikeButtonClassName} onClick={handleLike}/>
                    <span className="place__like-count">{card.likes.length}</span>
                </div>
            </div>
            <button type="button" aria-label="Удалить." className={cardDeleteButtonClassName} onClick={handleDeleteClick}/>
        </article>
    )
}

export default Card;