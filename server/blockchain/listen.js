'use strict';

const Message = require('./models/message');
const {addMessageToDatabase, updateMessageNumbers, generateSocketIOEvent} = require('./api/messageTransaction')

// Main program function
module.exports.blockchainListen = async (app) => {

    // // Create gateway instance to the blockchain and make it a global instance
    // const gateway = await gatewayConnect();
    // global.Globals = {
    //     gateway: gateway
    // }

    const gateway = Globals['gateway'];

    const channel = 'general'

    const network = await gateway.getNetwork(channel);

    // Get addressability to Blockchat contract
    console.log('Using Blockchat smart contract.');

    const contract = await network.getContract('ncsu-chat');

    const listener = await contract.addContractListener('my-contract-listener', "change", (err, event, blockNumber, transactionId, status) => {
        if (err) {
            console.error(err);
        }
        else {
            let message = Message.fromBuffer(event.payload);
            addMessageToDatabase(message, 'General')
            updateMessageNumbers(message.orgId, message, 'General')
            generateSocketIOEvent(app, message, 'General');

        }
    }, {filtered: false})

    console.log('Contract listener added.');
}