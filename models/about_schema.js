const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aboutSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,

        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        phone: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const About = mongoose.model("About", aboutSchema);
module.exports = About;
