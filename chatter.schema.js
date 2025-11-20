import mongoose from 'mongoose';

const chatterSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, "Some text is required"] // commented because not required
    },
    message: {
        type: String,
    },
    time: {
        type: String,
        // default: Date.now // commented because not required
    }
});

const Chat = mongoose.model("Chat", chatterSchema);

export default Chat;