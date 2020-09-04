import { Document } from 'mongoose'

interface UserType extends Document {
  username: string
  password: string
  mobile_token?: string
}

export default UserType
