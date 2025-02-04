import User from '../models/User.js';

const getWatchlist = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId }).populate('watchlist');
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const getWatchedList = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.userId}).populate('watched');
        res.json(user.watched);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const userController = { getWatchlist, getWatchedList };
export default userController;
