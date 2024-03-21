//Need mongoose as the client for the database
const mongoose = require('mongoose');

//dbHandler will do the connecting and closing and clearing of the database
const dbHandler = require('../db-handler.js');
const { collection } = require('../models/User');

const app = require('../testServer');

const supertest = require('supertest');
const { sortedIndex } = require('underscore');
const request = supertest(app);

describe('Message API Endpoint Test', () => {
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
  
    
    //Save an message through the post endpoint
    it('saves an message', async () => {
        process.env.ORG = 'GE';
    
        //first we need to post the organization
        const res1 = await request.post('/api/organizations').send({ name: 'Galactic Empire' });
        expect(res1.status).toEqual(200);

        //Now lets make a channel for the message to be posted to
        const res7 = await request.post('/api/channels').send({ name: 'Private', description: 'different' }); 
        expect(res7.status).toEqual(200);

        //then we need to make a user
        const res = await request.post('/api/users').send({
            username: 'DomNom',
            email: 'dommy@gmail.com',
            password: 'yurttttttttt',
          });
          expect(res.status).toEqual(200);

        const token = res.body.token;
        
        //now we want to try to post a message
        const res2 = await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'hello',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        expect(res2.status).toEqual(200);

        try{
            //Now lets try without a field to make sure validation works
            const res3 = await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            
            channel: res7.body._id,
            })
        }
        
        catch (ValidationError) {
            expect(res3.status).toEqual(400);
        }
        
       

    });

    //testing the get all messages endpoint
    it('tests getting all of the messages', async () => {
        process.env.ORG = 'GE';
    
        //first we need to post the organization
        const res1 = await request.post('/api/organizations').send({ name: 'Galactic Empire' });
        expect(res1.status).toEqual(200);

        //Now lets make a channel for the message to be posted to
        const res7 = await request.post('/api/channels').send({ name: 'Private', description: 'different' }); 
        expect(res7.status).toEqual(200);

        //then we need to make a user
        const res = await request.post('/api/users').send({
            username: 'DomNom',
            email: 'dommy@gmail.com',
            password: 'yurttttttttt',
          });
          expect(res.status).toEqual(200);

        const token = res.body.token;
        
        //now we want to try to post a message
        const res2 = await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'hello',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        expect(res2.status).toEqual(200);

        //Now we should be able to get all the messages
        const res3 = await request.get('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } );
        expect(res3.status).toEqual(200);
        expect(res3.body.length).toEqual(1);

        //Now lets add some more messages and make sure it gets them all
        await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'hello',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'darkness',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'my',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'old',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'friend',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })

        //check to make sure it gets them all
        const res4 = await request.get('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } );
        expect(res4.status).toEqual(200);
        expect(res4.body.length).toEqual(6);
    
    });

    //Testing the get by ID endpoint to find a certain message
    it('tests the get by ID endpoint', async () => {
        process.env.ORG = 'GE';
    
        //first we need to post the organization
        const res1 = await request.post('/api/organizations').send({ name: 'Galactic Empire' });
        expect(res1.status).toEqual(200);

        //Now lets make a channel for the message to be posted to
        const res7 = await request.post('/api/channels').send({ name: 'Private', description: 'different' }); 
        expect(res7.status).toEqual(200);

        //then we need to make a user
        const res = await request.post('/api/users').send({
            username: 'DomNom',
            email: 'dommy@gmail.com',
            password: 'yurttttttttt',
          });
          expect(res.status).toEqual(200);

        const token = res.body.token;
        
        //now we want to try to post a message
        const res2 = await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'hello',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        expect(res2.status).toEqual(200);

        //Now lets try to get the message by ID
        const res3 = await request.get(`/api/messages/${res2.body._id}`).set( { 'x-auth-token': token, 'Content-Type':'application/json' } );
        expect(res3.status).toEqual(200);
        expect(res3.body.text).toEqual('hello');

        //Also check to make sure it throws an error with invalid ID
        const res4 = await request.get(`/api/messages/${token}`).set( { 'x-auth-token': token, 'Content-Type':'application/json' } );
        expect(res4.status).toEqual(404);
    
    });

    //Now testing the get messages by user endpoint
    it('tests the get messages by user id endpoint', async () => {
        process.env.ORG = 'GE';
    
        //first we need to post the organization
        const res1 = await request.post('/api/organizations').send({ name: 'Galactic Empire' });
        expect(res1.status).toEqual(200);

        //Now lets make a channel for the message to be posted to
        const res7 = await request.post('/api/channels').send({ name: 'Private', description: 'different' }); 
        expect(res7.status).toEqual(200);

        //then we need to make a user
        const res = await request.post('/api/users').send({
            username: 'DomNom',
            email: 'dommy@gmail.com',
            password: 'yurttttttttt',
          });
          expect(res.status).toEqual(200);

        const token = res.body.token;

        //Need the user ID
        const userID = await request.get('/api/auth').set( { 'x-auth-token': token, 'Content-Type':'application/json' } );

        //and another user to use either ID
        const res2 = await request.post('/api/users').send({
            username: 'Tommy',
            email: 'borther@gmail.com',
            password: 'hellohello',
          });
          expect(res2.status).toEqual(200);

        const token2 = res2.body.token;
        const userID2 = await request.get('/api/auth').set( { 'x-auth-token': token2, 'Content-Type':'application/json' } );
        
        //now we want to try to post a message
        const res3 = await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'hello',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        expect(res3.status).toEqual(200);
        await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'a second message',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })

        //now we try to get these two messages for the user
        const res4 = await request.get(`/api/messages/user/${userID.body._id}`).set( { 'x-auth-token': token, 'Content-Type':'application/json' } );
        expect(res4.status).toEqual(200);
        expect(res4.body.length).toEqual(2);

        //post some messages for the other user
        await request.post('/api/messages').set( { 'x-auth-token': token2, 'Content-Type':'application/json' } ).send({
            text: 'testing',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        await request.post('/api/messages').set( { 'x-auth-token': token2, 'Content-Type':'application/json' } ).send({
            text: 'yooo yooo',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'hello hello',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        //now we try to retrieve these 3 for the other user
        const res5 = await request.get(`/api/messages/user/${userID2.body._id}`).set( { 'x-auth-token': token2, 'Content-Type':'application/json' } );
        expect(res5.status).toEqual(200);
        expect(res5.body.length).toEqual(2);
        console.log(userID2.body._id);

        //Test the validation
        const res6 = await request.get(`/api/messages/user/5f8472746fb2b34d448ce81f`).set( { 'x-auth-token': token2, 'Content-Type':'application/json' } )
        expect(res6.status).toEqual(400);

    });

    //Testing the get by channel endpoint
    it('tests the get messages by channel endpoint', async () => {
        process.env.ORG = 'GE';
        
        //first we need to post the organization
        const res1 = await request.post('/api/organizations').send({ name: 'Galactic Empire' });
        expect(res1.status).toEqual(200);

        //Now lets make a channel for the message to be posted to
        const res7 = await request.post('/api/channels').send({ name: 'Private', description: 'different' }); 
        expect(res7.status).toEqual(200);

        //then we need to make a user
        const res = await request.post('/api/users').send({
            username: 'DomNom',
            email: 'dommy@gmail.com',
            password: 'yurttttttttt',
          });
          expect(res.status).toEqual(200);

        const token = res.body.token;
        
        //now we want to try to post a message
        const res2 = await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'hello',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'mom',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'and dad',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })

        //See if we can get all the messages in the channel
        const check = await request.get(`/api/messages/channel/${res7.body._id}`).set( { 'x-auth-token': token, 'Content-Type':'application/json' } );
        expect(check.status).toEqual(200);
        expect(check.body.length).toEqual(3);

        const validation = await request.get(`/api/messages/channel/5f51ba06371a3bc00a760974`).set( { 'x-auth-token': token, 'Content-Type':'application/json' } );
        expect(validation.status).toEqual(400);
        
    });

    //Testing the delete endpoint
    it('tests deleting a message', async () => {
        process.env.ORG = 'GE';
    
        //first we need to post the organization
        const res1 = await request.post('/api/organizations').send({ name: 'Galactic Empire' });
        expect(res1.status).toEqual(200);

        //Now lets make a channel for the message to be posted to
        const res7 = await request.post('/api/channels').send({ name: 'Private', description: 'different' }); 
        expect(res7.status).toEqual(200);

        //then we need to make a user
        const res = await request.post('/api/users').send({
            username: 'DomNom',
            email: 'dommy@gmail.com',
            password: 'yurttttttttt',
          });
          expect(res.status).toEqual(200);

        const token = res.body.token;

        //and another user to use either ID
        const res2 = await request.post('/api/users').send({
            username: 'Tommy',
            email: 'borther@gmail.com',
            password: 'hellohello',
          });
          expect(res2.status).toEqual(200);

        const token2 = res2.body.token;
        
        //now we want to try to post a message
        const res3 = await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'hello',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })
        expect(res3.status).toEqual(200);
        const res4 = await request.post('/api/messages').set( { 'x-auth-token': token, 'Content-Type':'application/json' } ).send({
            text: 'a second message',
            channel: res7.body._id,
            organization: 'Galactic Empire'
        })

        //Lets first check the validation and make sure it won't let a different user delete the message
        const check = await request.delete(`/api/messages/${res3.body._id}`).set( { 'x-auth-token': token2, 'Content-Type':'application/json' } )
        expect(check.status).toEqual(401);

        //Lets also check that it wont try to delete a message that isnt there
        const check1 = await request.delete(`/api/messages/12345`).set( { 'x-auth-token': token2, 'Content-Type':'application/json' } )
        expect(check1.status).toEqual(404);

        //Now lets actually delete a message
        const test = await request.delete(`/api/messages/${res3.body._id}`).set( { 'x-auth-token': token, 'Content-Type':'application/json' } )
        expect(test.status).toEqual(200);

    });
  
  })