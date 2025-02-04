import request from 'supertest';
import app from '../../app.js';
import { clearDatabase, createUser, mockUserFindById } from '../utils/setup.js';
import User from '../../models/User.js';
import sinon from 'sinon';
import { expect } from 'chai';

describe('POST /auth/register', () => {
    beforeEach(async () => {
        await clearDatabase();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should successfully register a new user', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'user123', password: 'password123' });

        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal('Registration successful!');
    });

    it('should return 400 if username or password is missing', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'user123' });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Username and password are required');
    });

    it('should return 400 if username already exists', async () => {
        await createUser('existinguser', 'password123');
        mockUserFindById({ username: 'existinguser' });

        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'existinguser', password: 'password123' });

        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Username already exists');
    });

    it('should return 500 if there is a database error', async () => {
        const originalSave = User.prototype.save;

        User.prototype.save = () => {
            throw new Error('DB error');
        };

        const response = await request(app)
            .post('/auth/register')
            .send({ username: 'user123', password: 'password123' });
        
        User.prototype.save = originalSave;
        expect(response.status).to.equal(500);
        expect(response.body.error).to.equal('An error occurred during registration');
    });
});
