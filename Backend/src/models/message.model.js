import mongoose from 'mongoose';

// Création du schéma pour l'utilisateur
const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    text: {
        type: String,
    },
    image: {
        type: String,

    },
}, {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

// Création du modèle à partir du schéma
const Message = mongoose.model('Message', messageSchema);

export default Message;