import {Db, MongoClient} from "mongodb";
import dotenv from "dotenv";
import { dbName  } from "../utils";
dotenv.config();



let client: MongoClient;
let db: Db;


export const connectToMongoDB = async ()=>{
    try {
        const mongoUrl = process.env.MONGO_URL
        
        if(mongoUrl){
            client = new MongoClient(mongoUrl)

            await client.connect();
            db = client.db(dbName)
            console.log("veeeenga chaval, estas conectado a mongo");
        }
        else{
            throw new Error("Falla el mongo_url")
        }
        
        
    } catch (error) {
        console.error("error de mongo capitan", error);
        process.exit(1);
    }
};


export const getDB = (): Db => db;

