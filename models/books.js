// Module: app.js
//
// Contains functions to interact with the database
//

// Include Library
var Datastore = require('nedb')
// Create connection to database
  db = new Datastore({ filename: 'data.db', autoload: true });
module.exports = {

    // Insert document into database
    // If content argument is missing, use empty string
    // Return the created resource
    async create(body){
        return await books.insert({
            content: body.content || "",
        })
    },

    // Find the document with the corresponding ID
    // Return the resource
    async get(userID){
        return await books.findOne({_id:userID})
    },

    // Find all documents
    // Return the resources
    async all(){
        return await books.find({})
    },

    // Try to remove the document with corresponding ID
    // Returns if any documents were removed
    async remove(userID){
        const numDeleted = await books.remove({_id:userID})
        return numDeleted > 0
    },

    // Try to update the document with corresponding ID
    // Returns if any documents were updated
    async update(userID, body){        
        const numUpdated = await books.update(
            {_id:userID},
            {$set:{
                    content: body.content || books.content
            }}
        )
        return numUpdated > 0
    }
}