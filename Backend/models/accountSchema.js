const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const accountSchema = new mongoose.Schema({
    email : String,
    password : String,
    confirmpwd : String,
    orders : [
        {
            name : String,
            phone : String,
            address : String,
            products : [{
                name : String,
                price : Number
            }],
            time : String,
        }
    ],
    tokens: [{
        token:{type:String, required: true}
    }],
});

accountSchema.methods.generateJWT = async function(){
    try {
        const token = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token});
        const status = await this.save()

        if(status.email && Object.keys(status).length){
            console.log(`New Email Registered : ${status.email}`)
            return token; // token generate sucess
        }
        else
            console.log(`Error while signup.\n InFile : accountSchema.js \n InMethod : generateJWT`)
        return null; // no token generated
    }
    catch (err) {
        console.log(err.message + ' jwt in gneratejwt');
    }
}

const Account = mongoose.model('account', accountSchema);

module.exports = Account;
