import request from 'supertest';
import app from '../../app.js';
import { clearDatabase, createUser, mockUserFindById } from '../utils/setup.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import { expect } from 'chai';

describe('POST /auth/login', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should successfully log in a user with correct credentials', async () => {
        const user = await createUser('user123', 'password123');
        
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'user123', password: 'password123' });

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Login successful');
        expect(response.body.token).to.not.be.empty;
        expect(jwt.verify(response.body.token, process.env.JWT_SECRET)).to.have.property('userId', user._id.toString());
    });

    it('should return 400 if username does not exist', async () => {
        mockUserFindById(null);

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'nonexistentuser', password: 'password123' });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('User not found');
    });

    it('should return 400 if password is incorrect', async () => {
        const user = await createUser('user123', 'password123');
        mockUserFindById(user);

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'user123', password: 'wrongpassword' });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Invalid password');
    });

    it('should return 400 if username or password is missing', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'user123' });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Username and password are required');
    });

    it('should return 500 if there is a database error', async () => {
        sinon.stub(User, 'findOne').throws(new Error('DB error'));

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'user123', password: 'password123' });

        User.findOne.restore();
        expect(response.status).to.equal(500);
        expect(response.body.error).to.equal('An error occurred during login');
    });
});
