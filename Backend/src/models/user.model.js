import mongoose from 'mongoose';

// Création du schéma pour l'utilisateur
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Empêche les emails en double
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum de 6 caractères pour le mot de passe
    },
    profilePic: {
        type: String,
        default: '', // Photo de profil par défaut vide
    },
}, {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

// Création du modèle à partir du schéma
const User = mongoose.model('User', userSchema);

export default User;
