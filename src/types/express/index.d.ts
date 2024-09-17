import { IUser } from "../../model/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // This will allow attaching user info to the request object
    }
  }
}
