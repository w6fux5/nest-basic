import { User } from '../users.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser: User;
    }
  }
}
