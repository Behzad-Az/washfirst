// const connection = require('../server/db/knexfile.js').development;
// const knex = require('knex')(connection);

editItemWithTags = (req, res, knex) => {

  let data = req.body;

  let itemInfo = {
    type: data.type,
    gender: data.gender,
    size: data.size,
    description: data.description,
    img_url: data.img_url
  };

  // let itemInfo = data;
  let item_id = data.item_id;
  let tags = data.tags.split(' ');

  addOrUpdateTag = (tag, item_id) => new Promise((resolve, reject) => {
    knex('item_tag').where('item_id', item_id).del().then(() => {
      knex('tags').insert({content: tag}).returning('id').asCallback((err, tag_id) => {
      if (tag_id) {
        knex('item_tag').insert({'tag_id': tag_id[0], 'item_id': item_id}).asCallback((err, rows) => {
          if (err) { reject(); }
          else { resolve(); }
        });
      } else {
        knex('tags').select('id').where('content', tag).asCallback((err, rows) => {
          if (err) { reject(); }
          else {
            console.log("IT EXISTS: ", rows, tag);
            tag_id = rows[0].id;

            knex('item_tag').insert({'tag_id': tag_id, 'item_id': item_id}).asCallback((err, rows) => {
              if (err) { reject(); }
              else { resolve(); }
            });
          }
        });
      };
      });
    });
  });


  editItem = (itemInfo, item_id) => {
    knex('items').where('id', item_id).update(itemInfo).then(() => {
      let promiseArr = [];
      tags.forEach((tag) => {
        promiseArr.push(addOrUpdateTag(tag, item_id));
      });
      console.log("im here");
      Promise.all(promiseArr).then(() => {
        console.log("tags updated on item");
      });
    });
  }

  editItem(itemInfo, item_id);

}

module.exports = editItemWithTags;

// changeItemTags(null, null, knex);
