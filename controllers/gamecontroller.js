const router = require('express').Router();
const { Game } = require('../db');

router.get('/all', async (req, res) => {
  try {
    const games = await Game.findAll({
      where: {
        owner_id: req.user.id,
      },
    });

    if (!games) return res.status(404).send({ message: 'Data not found' });

    res.status(200).json({
      games,
      message: 'All games fetched.',
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findOne({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    if (!game) return res.status(404).send({ message: 'Data not found' });

    res.status(200).json({
      game,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const game = await Game.create({
      title: req.body.game.title,
      owner_id: req.body.user.id,
      studio: req.body.game.studio,
      esrb_rating: req.body.game.esrb_rating,
      user_rating: req.body.game.user_rating,
      have_played: req.body.game.have_played,
    });

    if (!game) return res.status(400);

    res.status(200).json({
      game: game,
      message: 'Game created',
    });
  } catch (err) {
    res.status(500).send(err.message)
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const updatedGame = await Game.update({
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played,
      },
      {
        where: {
          id: req.params.id,
          owner_id: req.body.user.id,
        },
      });

    if (!updatedGame) return res.status(400);

    res.status(200).json({
      game: updatedGame,
      message: 'Successfully updated.',
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.delete('/remove/:id', async (req, res) => {
  try {
    const deletedGame = await Game.destroy({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      },
    });

    if (!deletedGame) return res.status(404).send({ message: 'Game with such ID not found.' });

    res.status(200).json({
      game: deletedGame,
      message: 'Successfully deleted',
    })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;
