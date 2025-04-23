const mongoose = require("mongoose");
const { Schema } = mongoose;

const bannerSchema = new Schema({
    image: {
        type: String,
        required: true,
    },
    userId: {  // Make sure to use userId if you're passing userId in the controller
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
}, { timestamps: true });

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
