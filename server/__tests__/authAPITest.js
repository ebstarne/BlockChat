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

describe('Auth API Endpoint Test', () => {
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
  it('saves a user, then authenticates and gets token', async () => {
  process.env.ORG = 'GE';
 
  const res2 = await request.post('/api/organizations').send({name: 'Galactic Empire'});
  expect(res2.status).toEqual(200);
	
	const res = await request.post('/api/users').send({
    username: 'DomNom',
    email: 'dommy@gmail.com',
    password: 'yurttttttttt',
  });
  expect(res.status).toEqual(200);
  expect(res.body.token).toBeDefined();

  //Try to authenticate and get the token
  const res1 = await request.post('/api/auth').send({
    username: 'DomNom',
    password: 'yurttttttttt',
  });
  expect(res1.status).toEqual(200);

  //Lets pass invalid credentials
  const res3 = await request.post('/api/auth').send({
    username: 'Dom',
    password: 'yurttttttttt',
  });
  expect(res3.status).toEqual(400);

  //Lets pass invalid credentials again but password this time
  const res4 = await request.post('/api/auth').send({
    username: 'DomNom',
    password: 'yurtttt',
  });
  expect(res4.status).toEqual(400);

  //Lets pass invalid credentials again but this time we dont pass some fields
  const res5 = await request.post('/api/auth').send({
    password: 'yurttttttttt',
  });
  expect(res5.status).toEqual(400);

  });

  it('tests the get authorized user endpoint', async () => {
    process.env.ORG = 'GE';

    const res3 = await request.post('/api/organizations').send({name: 'Galactic Empire'});
    expect(res3.status).toEqual(200);

    //First user
    const res = await request.post('/api/users').send({
      username: 'DomNom',
      email: 'dommy@gmail.com',
      password: 'yurttttttttt',
    });
    expect(res.status).toEqual(200);

    //Try to authenticate and get the token
    const res1 = await request.post('/api/auth').send({
        username: 'DomNom',
        password: 'yurttttttttt',
    });
    expect(res1.status).toEqual(200);
    const token = res1.body.token;
  
    const res2 = await request.get('/api/auth').set( { 'x-auth-token': token, 'Content-Type':'application/json' } )
    expect(res2.status).toEqual(200);

    });
})