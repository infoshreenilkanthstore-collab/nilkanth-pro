// import mongoose from 'mongoose';

// const BulkOrderSchema = new mongoose.Schema({
//     fullName: {
//         type: String,
//         required: true,
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//     },
//     requiredProduct: {
//         type: String,
//         required: true,
//     },
//     quantity: {
//         type: Number,
//         required: true,
//     },
//     message: {
//         type: String,
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'contacted', 'completed', 'cancelled'],
//         default: 'pending',
//     },
// }, { timestamps: true });

// export default mongoose.models.BulkOrder || mongoose.model('BulkOrder', BulkOrderSchema);

const BulkOrder = {};
export default BulkOrder;

