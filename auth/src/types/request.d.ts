import {RoleType} from "../user/schema/const/role-type.enum";
import {Types} from "mongoose";

declare global {
    namespace Express {
        interface User {
            _id: Types.ObjectId;
            email: string;
            role: RoleType;
        }
        interface Request {
            user: User;
        }
    }
}

export {};
