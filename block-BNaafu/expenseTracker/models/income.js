let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let incomeSchema = new Schema({
    incname: {type: String, required: true},
    sources: {type: [String], required: true},
    amount: {type: Number, required: true},
    date: {type: Date, required: true},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true});

incomeSchema.index({sources: 1});
incomeSchema.index({date: 1});

module.exports = mongoose.model("Income", incomeSchema);