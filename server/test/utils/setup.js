import mongoose from 'mongoose';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import sinon from 'sinon';
import axios from 'axios';

const clearDatabase = async () => {
    await User.deleteMany();
};

const createUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    return user;
};

const mockAxios = (movieDetailsResponse, creditsResponse) => {
    sinon.stub(axios, 'get')
        .onFirstCall().resolves({ data: movieDetailsResponse })
        .onSecondCall().resolves({ data: creditsResponse });
};

const mockUserFindById = (userResponse) => {
    sinon.stub(User, 'findById').resolves(userResponse);
};

before(async () => {
    mongoose.connect('mongodb://localhost:27017/test_db', { useNewUrlParser: true, useUnifiedTopology: true });
});

after(async () => {
    await clearDatabase();
    await mongoose.connection.close();
});

export { clearDatabase, createUser, mockAxios, mockUserFindById };
