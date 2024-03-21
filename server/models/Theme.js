const { truncate } = require('fs');
const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  organization: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  palette: {
    common: {
      black: {
        type: String
      },
      white: {
        type: String
      }
    },
    background: {
      paper: {
        type: String
      },
      default: {
        type: String
      }
    },
    primary: {
      light: {
        type: String
      },
      main: {
        type: String
      },
      dark: {
        type: String
      },
      congtrastText: {
        type: String
      }
    },
    secondary: {
      light: {
        type: String
      },
      main: {
        type: String
      },
      dark: {
        type: String
      },
      congtrastText: {
        type: String
      }
    },
    error: {
      light: {
        type: String
      },
      main: {
        type: String
      },
      dark: {
        type: String
      },
      congtrastText: {
        type: String
      }
    },
    text: {
      light: {
        type: String
      },
      main: {
        type: String
      },
      disabled: {
        type: String
      },
      hint: {
        type: String
      }
    }
  },
});

module.exports = Theme = mongoose.model('theme', ThemeSchema);
