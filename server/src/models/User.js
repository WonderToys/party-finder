import { Schema, model } from 'mongoose';
import moment from 'moment';

// UserSchema
const UserSchema = new Schema({
  // The User's name. Will be set to their Discord name when created
  name: String,
  // The discriminator, a unique ID that gets appended to the User's name.. i.e: Toys#1234. Provided by Discord
  discriminator: String,
  // An array of provider data. Contains things like access tokens, refresh tokens, etc
  providers: [Object],
  // The UTC date of when the User was created
  createdAt: {
    type: String,
    default: moment.utc().format()
  }
});

// Exports
export default model('User', UserSchema);