// import mongoose from 'mongoose';

// const AddressSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   pincode: { type: String, required: true },
//   isDefault: { type: Boolean, default: false }
// });

// const UserSchema = new mongoose.Schema({
//   phone: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },
//   shopifyCustomerId: { 
//     type: String, 
//     required: false 
//   },
//   firstName: { 
//     type: String, 
//     default: "" 
//   },
//   lastName: { 
//     type: String, 
//     default: "" 
//   },
//   email: { 
//     type: String, 
//     default: "" 
//   },
//   addresses: [AddressSchema],
//   role: { 
//     type: String, 
//     enum: ['user', 'admin'],
//     default: 'user' 
//   },
//   cart: {
//     type: Array, // Temporarily an array of cart items, matching exactly what the frontend uses
//     default: []
//   },
//   password: {
//     type: String,
//     required: false
//   }
// }, { 
//   timestamps: true 
// });

// console.log('User Schema Paths:', Object.keys(mongoose.models.User?.schema?.paths || {}));

// const User = mongoose.models.User || mongoose.model('User', UserSchema);

const User = {};
export default User;

