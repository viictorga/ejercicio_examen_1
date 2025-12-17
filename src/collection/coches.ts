import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo"
import { Coche, User } from "../types";
import { COCHE_COLLECTIONS, USER_COLLECTIONS } from "../utils";



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

$in     → array {$in: {coches: "9274"}} -------------- {_id: {$in: arrayObjectId}}
$nin    → contiene valores dentro de un array {$nin: {coches: "9274"}}

filter -> en base a una condicion genera un booleano, si es true la "n" entra en el array resultante final, sino no entra
    ej: const a = b.filter((n)=> n !== 1) -> a sera un array el cual tendra todos los valores de b que no sean 1

map -> tendras que returnear algo, tambien se crea un array, en el entrara con la logica aplicada lo que pongas en el return
    ej: cosnt a = b.map((n)=>{if(n !==1) return 2; else return 3;})

find -> devolvera a "a" el primer valor de n que genere un true en la condicion
    ej: const a = b.find((n)=> n != 2)-> a sera solo un numero, el primero que cumpla esa condicion, sino undefined

forEach -> ejecuta la logica indicada, cambia el array al que se le hace el forEach, no se guarda en algo nuevo
    ej: b.forEach((n)=> n= n +1) -> cambia todo b

some -> si alguno de los valores de n es true, la variable sera true, si NO lo cumple NINGUNO sera false
    ej: const a = b.some((n)=> n !==1) -> a sera la variable booleana

every -> si alguno de los valores de n es false, la variable sera false, si SE lo cumplen TODOS sera true
    ej: const a = b.some((n)=> n !==1) -> a sera la variable booleana

reduce -> te dejara ir guardando valores tras iteraciones en una variable inicial, luego sera el acumulador
    ej: type Valores = {
        par: number[],
        noPar: number[]
    }
    const b : Array<number>= [1,2,3,5]
    const tipo : Valores= {par: [],noPar: []}

    const c = b.reduce((acc,n)=>{
        if(n % 2 === 0){
            
            return {
                par: [...acc.par, n],
                noPar: acc.noPar
            }
        }else{
            acc.noPar.push(n);
            return acc;
        }

        return acc;
    },tipo as Valores)


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

    const coche = await db.collection<Coche>(COCHE_COLLECTIONS).findOne({_id: new ObjectId(idCoche)})
    if(!coche) throw new Error("has introducido un id que no existe")
    if(coche.propietario !== user.username){
        throw new Error("no tienes un coche con el id introducido")
    }
    
    
    const coche2 = {...coche, matricula:matriculaNueva}

    await db.collection(COCHE_COLLECTIONS).updateMany({_id: coche._id}, {$set: {matricula: matriculaNueva}})
    return await db.collection(COCHE_COLLECTIONS).findOne({_id: coche._id})
}
