const router = require('express').Router();
const { Note } = require('../../models/Note');
const { authMiddleware } = require('../../utils/auth');

router.use(authMiddleware);

// GET /api/notes - Get all notes for logged-in user
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id });
        res.json(notes);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
    try {
        const note = await Note.create({
            title: req.body.title,
            content: req.body.content,
            user: req.user._id
        });
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json(err);
    }
});

// PUT /api/notes/:id - Update a note (owner only)
router.put('/:id', async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        res.json(note);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE /api/notes/:id - Delete a note (owner only)
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        res.json({ message: 'Note deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET /api/notes/:id - Get a single note (owner only)
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({ message: 'Note not found or unauthorized' });
        }

        res.json(note);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
