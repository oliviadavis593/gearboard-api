const ItemsService = {
    getAllItems(knex) {
        return knex.select('*').from('gearboard_items')
    },
    //creating a method & having it return a promise => ADDING BOOKMARKS
    insertItems(knex, newItem) {
        //return Promise.resolve({})
     return knex
         .insert(newItem)
         .into('gearboard_items')
         .returning('*')
         .then(rows => {
             return rows[0]
         })
    }, 
    getById(knex, id) {
        return knex('gearboard_items').select('*').where('id', id).first();
    },
    deleteItem(knex, id) {
     return knex('gearboard_items')
          .where({ id })
          .delete()
     },
     updateItem(knex, id, newItemFields) {
         return knex('gearboard_items')
             .where({ id })
             .update(newItemFields)
     }
 }
 module.exports = ItemsService