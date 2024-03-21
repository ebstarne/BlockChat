const mongoose = require('mongoose');
const config = require('config');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path')

const connectDB = async () => {
  const yamlContents = fs.readFileSync(path.join(__dirname, '../blockchain/yaml/settings.yaml'), 'utf8')
  const uri = YAML.parse(yamlContents)[process.env.ORG]['uri'];

  try {
    if (mongoose.connection) {
      mongoose.connection.close()
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected.');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
