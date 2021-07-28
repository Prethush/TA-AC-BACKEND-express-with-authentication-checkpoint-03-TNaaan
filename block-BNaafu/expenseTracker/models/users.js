let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

let userSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true, unique: true},
    passwd: {type: String, minlength: 5},
    age: {type: Number},
    phone: {type: String, minlength: 10},
    country: {type: String},
    github: {
        username: String,
        image: String
    },
    google: {
        username: String,
        image: String
    },
    providers: [String],
    isVerified: {type: Boolean, required: true},
    incomes: [{type: Schema.Types.ObjectId, ref: "Income"}],
    expenses: [{type: Schema.Types.ObjectId, ref: "Expense"}], 
    random: String
}, {timestamps: true});

userSchema.pre('save', function(next) {
    if(this.passwd && this.isModified('passwd')) {
        bcrypt.hash(this.passwd, 10, (err, hashed) => {
            if(err) return next(err);
            this.passwd = hashed;
            return next();
        })
    
    } else {
        next();
    }
});

userSchema.methods.verifyPasswd = function(passwd, cb) {
    bcrypt.compare(passwd, this.passwd, (err, result) => {
        return cb(err, result);
    })
}

module.exports = mongoose.model("User", userSchema);
