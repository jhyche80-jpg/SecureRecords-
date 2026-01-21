const router = require('express').Router();
const { Note } = require('../../models');
const { authMiddleware } = require('../../utils/auth');

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/notes - Get all notes for the logged-in user
// THIS IS THE ROUTE THAT CURRENTLY HAS THE FLAW
router.get('/', async (req, res) => {
    // This currently finds all notes in the database.
    // It should only find notes owned by the logged in user.
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
            ...req.body, user: req.user._id
            // The user ID needs to be added here
        });
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json(err);
    }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', async (req, res) => {
    try {
        // This needs an authorization check
        const note = await Note.findByIdAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
        if (!note) {
            return res.status(404).json({ message: 'No note found with this id!' });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
    try {
        // This needs an authorization check
        const note = await Note.findByIdAndDelete({ _id: req.params.id, user: req.user._id });
        if (!note) {
            return res.status(404).json({ message: 'No note found with this id!' });
        }
        res.json({ message: 'Note deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET api/notes/:id - get a single note 
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findByID({ _id: req.params.id, user: req.user._id })
        res.json(note)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;