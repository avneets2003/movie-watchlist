import request from 'supertest';
import app from '../../app.js';
import { clearDatabase, mockUserFindById } from '../utils/setup.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import { expect } from 'chai';

describe('Watched List API', () => {
    let user;
    const movie = {
        movieId: '12345',
        title: 'Test Movie',
        rating: 8.5,
        poster: '/path/to/poster.jpg',
    };

    beforeEach(async () => {
        await clearDatabase();
        user = new User({ username: 'testuser', password: 'password123', watchlist: [], watched: [movie] });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        user.token = token;
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /users/watched', () => {
        it('should successfully get the watched list for a user', async () => {
            mockUserFindById(user);

            const response = await request(app)
                .get('/users/watched')
                .set('Authorization', `Bearer ${user.token}`);

            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.equal(true);
            expect(response.body[0].movieId).to.equal('12345');
            expect(response.body[0].title).to.equal('Test Movie');
        });

        it('should return an empty array if the watched list is empty', async () => {
            user.watched = [];
            await user.save();
            mockUserFindById(user);

            const response = await request(app)
                .get('/users/watched')
                .set('Authorization', `Bearer ${user.token}`);

            expect(response.status).to.equal(200);
            expect(Array.isArray(response.body)).to.equal(true);
            expect(response.body.length).to.equal(0);
        });
    });
});
