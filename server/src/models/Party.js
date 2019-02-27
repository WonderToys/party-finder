import { Schema, model } from 'mongoose';
import moment from 'moment';

import User from './User';
const UserSchema = User.schema;

// PartySchema
const PartySchema = new Schema({
  // The User who started the party
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  // The name of the party
  name: {
    type: String,
    required: true
  },
  // The description of the party, optional
  description: String,
  // The number of players the party is looking for
  numPlayers: {
    type: Number,
    required: true
  },
  // A list of Users who have joined this party
  members: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  // The Twitch id of the game this party is for
  gameId: {
    type: Number,
    required: true
  },
  // The Twitch name of the game this party is for
  gameName: {
    type: String,
    required: true,
    index: 'text'
  },
  // The state of the party
  state: {
    type: String,
    enum: [ 'open', 'closed', 'disbanded' ],
    default: 'open'
  },
  // Whether or not Users can automatically join this party
  allowAutoJoin: {
    type: Boolean,
    default: false
  },
  // Whether or not the party is for competitive play
  isCompetitive: {
    type: Boolean,
    default: false
  },
  // The skill level perferred by the party owner
  skillLevel: {
    type: String,
    enum: [ 'newbie', 'bad', 'decent', 'good', 'great', 'expert' ],
    default: 'decent'
  },
  // The UTC timestamp of when this party was created
  createdAt: {
    type: String,
    default: moment.utc().format()
  },
  // The UTC timestamp of when this party was last updated
  updatedAt: {
    type: String,
    default: moment.utc().format()
  }
});

// Exports
export default model('Party', PartySchema);