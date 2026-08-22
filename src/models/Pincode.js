// import mongoose from 'mongoose';

// const PincodeSchema = new mongoose.Schema({
//   PRODUCT: { type: String },
//   DESTINATIONPINCODE: { type: String, required: true },
//   CITY: { type: String },
//   STATE: { type: String },
//   "DEST.REGION": { type: String },
//   ZONE: { type: String },
//   PREPAID: { type: String },
//   COD: { type: String },
//   DESTINATIONCATEGORY: { type: String },
//   price: { type: Number, default: 0 },
//   slabIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ShippingSlab' }]
// }, { 
//   collection: 'pincode-dtdc',
//   timestamps: true 
// });

// // Index for faster searching
// PincodeSchema.index({ DESTINATIONPINCODE: 1 });
// PincodeSchema.index({ CITY: 'text', STATE: 'text', ZONE: 'text' });

// const Pincode = mongoose.models.PincodeDtdc || mongoose.model('PincodeDtdc', PincodeSchema);

const Pincode = {};
export default Pincode;

