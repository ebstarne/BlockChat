//Need mongoose as the client for the database
const mongoose = require('mongoose');

//dbHandler will do the connecting and closing and clearing of the database
const dbHandler = require('../db-handler.js');
const { collection } = require('../models/User');

//Need our schema models for testing and using
const userModel = require('../models/User');

describe('User Model Test', () => {
  //Connects to an in memory database before the test is run
  //Needs to use wiredTiger approach above to work
  //Currently works correctly
  beforeAll(async () => {
    await dbHandler.connect();
  });

  /**
   * Close the database after all the tests have been run
   */
  afterAll(async () => {
    await dbHandler.closeDatabase();
    app.get('sio').close();
  });

  /**
   * Clear all test data after every test.
   */
  afterEach(async () => await dbHandler.clearDatabase());

  //Start with making a simple user and checking that it is save to DB
  it('save a user', async () => {
    const userData = {
      username: 'DomNom',
      email: 'dommy@gmail.com',
      organization: { name: 'Munch' },
      password: 'yurt',
    };
    const validUser = new userModel(userData);
    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.organization.name).toBe(userData.organization.name);
    expect(savedUser.password).toBe(userData.password);

    //Lets save another user that has no org, should be fine because not required.
    const userData1 = {
      username: 'Tobes',
      email: 'toby@gmail.com',
      password: 'yurtbaba',
    };
    const validUser1 = new userModel(userData1);
    const savedUser1 = await validUser1.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser1._id).toBeDefined();
    expect(savedUser1.username).toBe(userData1.username);
    expect(savedUser1.email).toBe(userData1.email);
    expect(savedUser1.organization.name).toBe(undefined);
    expect(savedUser1.password).toBe(userData1.password);
  });

  //Now lets try making a user with the same username and make sure the error is caught
  // it('saves a second user with a duplicate username, should not save user.', async () => {

  //     const userData = { username: 'DomNom', email: 'dommy@gmail.com', organization: {name: 'Munch'}, password: 'yurt' };
  //     const validUser = new userModel(userData);
  //     const savedUser = await validUser.save();

  //     const userData2 = { username: 'DomNom', email: 'dommy@gmail.com', organization: {name: 'Munch'}, password: 'yurt' };
  //     const validUser2 = new userModel(userData2);

  //     let err;
  //     try { //Try to save the duplicate user
  //         const savedUser2 = await validUser2.save();

  //     } catch (error) {
  //         err = error
  //     }
  //     expect(err).toBeInstanceOf(mongoose.mongo.MongoError) //Make sure the error was thrown
  // });

  //Now lets try making a user with the same email and make sure the error is caught
  //   it('saves a second user with a duplicate email, should not save user.', async () => {
  //     const userData = {
  //       username: 'DomNom',
  //       email: 'dommy@gmail.com',
  //       organization: { name: 'Munch' },
  //       password: 'yurt',
  //     };
  //     const validUser = new userModel(userData);
  //     const savedUser = await validUser.save();

  //     const userData2 = {
  //       username: 'Tobes',
  //       email: 'dommy@gmail.com',
  //       organization: { name: 'Munch' },
  //       password: 'yurt',
  //     };
  //     const validUser2 = new userModel(userData2);

  //     let err;
  //     try {
  //       //Try to save the duplicate user
  //       const savedUser2 = await validUser2.save();
  //     } catch (error) {
  //       err = error;
  //     }
  //     expect(err).toBeInstanceOf(mongoose.mongo.MongoError); //Make sure the error was thrown
  //   });

  //Now lets try making a user who has no password or email specified, the user should not be saved
  it('trys to save a user with no password', async () => {
    const userData = { username: 'DomNom', organization: { name: 'Munch' } };
    const validUser = new userModel(userData);

    let err;
    try {
      //Try to save the duplicate user
      const savedUser = await validUser.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError); //Make sure the error was thrown
    expect(err.errors.password).toBeDefined(); //Check that password is the issue
    expect(err.errors.email).toBeDefined(); //Check that the email is also an issue
  });
});
