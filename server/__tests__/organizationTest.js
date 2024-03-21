//Need mongoose as the client for the database
const mongoose = require('mongoose');

//dbHandler will do the connecting and closing and clearing of the database
const dbHandler = require('../db-handler.js');
const { collection } = require('../models/Organization');

//Need our schema models for testing and using
const orgModel = require('../models/Organization');
const channelModel = require('../models/Channel');

describe('Organization Model Test', () => {

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

    //Just make sure we can save an org
    it('save an organization', async () => {
        const orgData = { name: 'Mighty Quacks', channels: [] }; //Only a name and channel array is empty
        const validOrg = new orgModel(orgData);
        const savedOrg = await validOrg.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedOrg._id).toBeDefined();
        expect(savedOrg.name).toBe(orgData.name);
    });

    //Just make sure we can save an org if there is no channels field specified
    it('save an organization', async () => {
        const orgData = { name: 'Mighty Quacks' }; //Only a name
        const validOrg = new orgModel(orgData);
        const savedOrg = await validOrg.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedOrg._id).toBeDefined();
        expect(savedOrg.name).toBe(orgData.name);
    });

    //Create a channel and save it with the organization
    it('save an organization with a channel association', async () => {

        //Create the channel so we can save it with the org
        const channelData = { name: 'Mighty Quacks', description: 'general' }; 
        const validChannel = new channelModel(channelData);
        const savedChannel = await validChannel.save();

        const orgData = { name: 'Mighty Quacks', description: 'general', channels: [ { channel: savedChannel._id, name:'Mighty Quacks'}] }; //Only a name
        const validOrg = new orgModel(orgData);
        const savedOrg = await validOrg.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedOrg._id).toBeDefined();
        expect(savedOrg.name).toBe(orgData.name);
        expect(savedOrg.channels[0].name).toBe(channelData.name);
    });
})