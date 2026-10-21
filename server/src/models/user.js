import mongoose, {Schema} from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    name : {
        type : String,
        require : true,
        min : 3,
        unique : true
    },
    password : {
        type : String,
        require : true,
        min : 6
    }
});
userSchema.pre("save", async function() {
    if(!this.isModified("password")){
        return
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}

export const User = mongoose.model("User", userSchema)