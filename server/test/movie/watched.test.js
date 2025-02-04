import request from 'supertest';
import app from '../../app.js';
import { clearDatabase, createUser, mockAxios } from '../utils/setup.js';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import { expect } from 'chai';

describe('Watched List API', () => {
    let movieId = '12345';
    let user;

    beforeEach(async () => {
        await clearDatabase();
        user = await createUser('testuser', 'password123');
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('POST /movies/watched', () => {
        it('should successfully add a movie to the watched list', async () => {
            const movieDetails = { title: 'Test Movie', poster_path: '/path.jpg', vote_average: 8.5, genres: [{ name: 'Action' }] };
            const creditsResponse = { cast: [{ name: 'Actor 1' }, { name: 'Actor 2' }, { name: 'Actor 3' }, { name: 'Actor 4' }, { name: 'Actor 5' }] };
            mockAxios(movieDetails, creditsResponse);

            const response = await request(app)
                .post('/movies/watched')
                .set('Authorization', `Bearer ${user.token}`)
                .send({ movieId });

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Movie added to watched list');
        });

        it('should return 400 if movie is already in watched list', async () => {
            const movie = {
                movieId: '12345',
                title: 'Test Movie',
                rating: 8.5,
                poster: '/path/to/poster.jpg',
            };
            user.watched.push(movie);
            await user.save();

            const response = await request(app)
                .post('/movies/watched')
                .set('Authorization', `Bearer ${user.token}`)
                .send({ movieId });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal('Movie already in watched list');
        });
    });

    describe('DELETE /movies/watched', () => {
        it('should successfully delete a movie from the watched list', async () => {
            const movie = {
                movieId: '12345',
                title: 'Test Movie',
                rating: 8.5,
                poster: '/path/to/poster.jpg',
            };

            user.watched.push(movie);
            await user.save();

            const response = await request(app)
                .delete('/movies/watched')
                .set('Authorization', `Bearer ${user.token}`)
                .send({ movieId });

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Movie removed from watched list');
        });

        it('should return 404 if movie not in watched list', async () => {
            const response = await request(app)
                .delete('/movies/watched')
                .set('Authorization', `Bearer ${user.token}`)
                .send({ movieId });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal('Movie not found in watched list');
        });
    });
});
