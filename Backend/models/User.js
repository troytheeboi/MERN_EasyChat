import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    profilePhoto: {
        type: String,
        default: null
    },
    accessToken: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Static method to find a user by Google ID
userSchema.statics.findByGoogleId = async function(googleId) {
    console.log(`googleId in user model: ${googleId}`);
    const user = await this.findOne({ googleId });
    return await this.findOne({ googleId });
};

const User = mongoose.model('User', userSchema);

export default User; 