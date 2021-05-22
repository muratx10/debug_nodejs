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
    res.status(400).send({ message: err.message });
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
    res.status(400).send({ message: err.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { id: owner_id } = await req.user;
    const { game: { title, studio, esrb_rating, user_rating, have_played } } = req.body;

    const game = await Game.create({
      title,
      owner_id,
      studio,
      esrb_rating,
      user_rating,
      have_played,
    });

    if (!game) return res.status(400);

    res.status(201).json({
      game: game,
      message: 'Game created',
    });
  } catch (err) {
    res.status(400).send(err.message)
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const { id: owner_id } = await req.user;
    const { id } = req.params;
    const { game: { title, studio, esrb_rating, user_rating, have_played } } = req.body;

    const updatedGame = await Game.update({
        title,
        studio,
        esrb_rating,
        user_rating,
        have_played,
      },
      {
        where: {
          id,
          owner_id,
        },
      });

    if (!updatedGame) return res.status(400);

    console.log(updatedGame)
    res.status(202).json({
      game: updatedGame,
      message: 'Successfully updated.',
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
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

    res.status(204).json({
      game: deletedGame,
      message: 'Successfully deleted',
    })
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
