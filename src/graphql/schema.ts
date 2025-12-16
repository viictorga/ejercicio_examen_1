import { gql } from "apollo-server";


export const typeDefs = gql`

    type User {
        _id: ID!
        email: String!
        username: String!
        coches: [Coche]!
    }
    type Coche {
        _id: ID!
        matricula: String!
        propietario: String
        modelo: String!
    }
    type Query {
        me: User!
        addCoche(matricula: String!, modelo: String!): Coche!
        findCoches(page: Int, size:Int):[Coche]! 
        findCocheById(id: String!): Coche!
    }
    type Mutation{
        register(email: String!, password: String!): String!
        login(email: String!, password: String!): String!
        buyCoche(idCoche: String!): User!
        borrarCoche(idCoche:String!): Coche!
        modificarMatricula(idCoche:String!, matriculaNueva:String!): Coche!
    }
    
    





`;