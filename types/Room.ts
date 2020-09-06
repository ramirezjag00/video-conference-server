import { Document, Schema } from 'mongoose'

import UserType from './User'

interface RoomType extends Document {
  name: string
  capacity?: number
  host?: {
    id: Schema.Types.ObjectId
    username: string
  },
  participants?: UserType[]
}

export default RoomType
