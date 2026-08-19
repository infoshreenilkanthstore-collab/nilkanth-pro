// import mongoose from 'mongoose';

// const ShippingSlabSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   slabs: [{
//     minWeight: { type: Number, default: 0 },
//     maxWeight: { type: Number, default: 0 },
//     price: { type: Number, default: 0 },
//     isFree: { type: Boolean, default: false }
//   }]
// }, { 
//   timestamps: true 
// });

// const ShippingSlab = mongoose.models.ShippingSlab || mongoose.model('ShippingSlab', ShippingSlabSchema);

const ShippingSlab = {};
export default ShippingSlab;

