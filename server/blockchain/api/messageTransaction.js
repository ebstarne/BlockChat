'use strict';

const Message = require('../models/message');
const User = require('../../models/User');
const MessageDB = require('../../models/Message');
const moment = require('moment')

module.exports.postMessageToBlockchainChannel = async (channel, sender, messageNumber, text) => {
    // Main try/catch block
    try {

        const gateway = Globals['gateway'];
        const channel = 'general'

        // Access network channel
        console.log(`Use network channel: ${channel}.`);

        const network = await gateway.getNetwork(channel);

        // Get addressability to Blockchat contract
        console.log('Use Blockchat smart contract.');

        const contract = await network.getContract('ncsu-chat');

        // issue blockchat message
        console.log('Submit message transaction.');

        const params = {
            sender: sender,
            messageNumber: parseInt(messageNumber), 
            timestamp: moment().toISOString(), 
            text: text
        }

        const issueResponse = await contract.submitTransaction('post', JSON.stringify(params));

        // process response
        // console.log('Process message response.', issueResponse);

        let message = Message.fromBuffer(issueResponse);

        // console.log(`${message.key}: ${message.messageNumber} successfully issued for sender ${message.sender}: ${message.text}`);
        console.log('Transaction complete.');

        // Disconnect from the gateway
        // console.log('Disconnect from Fabric gateway.');
        //gateway.disconnect();

        console.log('Issue message complete.');

        return 'Success'

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
        //this.postMessageToBlockchainChannel('', sender, messageNumber + 1, text)
    }
}

module.exports.addMessageToDatabase = async (message, channel) => {
    
    try {
        let organization;
        if (message.orgId === 'GE') {
            organization = 'Galactic Empire';
        } else if (message.orgId === 'RA') {
            organization = 'Rebel Alliance';
        } else if (message.orgId === 'TF') {
            organization = 'Trade Federation';
        }

        const channelDB = await Channel.findOne({name: channel});

        const messageDB = new MessageDB({
        text: message.text,
        username: message.sender,
        channel: channelDB.id,
        date: message.timestamp,
        organization: organization,
        messageNumber: parseInt(message.messageNumber)
        });

        const isMessageInDb = await MessageDB.findOne({messageNumber: message.messageNumber, organization: organization, channel: channelDB.id})

        if (!isMessageInDb) {
            await messageDB.save();
        }

    } catch (err) {
        console.error(err);
    }
}

module.exports.updateMessageNumbers = async (orgId, message, channel) => {
    const c = await Channel.findOne({name: channel});
    if (message.messageNumber > c.messageNumbers[orgId]) {
        c.messageNumbers[orgId] = message.messageNumber;
        c.save();
    }
}

module.exports.generateSocketIOEvent = async (app, message, channel) => {
    const sio = app.get('sio');

    const channelDB = await Channel.findOne({name: channel});

    let organization;
    if (message.orgId === 'GE') {
        organization = 'Galactic Empire';
    } else if (message.orgId === 'RA') {
        organization = 'Rebel Alliance';
    } else if (message.orgId === 'TF') {
        organization = 'Trade Federation';
    }

    const user = await User.findOne({username: message.sender, organization: organization});

    const messageDB = new MessageDB({
        text: message.text,
        user: user ? user.id : null,
        username: message.sender,
        channel: channelDB.id,
        date: message.timestamp,
        organization: organization,
        messageNumber: parseInt(message.messageNumber)
    });

    // send the message through the socket
    sio.to(messageDB.channel).emit('message', messageDB);
}