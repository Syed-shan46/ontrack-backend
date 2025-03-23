const mongoose = require('mongoose');
const { Schema } = mongoose; 

const storySchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    image: {
        type: String,
        required: true
    },
   
});

module.exports = mongoose.model('Story', storySchema);