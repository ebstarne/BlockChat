//Need mongoose as the client for the database
const mongoose = require('mongoose');

//dbHandler will do the connecting and closing and clearing of the database
const dbHandler = require('../db-handler.js');

//Need our schema models for testing and using
const messageModel = require('../models/Message');
const userModel = require('../models/User');
const channelModel = require('../models/Channel');

//import axios from 'axios';
//import Message from '../../client/models/Message';
//import Channel from '../../client/models/Channel';

const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer({instance: {storageEngine: 'wiredTiger'}});

//Global variable for the user
let user;

//Global variable for the channel
let channel;

describe('Message Model Test', () => {

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
    //afterEach(async () => await dbHandler.clearDatabase());
    
    it('create & save user successfully', async () => {
      jest.setTimeout(30000);
      //Need to first create a user for the message to be associated with
      const userData = { username: 'Tobes', email: 'a', organization: {name: 'tobular'}, password: 'yeeeeee' };
      const validUser = new userModel(userData);
      const savedUser = await validUser.save();
      user = savedUser; //assign to global variable
      // Object Id should be defined when successfully saved to MongoDB.
      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.organization.name).toBe(userData.organization.name);
      expect(savedUser.password).toBe(userData.password);
    });

    it('create & save channel successfully', async () => {
      //Create the channel with the model
      const channelData = { name: 'Federation', description: 'We have the best cookies in the whole galaxy'};
      const validChannel = new channelModel(channelData);
      const savedChannel = await validChannel.save();
      channel = savedChannel;
      // Object Id should be defined when successfully saved to MongoDB.
      expect(savedChannel._id).toBeDefined();
      expect(savedChannel.name).toBe(channelData.name);
      expect(savedChannel.description).toBe(channelData.description);
    });

    it('create & save message successfully', async () => {
      //Create the message with the model and data above
      const messageData = { user: user._id, channel: channel._id, username: 'tobular', text: 'ye', date: new Date(), organization: 'RA', messageNumber: 5 };
      const validMessage = new messageModel(messageData);
      const savedMessage = await validMessage.save();
      // Object Id should be defined when successfully saved to MongoDB.
      expect(savedMessage._id).toBeDefined();
      expect(savedMessage.user).toBe(messageData.user);
      expect(savedMessage.channel).toBe(messageData.channel);
      expect(savedMessage.username).toBe(messageData.username);
      expect(savedMessage.text).toBe(messageData.text);
    });

    // Test Validation is working!!!
    it('create message without required field, should fail', async () => {

        //No user defined but all other fields present
        
        let err;
        try {
            const messageWithoutRequiredField = new messageModel({ channel: channel._id, username: 'tobular', date: new Date(), text: 'hehehe' });
            const savedMessageWithoutRequiredField = await messageWithoutRequiredField.save();
            
        } catch (ValidationError) {
            err = ValidationError
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)


        //Only text defined no other fields present
        
        let err1;
        try {
          const messageWithoutRequiredField1 = new messageModel({ text: 'hehehe' });
            const savedMessageWithoutRequiredField1 = await messageWithoutRequiredField1.save();

        } catch (ValidationError) {
            err1 = ValidationError
        }
        expect(err1).toBeInstanceOf(mongoose.Error.ValidationError)
        // expect(err1.errors.user).toBeDefined();
        // expect(err1.errors.channel).toBeDefined();
        // expect(err1.errors.username).toBeDefined();


        //Everything defined except the date but it should default to the current date. 
        const messageWithoutDate = new messageModel({ user: user._id, channel: channel._id, username: 'tobular', text: 'ye', organization: 'RA', messageNumber: 25 });
        const savedMessageWithoutDate = await messageWithoutDate.save();
        expect(savedMessageWithoutDate._id).toBeDefined();
        expect(savedMessageWithoutDate.user).toBe(user._id);
        expect(savedMessageWithoutDate.channel).toBe(channel._id);
        expect(savedMessageWithoutDate.username).toBe('tobular');
        expect(savedMessageWithoutDate.text).toBe('ye');


        //All fields defined other than text, should test for a weird
        //request where a message is trying to be saved with no text
        
        let err2;
        try {
          const messageWithoutRequiredField2 = new messageModel({ user: user._id, channel: channel._id, username: 'tobular' });
            const savedMessageWithoutRequiredField2 = await messageWithoutRequiredField2.save();
            
        } catch (ValidationError) {
          err2 = ValidationError
        }
        expect(err2).toBeInstanceOf(mongoose.Error.ValidationError)
        // expect(err2.errors.text).toBeDefined();
        }
    );

    
})

  