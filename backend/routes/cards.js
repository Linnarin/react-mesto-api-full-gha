const express = require('express');

const router = express.Router();

const {
  createCard,
  getCards,
  deleteCardsId,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const validation = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validation.validateCreateCard, createCard);
router.delete('/:cardId', validation.validateCardId, deleteCardsId);
router.put('/:cardId/likes', validation.validateCardId, likeCard);
router.delete('/:cardId/likes', validation.validateCardId, dislikeCard);
module.exports = router;
