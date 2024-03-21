//Need mongoose as the client for the database
const mongoose = require('mongoose');

//dbHandler will do the connecting and closing and clearing of the database
const dbHandler = require('../db-handler.js');
const { collection } = require('../models/Channel');

//Need our schema models for testing and using
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

    //Just make sure we can save a channel successfully
    it('save a channel successfully', async () => {
        const channelData = { name: 'Mighty Quacks', description: 'general' }; 
        const validChannel = new channelModel(channelData);
        const savedChannel = await validChannel.save();

        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedChannel._id).toBeDefined();
        expect(savedChannel.name).toBe(channelData.name);
    });

    //Check that an error is thrown if there is no name
    it('save a channel with no name to check error throwing', async () => {
        const channelData = { description: 'general' }; 
        const invalidChannel = new channelModel(channelData);

        let err;
        try {
            const saveChannel = await invalidChannel.save();
            
        } catch(error) {
            err = error;
        }

        // Object Id should be defined when successfully saved to MongoDB.
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.name).toBeDefined();
    });

})