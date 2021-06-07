const CollectionsModel = require('./collections.models');

// List all collections records
exports.list_all = function (req, res) {
  CollectionsModel.getAllCollections(function (err, collections) {
    if (err) {
      console.log('CollectionsModel.getAllCollections controller error: ', err);
    } else {
      res.send(collections);
    }
  });
};

// Read specific collection record
exports.getOneCollectionRecord = function (req, res) {
  const { collection_id } = req.params;
  //console.log('Getting with collection_id: ' + req.params);
  CollectionsModel.getCollection(collection_id, function (err, collections) {
    if (err) {
      console.log('CollectionsModel.getCollection controller error: ', err);
    } else {
      res.send(collections);
    }
  });
};

// Update one collection
exports.update_one_collection = function (req, res) {
  const { collection_id } = req.params;

  CollectionsModel.updateOne(collection_id, function (err, collections) {
    if (err) {
      console.log('CollectionsModel.updateOne controller error: ', err);
    } else {
      res.send(collections);
    }
  });
};
