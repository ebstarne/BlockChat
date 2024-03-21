'use strict';

const fs = require('fs');
const YAML = require('yaml');
const { InMemoryWallet, Gateway } = require('fabric-network');
const path = require('path')
const _ = require('underscore')


module.exports.gatewayConnect = async () => {
    // A wallet stores a collection of identities for use
    const yamlContents = fs.readFileSync(path.join(__dirname, 'yaml/settings.yaml'), 'utf8')


    if (_.isUndefined(process.env.ORG)) {
        throw new error('Need an organization!');
    }

    const settings = YAML.parse(yamlContents)[process.env.ORG];

    const wallet = new InMemoryWallet();

    const {userName, identity} = settings

    let connectionProfile = YAML.parse(fs.readFileSync(path.join(__dirname, settings.connectionProfile), 'utf8'));

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();
    
    // seed wallet
    if (! await wallet.exists(userName)) {
        await wallet.import(userName, identity)
    }

    // Set connection options; identity and wallet
    let connectionOptions = {
        identity: userName,
        wallet: wallet,
        discovery: { enabled:false, asLocalhost:false },
    };

    await gateway.connect(connectionProfile, connectionOptions);

    // Connect to gateway using application specified parameters
    console.log('Connected to Fabric gateway.');

    return gateway;
}