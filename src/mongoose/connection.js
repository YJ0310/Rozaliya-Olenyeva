const mongoose = require(`mongoose`);
module.exports = {
    connect(){
        mongoose.connect(`mongodb+srv://yj:even0120@rozaliya-olenyeva.ruusm.mongodb.net/ProjectI?retryWrites=true&w=majority`);
        console.log(`mongodb connected`)
    }
}