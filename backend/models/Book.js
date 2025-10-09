// const mongoose = require('mongoose');

// const pageCustomizationSchema = new mongoose.Schema({
//   textColor: {
//     type: String,
//     default: '#2d3748'
//   },
//   fontSize: {
//     type: Number,
//     default: 16
//   },
//   fontFamily: {
//     type: String,
//     default: 'Inter, sans-serif'
//   },
//   backgroundColor: {
//     type: String,
//     default: '#ffffff'
//   },
//   lineHeight: {
//     type: Number,
//     default: 1.6
//   },
//   texture: {
//     type: String,
//     default: 'none'
//   }
// });

// const pageSchema = new mongoose.Schema({
//   pageNumber: {
//     type: Number,
//     required: true
//   },
//   content: {
//     type: String,
//     default: ''
//   },
//   background: {
//     type: String,
//     default: ''
//   },
//   type: {
//     type: String,
//     enum: ['blank', 'text', 'mixed'],
//     default: 'text'
//   },
//   customization: pageCustomizationSchema
// });

// const bookSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     default: 'My Digital Journal'
//   },
//   description: {
//     type: String,
//     default: 'My personal journal'
//   },
//   coverImage: {
//     type: String,
//     default: ''
//   },
//   pages: [pageSchema],
//   isPublic: {
//     type: Boolean,
//     default: false
//   },
//   tags: [String],
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   collaborators: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     role: {
//       type: String,
//       enum: ['viewer', 'editor'],
//       default: 'viewer'
//     }
//   }]
// }, {
//   timestamps: true
// });

// // Index for better query performance
// bookSchema.index({ owner: 1, createdAt: -1 });
// bookSchema.index({ tags: 1 });

// module.exports = mongoose.model('Book', bookSchema);

const mongoose = require('mongoose');

const pageCustomizationSchema = new mongoose.Schema({
  textColor: {
    type: String,
    default: '#2d3748'
  },
  fontSize: {
    type: Number,
    default: 16
  },
  fontFamily: {
    type: String,
    default: 'Inter, sans-serif'
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  lineHeight: {
    type: Number,
    default: 1.6
  },
  texture: {
    type: String,
    default: 'none'
  },
  // ✅ ADD THIS FIELD
  backgroundImage: {
    type: String,
    default: null
  }
}, { _id: false }); // Add _id: false as this is a subdocument

const pageSchema = new mongoose.Schema({
  pageNumber: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  // ❌ REMOVE THIS OLD FIELD
  // background: {
  //   type: String,
  //   default: ''
  // },
  type: {
    type: String,
    enum: ['blank', 'text', 'mixed', 'cover'],
    default: 'text'
  },
  customization: pageCustomizationSchema
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'My Digital Journal'
  },
  description: {
    type: String,
    default: 'My personal journal'
  },
  coverImage: {
    type: String,
    default: ''
  },
  pages: [pageSchema],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor'],
      default: 'viewer'
    },
    _id: false
  }]
}, {
  timestamps: true
});

// Index for better query performance
bookSchema.index({ owner: 1, createdAt: -1 });
bookSchema.index({ tags: 1 });

module.exports = mongoose.model('Book', bookSchema);