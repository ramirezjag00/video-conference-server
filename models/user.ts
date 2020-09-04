import { Schema, model, PassportLocalSchema } from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

import UserType from '../types/User'

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
  password: { type: String },
  mobile_token: { type: String, required: false, unique: true },
})

UserSchema.plugin(passportLocalMongoose)
const User = model<UserType>('User', UserSchema as PassportLocalSchema)

export default User
