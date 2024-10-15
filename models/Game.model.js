import mongoose from 'mongoose';
const gameSchema = new mongoose.Schema(
    {
        player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        randomNumber: { type: Number, required: true },
        winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.model('Game', gameSchema);
