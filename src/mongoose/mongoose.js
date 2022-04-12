const mongoose = require('mongoose');
module.exports = {
  connect() {
    mongoose.connect(`mongodb+srv://yj:even0120@rozaliya-olenyeva.ruusm.mongodb.net/ProjectI?retryWrites=true&w=majority`);
    console.log(`connection open`);
  },
  connect_close() {
    mongoose.connection.close();
    console.log(`connection close`);
  },
}


