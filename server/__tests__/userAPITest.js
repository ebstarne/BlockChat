//Need mongoose as the client for the database
const mongoose = require('mongoose');

//dbHandler will do the connecting and closing and clearing of the database
const dbHandler = require('../db-handler.js');
const { collection } = require('../models/User');

const app = require('../testServer');

const supertest = require('supertest');
const request = supertest(app);

//Need our schema models for testing and using
const userModel = require('../models/User');

describe('User API Endpoint Test', () => {
  //Connects to an in memory database before the test is run
  //Needs to use wiredTiger approach above to work
  //Currently works correctly
  beforeAll(async () => {
    await dbHandler.connect();
    process.env.ORG = 'GE';
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
 
  const res2 = await request.post('/api/organizations').send({name: 'Galactic Empire'});
  expect(res2.status).toEqual(200);
  process.env.ORG = 'GE';
	
	const res = await request.post('/api/users').send({
    username: 'DomNom',
    email: 'dommy@gmail.com',
    password: 'yurttttttttt',
  });
  expect(res.status).toEqual(200);
  expect(res.body.token).toBeDefined();

  });

  it('tries to save a duplicate user', async () => {

    const res3 = await request.post('/api/organizations').send({name: 'Galactic Empire'});
    expect(res3.status).toEqual(200);

    //First user
    const res = await request.post('/api/users').send({
      username: 'DomNom',
      email: 'dommy@gmail.com',
      password: 'yurttttttttt',
    });
    expect(res.status).toEqual(200);
  
    //Duplicate user
    const res2 = await request.post('/api/users').send({
      username: 'DomNom',
      email: 'dommy@gmail.com',
      password: 'yurttttttttt',
    });
    expect(res2.status).toEqual(400);
    });
})