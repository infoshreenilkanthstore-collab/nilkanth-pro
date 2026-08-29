// import mongoose from 'mongoose';

// const EnquirySchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: [true, 'First name is required'],
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: [true, 'Last name is required'],
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: [true, 'Phone number is required']
//   },
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     lowercase: true,
//     trim: true
//   },
//   message: {
//     type: String,
//     required: [true, 'Message is required']
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'read', 'responded'],
//     default: 'pending'
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

const Enquiry = {};
export default Enquiry;

