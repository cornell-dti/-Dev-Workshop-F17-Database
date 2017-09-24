# Fall 2017 Developer Workshop - Database Wrapper

A thin wrapper around Firebase Realtime Database to help developers hit a database easily during the workshop. The master branch is synced with [Heroku](cdti-db.herokuapp.com)!

## Documentation:

Think of this as a database; we've just abstracted away the details to help you get set up quickly. This database is segmented by NetID, so everybody has their own little database to play around with, within the larger database. This means that you can mess around with your database without affecting others' data! You should replace `netid' with your NetID wherever you see it.

The database stores entries in the queue, where each entry represents one person in the queue. As such, each entry contains a timestamp field (in milliseconds since epoch) at which the person entered; a name field that contains the name they entered; and an is_resolved field, which should be 0 if their question is yet to be resolved, or 1 if it has already been resolved.

You can use this database by sending requests to the following endpoints. The base URL is always cdti-db.herokuapp.com; append the endpoints below to get the actual links. Wherever you see a colon preceding some name, it means that you must provide that parameter as an input (for example, replace :netid with your own NetID).

- **GET /:netid/select** - Returns a list containing all the entries (as JSON objects) in your personal queue, in no particular (i.e. randomized) order. If there are no entries, `null' will be returned. Otherwise, you will receive a list, which in turn contains elements corresponding to entries. Each list element contains a key, which is a unique identifier for the queue entry, and also a value which contains information about the entry. Each entry value has three fields: timestamp, name, and is_resolved. Try it out by replacing netid with your own NetID, and going to this URL: cdti-db.herokuapp.com/netid/select. You should see your browser say null, which means that your database is currently empty!

- **GET /:netid/insert/:name/:is_resolved** - To insert a new entry into the database, hit this endpoint with the user's name and initial is_resolved status (0 or 1, as defined above). This will persist the user's entry into the database so that you can later retrieve it. Note that this automatically populates the timestamp field on the backend!

- **GET /:netid/update/:key/:field/:newValue** - If you want to update an existing entry in the database, you should hit this endpoint. You'll need to provide it the key corresponding to the entry you would like to edit, along with the field that you are changing, and the value you would like to change it to. By field, we mean either timestamp, name, or is_resolved. newValue is simply the updated value that the entry should take on.

- **GET /:netid/selectKey/:key** - You can hit this endpoint if you want the details of just a single entry with some known key. It'll return a JSON objects with the same fields described above (timestamp, name, is_resolved), and will return null if no entry with that key exists.

- **GET /:netid/delete/:key?** - This endpoint can be used to either delete all the entries, or a particular entry in your queue. If there is no key parameter provided, then it will delete all the entries in the queue. If there is a key provided, then it will only delete the entry for that particular key. As such, key is an optional parameter (hence the question mark after it).