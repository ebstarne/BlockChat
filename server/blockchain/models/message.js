// Utility class for ledger state
const State = require('./state');

// Enumerate message state values
const messageState = {
    POSTED: 1,
    EDITED: 2,
    REMOVED: 3
};

const OrganizationIDs = [
    'TF',
    'RA',
    'GE'
]

/**
 * Message class extends State class
 * Class will be used by application and smart contract to define a message
 */
class Message extends State {

    constructor(obj) {
        super(Message.getClass(), [obj.orgId, obj.messageNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getOrganization() {
        return this.organization
    }

    setOrganization(organization) {
        this.organization = organization
    }

    getSender() {
        return this.sender;
    }

    setSender(sender) {
        this.sender = sender;
    }

    getText() {
        return this.text;
    }

    setText(text) {
        this.text = text;
    }

    getTextBlocks() {
        return this.textBlocks
    }

    setTextBlocks(textBlocks) {
        this.messageBlocks = textBlocks;
    }

    getTimestamp() {
        return this.timestamp
    }

    setTimestamp(timestamp) {
        this.timestamp = timestamp;
    }

    getEditedTimestamp() {
        return this.editedTimestamp
    }

    setEditedTimestamp(editedTimestamp) {
        this.editedTimestamp = editedTimestamp;
    }

    /**
     * Useful methods to encapsulate message states
     */
    setPosted() {
        this.currentState = messageState.POSTED;
    }
    setEdited() {
        this.currentState = messageState.EDITED;
    }
    setRemoved() {
        this.currentState = messageState.REMOVED;
    }

    isPosted() {
        return this.currentState === messageState.POSTED;
    }
    isEdited() {
        return this.currentState === messageState.EDITED;
    }
    isRemoved() {
        return this.currentState === messageState.REMOVED;
    }

    static fromBuffer(buffer) {
        return Message.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to message
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Message);
    }

    /**
     * Factory method to create a state object
     */
    static createInstance(orgId, sender, messageNumber, timestamp, text, textBlocks) {
        return new Message({ orgId, sender, messageNumber, timestamp, text, textBlocks });
    }

    static getClass() {
        return 'com.bcbsnc.ig.ncsu.blockchat.message';
    }
}

module.exports = Message;