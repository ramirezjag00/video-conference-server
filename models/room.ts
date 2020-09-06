import { Schema, model } from 'mongoose'

import RoomType from '../types/Room'

const RoomSchema = new Schema({
  name: { type: String, required: true, unique: false },
  capacity: { type: Number, default: 5 },
	host: {
		id: {
			type: Schema.Types.ObjectId,
      ref: 'User',
    },
		username: String,
	},
	participants: [
    {
      type: Schema.Types.ObjectId,
      ref:'User'
    }
	]
})

const Room = model<RoomType>('Room', RoomSchema)

export default Room
