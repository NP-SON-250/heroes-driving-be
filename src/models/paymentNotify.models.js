import mongoose from "mongoose";


const paymentNotifySchema = new mongoose.Schema({
    names: {type: String},
    phone: {type: String},
    code:{type: String},
    paidOn: { type: Date, default: Date.now },
});

const PaymentNotifierModel = mongoose.model("adminNitifications",paymentNotifySchema);
export default PaymentNotifierModel;