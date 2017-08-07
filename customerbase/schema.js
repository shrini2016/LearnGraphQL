const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Hardcoded Data
/*
const customers = [
    {
        id:'1',
        name:'Shrini',
        email:'s@xyz.com',
        age:48
    },
    {
        id:'2',
        name:'Tushi',
        email:'t@xyz.com',
        age:20
    },
    {
        id:'3',
        name:'Abhi',
        email:'a@xyz.com',
        age:17
    },
];
*/

// Customer Type
const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type:GraphQLString},
        email: {type:GraphQLString},
        age: {type:GraphQLInt},
    })
});
// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        customer: {
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentvalue, args){
                /*
                for (let i = 0; i < customers.length; i++) {
                    if (customers[i].id == args.id) {
                        return customers[i];
                    }
                }
                */
                return axios.get('http://localhost:3000/customers/' + args.id)
                    .then(res => res.data);
            }
        },
        customers: {
            type:new GraphQLList(CustomerType),
            resolve(parentvalue, args){
                return axios.get('http://localhost:3000/customers/')
                    .then(res => res.data);
            }
        },
    }
});

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                email:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parentvalue, args){
                return axios.post('http://localhost:3000/customers', {
                    name: args.name,
                    email: args.email,
                    age: args.age
                })
                .then(res=>res.data);
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentvalue, args){
                return axios.delete('http://localhost:3000/customers/'+args.id)
                .then(res=>res.data);
            }
        },
        updateCustomer:{
            type:CustomerType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)},
                name:{type:GraphQLString},
                email:{type:GraphQLString},
                age:{type:GraphQLInt},
            },
            resolve(parentvalue, args){
                return axios.patch('http://localhost:3000/customers/'+args.id, args)
                .then(res=>res.data);
            }
        },
    }
});
module.exports  = new GraphQLSchema({
    query:RootQuery,
    mutation
}); 