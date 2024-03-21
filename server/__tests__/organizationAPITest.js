//Need mongoose as the client for the database
const mongoose = require('mongoose');

//dbHandler will do the connecting and closing and clearing of the database
const dbHandler = require('../db-handler.js');
const { collection } = require('../models/User');

const app = require('../testServer');

const supertest = require('supertest');
const request = supertest(app);

describe('Organization API Endpoint Test', () => {
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
  
    
    //Save an organization through the post endpoint
    it('saves an organization', async () => {
    
    const res = await request.post('/api/organizations').send({ name: 'Mighty Quacks' });
    expect(res.status).toEqual(200);

    });

    //Saving a duplicate should give an error code
    it('tries to save a duplicate org and should throw error code', async () => {
    
        const res = await request.post('/api/organizations').send({ name: 'Mighty Quacks' }); 
        expect(res.status).toEqual(200);

        //duplicate
        const res2 = await request.post('/api/organizations').send({ name: 'Mighty Quacks' }); 
        expect(res2.status).toEqual(400);

        //Make sure its also okay to now save one after some errors
        const res4 = await request.post('/api/organizations').send({ name: 'New York Football Jets' }); 
        expect(res4.status).toEqual(200);
    
    });

    //The get endpoint should return all the organizations
    it('tests the get endpoint', async () => {
    
        //Lets post two channels
        const res = await request.post('/api/organizations').send({ name: 'Mighty Quacks' }); 
        expect(res.status).toEqual(200);

        const res2 = await request.post('/api/organizations').send({ name: 'New York Football Jets' }); 
        expect(res2.status).toEqual(200);

        //Now lets try the get endpoint to see if it returns the two channels
        const res3 = await request.get('/api/organizations');
        expect(res3.status).toEqual(200);
        expect(res3.body.length).toEqual(2);
        expect(res3.body[0].name).toEqual('Mighty Quacks');
        expect(res3.body[1].name).toEqual('New York Football Jets');
    
    });

    //Now testing the get organization by ID endpoint
    it('tests the get by id endpoint', async () => {
    
        //Lets post two orgs
        const res = await request.post('/api/organizations').send({ name: 'Mighty Quacks' }); 
        expect(res.status).toEqual(200);

        const res2 = await request.post('/api/organizations').send({ name: 'New York Football Jets' }); 
        expect(res2.status).toEqual(200);

        //Now lets try the get endpoint to see if it returns the org we want
        const res3 = await request.get(`/api/organizations/${res2.body._id}`); 
        expect(res3.status).toEqual(200);
        expect(res3.body.name).toEqual('New York Football Jets');

        //Lets do some error checking
        const res4 = await request.get(`/api/organizations/1234`); 
        expect(res4.status).toEqual(404);

        let beepboop = 1234567890;
        const res5 = await request.get(`/api/organizations/${beepboop}`); 
        expect(res5.status).toEqual(404);
        
    });

    //Now testing if we can delete organizations using the api endpoint
    it('tests the delete by id endpoint', async () => {
    
        //Lets post two orgs
        const res = await request.post('/api/organizations').send({ name: 'Mighty Quacks' }); 
        expect(res.status).toEqual(200);

        const res2 = await request.post('/api/organizations').send({ name: 'New York Football Jets' }); 
        expect(res2.status).toEqual(200);

        //Make sure the orgs are posted and available to get
        const res3 = await request.get('/api/organizations');
        expect(res3.status).toEqual(200);
        expect(res3.body.length).toEqual(2);
        expect(res3.body[0].name).toEqual('Mighty Quacks');
        expect(res3.body[1].name).toEqual('New York Football Jets');

        //Now lets try to delete one of the orgs
        const res4 = await request.delete(`/api/organizations/${res.body._id}`);
        expect(res4.status).toEqual(200);
        const res5 = await request.get('/api/organizations');
        expect(res5.body.length).toEqual(1);

        //Now lets try to delete the org again to see if it throws an error
        const res6 = await request.delete(`/api/organizations/12345`);
        expect(res6.status).toEqual(404); //error code
        const res7 = await request.get('/api/organizations');
        expect(res7.body.length).toEqual(1); //Make sure nothing was changed
        
    });

    //Now testing if we can add channels to an organization
    it('tests the adding a channel to an organization', async () => {
    
        //Lets post two orgs
        const res = await request.post('/api/organizations').send({ name: 'Mighty Quacks' }); 
        expect(res.status).toEqual(200);

        const res2 = await request.post('/api/organizations').send({ name: 'New York Football Jets' }); 
        expect(res2.status).toEqual(200);

        //Make sure the orgs are posted and available to get
        const res3 = await request.get('/api/organizations');
        expect(res3.status).toEqual(200);
        expect(res3.body.length).toEqual(2);
        expect(res3.body[0].name).toEqual('Mighty Quacks');
        expect(res3.body[1].name).toEqual('New York Football Jets');

        //Lets post two channels
        const res4 = await request.post('/api/channels').send({ name: 'Channel 1', description: 'general' }); 
        expect(res4.status).toEqual(200);

        const res5 = await request.post('/api/channels').send({ name: 'Channel 2', description: 'different' }); 
        expect(res5.status).toEqual(200);
        
        //Now lets try to add a channel to one of the orgs
        const res6 = await request.put(`/api/organizations/channels/add/${res.body._id}`).send({ name: 'Channel 1' });
        expect(res6.status).toEqual(200);

        //Now lets try to add it again and see if it throws the error
        const res7 = await request.put(`/api/organizations/channels/add/${res.body._id}`).send({ name: 'Channel 1' });
        expect(res7.status).toEqual(400);

        //Now lets try to add a channel that does not exist
        const res8 = await request.put(`/api/organizations/channels/add/${res.body._id}`).send({ name: 'Channel 3' });
        expect(res8.status).toEqual(404);

        //Now lets try to add a channel that does not exist
        const res9 = await request.put(`/api/organizations/channels/add/5f8704647920bb4bdc5967d1`).send({ name: 'Channel 1' });
        expect(res9.status).toEqual(500);

    });

    //Now testing if we can remove channels from an organization
    it('tests the removing a channel from an organization', async () => {
    
        //Lets post two orgs
        const res = await request.post('/api/organizations').send({ name: 'Mighty Quacks' }); 
        expect(res.status).toEqual(200);

        const res2 = await request.post('/api/organizations').send({ name: 'New York Football Jets' }); 
        expect(res2.status).toEqual(200);

        //Make sure the orgs are posted and available to get
        const res3 = await request.get('/api/organizations');
        expect(res3.status).toEqual(200);
        expect(res3.body.length).toEqual(2);
        expect(res3.body[0].name).toEqual('Mighty Quacks');
        expect(res3.body[1].name).toEqual('New York Football Jets');

        //Lets post two channels
        const res4 = await request.post('/api/channels').send({ name: 'Channel 1', description: 'general' }); 
        expect(res4.status).toEqual(200);

        const res5 = await request.post('/api/channels').send({ name: 'Channel 2', description: 'different' }); 
        expect(res5.status).toEqual(200);
        
        //Now lets try to add a channel to one of the orgs
        const res6 = await request.put(`/api/organizations/channels/add/${res.body._id}`).send({ name: 'Channel 1' });
        expect(res6.status).toEqual(200);

        //Add other channel to other org
        const res7 = await request.put(`/api/organizations/channels/add/${res2.body._id}`).send({ name: 'Channel 2' });
        expect(res7.status).toEqual(200);

        //Now lets try to remove a channel from the org
        const res8 = await request.put(`/api/organizations/channels/remove/${res.body._id}`).send({ name: 'Channel 1' });
        expect(res8.status).toEqual(200);

        //Now lets try to remove a channel that isnt there
        const res9 = await request.put(`/api/organizations/channels/remove/${res2.body._id}`).send({ name: 'Channel 1' });
        expect(res9.status).toEqual(400);

    });
  
  })