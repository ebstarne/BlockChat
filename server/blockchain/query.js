'use strict';

const {gatewayConnect} = require('./gateway');
const Message = require('./models/message');
const {addMessageToDatabase, updateMessageNumbers} = require('./api/messageTransaction')

const Channel = require('../models/Channel');


module.exports.queryOnServerStart = async () => {

    // Create gateway instance to the blockchain and make it a global instance
    const gateway = Globals['gateway'];

    const channel = 'general'

    const network = await gateway.getNetwork(channel);

    // Get addressability to Blockchat contract
    //console.log('Use Blockchat smart contract.');

    const contract = await network.getContract('ncsu-chat');

    // issue blockchat message
    //console.log('Submit message transaction.');

    const orgIds = ['GE', 'TF', 'RA'];

    const channel_doc = await Channel.findOne({name: 'General'});

    orgIds.forEach(async (orgId) => {
        const messageNumber = channel_doc.messageNumbers[orgId];
        const params = {
            orgId: orgId,
            messageNumber: messageNumber
        }


        const issueResponse = await contract.submitTransaction('queryFrom', JSON.stringify(params));

        let messageArray = JSON.parse(issueResponse);


        for (let messageResponse of messageArray.sort((a,b) => parseInt(a.messageNumber) - parseInt(b.messageNumber))) {
            let message = new Message(messageResponse);

            // add each message to database messages
            await addMessageToDatabase(message, 'General')

            await updateMessageNumbers(orgId, message, 'General')
        }
    });

    console.log('Server query complete.\nLocal database updated.');

}
