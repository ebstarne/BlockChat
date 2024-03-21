//Need mongoose as the client for the database
const mongoose = require('mongoose');

//dbHandler will do the connecting and closing and clearing of the database
const dbHandler = require('../db-handler.js');
const { collection } = require('../models/User');

const app = require('../testServer');

const supertest = require('supertest');
const request = supertest(app);

describe('Channel API Endpoint Test', () => {
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
  
    
    //Save a channel through the post endpoint
    it('saves a channel', async () => {
    
    const res = await request.post('/api/channels').send({ name: 'Mighty Quacks', description: 'general' });
    expect(res.status).toEqual(200);

    });

    //Saving a duplicate should give an error code
    it('tries to save a duplicate channel and should throw error code', async () => {
    
        const res = await request.post('/api/channels').send({ name: 'Mighty Quacks', description: 'general' }); 
        expect(res.status).toEqual(200);

        //duplicate
        const res2 = await request.post('/api/channels').send({ name: 'Mighty Quacks', description: 'general' }); 
        expect(res2.status).toEqual(400);

        //Should throw an error still even if the description is different 
        const res3 = await request.post('/api/channels').send({ name: 'Mighty Quacks', description: 'different' });
        expect(res3.status).toEqual(400);

        //Make sure its also okay to now save one after some errors
        const res4 = await request.post('/api/channels').send({ name: 'New York Football Jets', description: 'different' }); 
        expect(res4.status).toEqual(200);
    
    });

    //The get endpoint should return all the channels
    it('tests the get endpoint', async () => {
    
        //Lets post two channels
        const res = await request.post('/api/channels').send({ name: 'Mighty Quacks', description: 'general' }); 
        expect(res.status).toEqual(200);

        const res2 = await request.post('/api/channels').send({ name: 'New York Football Jets', description: 'different' }); 
        expect(res2.status).toEqual(200);

        //Now lets try the get endpoint to see if it returns the two channels
        const res3 = await request.get('/api/channels');
        expect(res3.status).toEqual(200);
        expect(res3.body.length).toEqual(2);
        expect(res3.body[0].name).toEqual('Mighty Quacks');
        expect(res3.body[1].name).toEqual('New York Football Jets');
    
    });

    //Now testing the get channel by ID endpoint
    it('tests the get by id endpoint', async () => {
    
        //Lets post two channels
        const res = await request.post('/api/channels').send({ name: 'Mighty Quacks', description: 'general' }); 
        expect(res.status).toEqual(200);

        const res2 = await request.post('/api/channels').send({ name: 'New York Football Jets', description: 'different' }); 
        expect(res2.status).toEqual(200);

        //Now lets try the get endpoint to see if it returns the channel we want
        const res3 = await request.get(`/api/channels/${res2.body._id}`); 
        expect(res3.status).toEqual(200);
        expect(res3.body.name).toEqual('New York Football Jets');

        //Lets do some error checking
        try{
          const res4 = await request.get(`/api/channels/1234`); 
        } catch(err) {
          expect(res4.status).toEqual(404);
        }

        let beepboop = 1234567890;
        const res5 = await request.get(`/api/channels/${beepboop}`); 
        expect(res5.status).toEqual(404);
        
    });

    //Now testing if we can delete channels using the api endpoint
    it('tests the delete by id endpoint', async () => {
    
        //Lets post two channels
        const res = await request.post('/api/channels').send({ name: 'Mighty Quacks', description: 'general' }); 
        expect(res.status).toEqual(200);

        const res2 = await request.post('/api/channels').send({ name: 'New York Football Jets', description: 'different' }); 
        expect(res2.status).toEqual(200);

        //Make sure the channels are posted and available to get
        const res3 = await request.get('/api/channels');
        expect(res3.status).toEqual(200);
        expect(res3.body.length).toEqual(2);
        expect(res3.body[0].name).toEqual('Mighty Quacks');
        expect(res3.body[1].name).toEqual('New York Football Jets');

        //Now lets try to delete one of the channels
        const res4 = await request.delete(`/api/channels/${res.body._id}`);
        expect(res4.status).toEqual(200);
        const res5 = await request.get('/api/channels');
        expect(res5.body.length).toEqual(1);

        //Now lets try to delete the channel again to see if it throws an error
        const res6 = await request.delete(`/api/channels/12345`);
        expect(res6.status).toEqual(404); //error code
        const res7 = await request.get('/api/channels');
        expect(res7.body.length).toEqual(1); //Make sure nothing was changed
        
    });
  
  })