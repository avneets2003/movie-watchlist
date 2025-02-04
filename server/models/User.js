import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchlist: [{
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    poster: { type: String, required: true },
    rating: { type: Number, required: true },
    genres: [String],
    cast: [String],
  }],
  watched: [{
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    poster: { type: String, required: true },
    rating: { type: Number, required: true },
    genres: [String],
    cast: [String],
  }],
});

const User = mongoose.model('User', userSchema, 'users');

export default User;
