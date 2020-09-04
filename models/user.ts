import { Schema, model, PassportLocalSchema, SchemaTypeOpts } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

import UserType from '../types/User'

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
  password: { type: String },
  mobile_token: {
    type: String,
    required: false,
    index: ({
      unique: true,
      partialFilterExpression: { mobile_token: { $type: 'string' } },
    } as SchemaTypeOpts.IndexOpts),
    default: null,
  }
})

UserSchema.plugin(passportLocalMongoose)
const User = model<UserType>('User', UserSchema as PassportLocalSchema)

export default User
