const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const UserSchema =  new mongoose.Schema({
    username:String,
    email:String,
    password:String,
},{
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
});

//Hashing password before saving
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err){
        next(err);
    }
})

//Compare hashed passwords
UserSchema.methods.comparePassword =  async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', UserSchema);
module.exports = User;