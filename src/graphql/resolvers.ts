import { User } from "../types";
import { USER_COLLECTIONS } from "../utils";
import { IResolvers } from "@graphql-tools/utils";
import { getDB } from "../db/mongo";
import { createUser, validateUser } from "../collection/users";
import { signToken } from "../auth";
import { addCoche, borrarCoche, buyCoche, findCocheById, findCoches } from "../collection/coches";

export const resolvers: IResolvers = {

    Query:{
        me: async (_, __, { user }) => {
        if (!user) throw new Error("el token es incorrecto");
        return {
            _id: user._id.toString(),
            ...user
        };
        },
        addCoche: async(_,{matricula, modelo} , {user}) =>{
           return await addCoche(user, matricula, modelo); 
        },
        findCoches: async(_, {page, size}) =>{
            return await findCoches(page,size);
        },
        findCocheById: async(_, {id}) =>{
            return await findCocheById(id);
        }
    },
    Mutation: {
        register: async(_,{email,password, username})=>{
            const userId = await createUser(email, password, username);
            return await signToken(userId);
        },
        login: async(_,{email,password})=>{
            const user = await validateUser(email, password);
            return await signToken(user._id.toString())
        },
        buyCoche: async(_, {idCoche}, {user})=>{
            return await buyCoche(idCoche, user);
        },
        borrarCoche: async(_, {idCoche}, {user})=>{
            return await borrarCoche(idCoche, user);
        },
        modificarMatricula: async(_, {matriculaNueva}, {user})=>{
            return await borrarCoche(matriculaNueva, user);
        }

    }



}