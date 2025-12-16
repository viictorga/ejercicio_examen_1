import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";
import { User } from "../types";
import {USER_COLLECTIONS} from "../utils"



export const createUser = async ( email: string, password: string, username: string) => {
    const db = getDB();
    const toEncriptao = await bcrypt.hash(password, 10);

    const result = await db.collection<User>(USER_COLLECTIONS).insertOne({
        email,
        password: toEncriptao,
        username,
        coches: []
    });

    return result.insertedId.toString();
}


export const validateUser = async (email: string, password: string) => {
    const db = getDB();
    const user = await db.collection(USER_COLLECTIONS).findOne({email});
    if( !user ) throw new Error("No existe ningun usuario con ese email");

    const laPassEsLaMismaMismita = await bcrypt.compare(password, user.password);
    if(!laPassEsLaMismaMismita) throw new Error("Contraseña Incorrecta");

    return user;
};


export const findUserById = async (id: string) => {
    const db = getDB();
    return await db.collection(USER_COLLECTIONS).findOne({_id: new ObjectId(id)})
}