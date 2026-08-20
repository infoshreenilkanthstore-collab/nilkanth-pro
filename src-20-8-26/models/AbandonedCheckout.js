// import mongoose from 'mongoose';

// const AbandonedCheckoutSchema = new mongoose.Schema({
//   phone: { 
//     type: String, 
//     required: true, 
//     index: true 
//   },
//   firstName: { type: String, default: "" },
//   lastName: { type: String, default: "" },
//   email: { type: String, default: "" },
//   address: { type: String, default: "" },
//   city: { type: String, default: "" },
//   state: { type: String, default: "" },
//   pincode: { type: String, default: "" },
//   cart: {
//     type: Array,
//     default: []
//   },
//   subtotal: { type: Number, default: 0 },
//   isDeliverable: { type: Boolean, default: true },
//   status: { 
//     type: String, 
//     enum: ['draft', 'completed'],
//     default: 'draft' 
//   }
// }, { 
//   timestamps: true 
// });

// const AbandonedCheckout = mongoose.models.AbandonedCheckout || mongoose.model('AbandonedCheckout', AbandonedCheckoutSchema);

const AbandonedCheckout = {};
export default AbandonedCheckout;

