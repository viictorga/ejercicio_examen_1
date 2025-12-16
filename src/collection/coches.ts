import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { Coche, User } from "../types";
import { COCHE_COLLECTIONS, USER_COLLECTIONS } from "../utils";
import { chown } from "node:fs";


export const addCoche = async(user: User, matricula: string, modelo:string)=>{
    const db = getDB();
    if(!user) throw new Error("no se encuentra el token")
    const nuevoCoche: Coche = {
        matricula,
        modelo,
    }
    const a = await db.collection<Coche>(COCHE_COLLECTIONS).insertOne(nuevoCoche);
    return await db.collection(COCHE_COLLECTIONS).findOne({_id: a.insertedId})
}

/*

$eq     → equal {age: { $eq: Number(req.params.age) }},
$neq    → not equal 

$gt     → greater than
$gte    → greater than or equal

$lt     → less than
$lte    → less than or equal

$in     → array {$in: {coches: "9274"}}
$nin    → contiene valores dentro de un array {$nin: {coches: "9274"}}


*/


export const findCoches = async(page?: number, size?: number)=>{
    page = page || 1;
    size = size || 25;
    const db = getDB();
    const numero = 1975;

    return await db.collection<Coche>(COCHE_COLLECTIONS).find().skip((page-1) * size).limit(size).toArray();
}



export const findCocheById = async (id: string) =>{
    const db = getDB();
    return await db.collection(COCHE_COLLECTIONS).findOne({_id: new ObjectId(id)})
} 
export const buyCoche = async(idCoche: string, user: User) =>{
    const db = getDB();
    if(!user) throw new Error("no se encuentra el token")
    const coche = await db.collection<Coche>(COCHE_COLLECTIONS).findOne({_id: new ObjectId(idCoche)})
    if(!coche) throw new Error("has introducido un id que no existe")
    await db.collection(COCHE_COLLECTIONS).updateOne({_id: coche._id}, {$set: {propietario: user.username}})
    await db.collection(USER_COLLECTIONS).updateOne({_id: user._id}, {$addToSet: {coches: coche._id}})
    return await db.collection(USER_COLLECTIONS).findOne({_id: user._id})
}
export const borrarCoche = async(idCoche: string, user: User) =>{
    const db = getDB();
    if(!user) throw new Error("no se encuentra el token")
    const coche = await db.collection<Coche>(COCHE_COLLECTIONS).findOne({_id: new ObjectId(idCoche)})

    if(!coche) throw new Error("has introducido un id que no existe")

    await db.collection(COCHE_COLLECTIONS).deleteOne({_id: new ObjectId(idCoche)});
    const propietario = coche.propietario;
    const a = await db.collection<User>(USER_COLLECTIONS).findOne({username: propietario})
    const nuevoArray = a!.coches!.filter((n)=> n !== idCoche)
    await db.collection<User>(USER_COLLECTIONS).updateOne({username: propietario}, {$set: {coches: nuevoArray}})
    return coche;
}
export const modificarMatricula = async(idCoche: string, matriculaNueva: string, user: User)=>{
    const db = getDB();
    if(!user) throw new Error("no se encuentra el token")
    //await db.collection<User>(USER_COLLECTIONS).updateOne({_id: user._id && coches: {}}, {})

    const coche = await db.collection<Coche>(COCHE_COLLECTIONS).findOne({_id: new ObjectId(idCoche)})
    if(!coche) throw new Error("has introducido un id que no existe")
    if(coche.propietario !== user.username){
        throw new Error("no tienes un coche con el id introducido")
    }
    await db.collection(COCHE_COLLECTIONS).updateOne({_id: coche._id}, {$set: {matricula: matriculaNueva}})
    return await db.collection(COCHE_COLLECTIONS).findOne({_id: coche._id})
}
