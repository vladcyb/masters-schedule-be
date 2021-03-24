import { Request } from 'express';
import User from '../models/User';

export type MyRequest = {
  role: {
    isAdmin: boolean
    isMaster: boolean
    isOperator: boolean
    isClient: boolean
    isResponsible: boolean
  }
  user: User
} & Request
