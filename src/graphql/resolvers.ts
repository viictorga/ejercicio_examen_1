import { User } from "../types";
import { USER_COLLECTIONS } from "../utils";
import { IResolvers } from "@graphql-tools/utils";
import { getDB } from "../db/mongo";
import { createUser, validateUser } from "../collection/users";
import { signToken } from "../auth";

export const resolvers: IResolvers = {

    Query:{
        me: async (_, __, { user }) => {
        if (!user) throw new Error("el token es incorrecto");
        return {
            _id: user._id.toString(),
            ...user
        };
        }   
    },
    Mutation: {
        register: async(_,{email,password})=>{
            const userId = await createUser(email, password);
            return await signToken(userId);
        },
        login: async(_,{email,password})=>{
            const user = await validateUser(email, password);
            return await signToken(user._id.toString())
        }
    }



}