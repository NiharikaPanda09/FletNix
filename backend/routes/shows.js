const express = require('express');
const Show    = require('../models/Show');

const router = express.Router();

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// ─── GET /api/shows ───────────────────────────────────────────────────────────
// Query params: page, limit, search, type, userAge

router.get('/', async (req, res) => {
  try {
    const page    = parseInt(req.query.page,   10) || 1;
    const limit   = parseInt(req.query.limit,  10) || 15;
    const search  = req.query.search?.trim() ?? '';
    const type    = req.query.type?.trim()   ?? '';
    const userAge = parseInt(req.query.userAge, 10);

    const skip  = (page - 1) * limit;
    const query = {};

    if (type)               query.type   = type;
    if (!isNaN(userAge) && userAge < 18) query.rating = { $ne: 'R' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { cast:  { $regex: search, $options: 'i' } },
      ];
    }

    const [totalItems, shows] = await Promise.all([
      Show.countDocuments(query),
      Show.find(query).skip(skip).limit(limit),
    ]);

    return res.status(200).json({
      shows,
      currentPage: page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (err) {
    console.error('[shows/list]', err.message);
    return res.status(500).json({ message: 'Failed to fetch shows.' });
  }
});

// ─── GET /api/shows/:id ───────────────────────────────────────────────────────
// Accepts a MongoDB ObjectId OR a show_id string (e.g. "s1")

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const show = OBJECT_ID_REGEX.test(id)
      ? await Show.findById(id)
      : await Show.findOne({ show_id: id });

    if (!show)
      return res.status(404).json({ message: 'Show not found.' });

    return res.status(200).json(show);
  } catch (err) {
    console.error('[shows/detail]', err.message);
    return res.status(500).json({ message: 'Failed to fetch show details.' });
  }
});

module.exports = router;
