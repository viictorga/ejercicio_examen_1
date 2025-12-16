import { ObjectId } from "mongodb"

export type User = {
    _id?: ObjectId,
    username: string,
    email:string,
    password: string
    coches?:string[]
}
export type Coche = {
    _id?:ObjectId,
    matricula: string,
    propietario?: string,
    modelo: string
}