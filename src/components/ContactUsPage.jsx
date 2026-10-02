import React, { useState } from "react";
import { Mail, Phone, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitEnquiry } from "../services/api";

export default function ContactUsPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "IN",
    phone: "",
    email: "",
    enquiryMessage: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateField = (name, value) => {
    let error = "";
    const trimmed = (value || "").trim();

    switch (name) {
      case "firstName":
        if (!trimmed) {
          error = "First name is required";
        } else if (trimmed.length < 2) {
          error = "First name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
          error = "First name can only contain letters";
        }
        break;

      case "lastName":
        if (!trimmed) {
          error = "Last name is required";
        } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
          error = "Last name can only contain letters";
        }
        break;

      case "phone": {
        const digits = (value || "").replace(/\D/g, "");
        if (!digits) {
          error = "Phone number is required";
        } else if (digits.length !== 10) {
          error = "Please enter a valid 10-digit mobile number";
        } else if (!/^[6-9]\d{9}$/.test(digits)) {
          error = "Mobile number should start with 6, 7, 8, or 9";
        }
        break;
      }

      case "email":
        if (!trimmed) {
          error = "Email address is required";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)
        ) {
          error = "Please enter a valid email address";
        }
        break;

      case "enquiryMessage":
        if (!trimmed) {
          error = "Enquiry message is required";
        } else if (trimmed.length < 10) {
          error = "Message must be at least 10 characters long";
        }
        break;

      default:
        break;
    }
    return error;
  };

  const validateAll = () => {
    const newErrors = {
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
      enquiryMessage: validateField("enquiryMessage", formData.enquiryMessage),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => Boolean(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "phone") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (touched[name]) {
      const fieldError = validateField(name, formattedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      enquiryMessage: true,
    });

    const isValid = validateAll();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        mobile: formData.phone.trim(),
        message: formData.enquiryMessage.trim(),
      };

      const res = await submitEnquiry(payload);
      if (res.success) {
        setSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          countryCode: "IN",
          phone: "",
          email: "",
          enquiryMessage: "",
        });
        setErrors({});
        setTouched({});
      } else {
        setErrorMessage(res.message || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f6f6f6] min-h-screen text-[#1c1917] font-nunito pb-0">
      {/* 1. Breadcrumb Bar */}
      <div className="w-full border-b border-stone-200/70 bg-white/80 backdrop-blur-sm">
        <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex items-center gap-2 text-xs sm:text-sm text-stone-500">
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="hover:text-[#700b10] transition-colors font-medium cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#700b10] font-semibold">Contact Us</span>
        </div>
      </div>

      {/* 2. Top Banner: /contect-us.png with Overlay Heading Card */}
      <section className="w-full relative overflow-hidden bg-[#faeed1] shadow-xs flex items-center justify-center">
        <div className="w-full flex items-center justify-center relative">
          <img
            src="https://megaecomm.megascale.co.in/backend/media/16/general/329ba22dc957e706d85660d29601e5f1.png"
            alt="Contact Us - Shri Nilkanth Store"
            className="w-full h-auto max-w-[1920px] object-contain select-none block"
            loading="eager"
          />

          {/* Centered Floating 'Contact Us' Card matching screenshot */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
            <div className="px-8 sm:px-14 md:px-18 py-4 sm:py-6 md:py-8">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#700b10] font-normal tracking-tight text-center whitespace-nowrap">
                Contact Us
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Centered Clean Form Section matching screenshot */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 md:pt-16 pb-10">
        {submitted ? (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-stone-200/90 shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-[#ebd99c]/30 text-[#700b10] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="font-serif text-2xl text-[#700b10] mb-2">
              Thank You for Contacting Us!
            </h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
              Your inquiry has been received successfully. We will get back to
              you shortly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="bg-[#1f1f1f] text-white hover:bg-black text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Error message alert */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium p-3.5 rounded-xl flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* First Name */}
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="First name"
                className={`w-full px-4 py-3 rounded-lg border text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden transition-colors shadow-2xs ${
                  errors.firstName && touched.firstName
                    ? "border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500"
                    : "border-stone-300 bg-white focus:border-stone-500"
                }`}
              />
              {errors.firstName && touched.firstName && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.firstName}</span>
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Last name"
                className={`w-full px-4 py-3 rounded-lg border text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden transition-colors shadow-2xs ${
                  errors.lastName && touched.lastName
                    ? "border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500"
                    : "border-stone-300 bg-white focus:border-stone-500"
                }`}
              />
              {errors.lastName && touched.lastName && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.lastName}</span>
                </p>
              )}
            </div>

            {/* Country code (IN) + Phone +91 */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-16 sm:w-20 px-3 py-3 rounded-lg border border-stone-300 bg-white text-stone-700 text-xs sm:text-sm font-semibold text-center select-none shadow-2xs flex items-center justify-center">
                  IN
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="Phone +91"
                  className={`flex-1 px-4 py-3 rounded-lg border text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden transition-colors shadow-2xs ${
                    errors.phone && touched.phone
                      ? "border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500"
                      : "border-stone-300 bg-white focus:border-stone-500"
                  }`}
                />
              </div>
              {errors.phone && touched.phone && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email"
                className={`w-full px-4 py-3 rounded-lg border text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden transition-colors shadow-2xs ${
                  errors.email && touched.email
                    ? "border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500"
                    : "border-stone-300 bg-white focus:border-stone-500"
                }`}
              />
              {errors.email && touched.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Enquiry Message */}
            <div>
              <textarea
                name="enquiryMessage"
                rows={4}
                value={formData.enquiryMessage}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enquiry Message"
                className={`w-full px-4 py-3 rounded-lg border text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden transition-colors shadow-2xs resize-y ${
                  errors.enquiryMessage && touched.enquiryMessage
                    ? "border-rose-500 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-500"
                    : "border-stone-300 bg-white focus:border-stone-500"
                }`}
              />
              {errors.enquiryMessage && touched.enquiryMessage && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.enquiryMessage}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "#1c1c1c",
                  color: "#ffffff",
                }}
                className="w-full text-white font-medium text-sm sm:text-base py-3.5 px-6 rounded-lg transition-all duration-200 cursor-pointer shadow-md hover:opacity-90 active:scale-[0.99] disabled:opacity-75 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span style={{ color: "#ffffff" }}>Submitting...</span>
                  </>
                ) : (
                  <span style={{ color: "#ffffff", fontWeight: 600 }}>
                    Submit
                  </span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* 4. Rounded Gray Info Box matching screenshot */}
        <div className="mt-8 bg-[#ececec] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center space-y-2.5">
          {/* Email */}
          <div className="flex items-center justify-center gap-2 text-stone-800 text-sm sm:text-[15px]">
            <Mail className="w-4 h-4 text-stone-700 flex-shrink-0" />
            <span>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:contact@nilkanthstore.com"
                className="text-[#2563eb] hover:underline"
              >
                contact@nilkanthstore.com
              </a>
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-center gap-2 text-stone-800 text-sm sm:text-[15px]">
            <Phone className="w-4 h-4 text-stone-700 flex-shrink-0" />
            <span>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+918866794111"
                className="text-[#2563eb] hover:underline"
              >
                +91 88667 94111
              </a>
            </span>
          </div>

          {/* Time */}
          <div className="text-stone-700 text-sm sm:text-[15px] pt-0.5">
            <strong>Time:</strong> 8:30 to 6:00
          </div>
        </div>
      </section>

      {/* 5. Google Maps Location Section - Edge-to-Edge Responsive Full Width */}
      <section className="w-full mt-10 sm:mt-14 pb-0">
        <div className="w-full h-[520px] sm:h-[620px] md:h-[700px] lg:h-[780px] relative overflow-hidden bg-[#e5e3df] border-t border-stone-200">
          <iframe
            title="Shri Nilkanth Store Location - NiketanDham Rd, Poicha, Rajpipla"
            src="https://maps.google.com/maps?q=21.96998,73.467531+(Nilkanth+Store)&hl=en&z=15&output=embed"
            className="w-full h-full border-0 block"
            style={{ width: "100%", height: "100%", minHeight: "450px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Top-Left 'Open in Maps' Floating Button matching screenshot */}
          <div className="absolute top-4 left-4 z-20">
            <a
              href="https://www.google.com/maps/search/Nilkanth+Store+NiketanDham+Rd+Poicha+Rajpipla/@21.96998,73.467531,3385m/data=!3m1!1e3?hl=en-US&entry=ttu"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-white text-[#1a73e8] hover:text-[#174ea6] font-medium text-xs sm:text-[13px] px-3.5 py-2 rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.25)] border border-stone-200/90 transition-all hover:bg-stone-50"
            >
              <span>Open in Maps</span>
              <svg
                className="w-3.5 h-3.5 stroke-current stroke-[2.2] fill-none"
                viewBox="0 0 24 24"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
 


// import React, { useState } from "react";
// import { Mail, Phone, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
// import { submitEnquiry } from "../services/api";

// export default function ContactUsPage({ onNavigate }) {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     countryCode: "IN",
//     phone: "",
//     email: "",
//     enquiryMessage: "",
//   });

//   const [submitted, setSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errorMessage) {
//       setErrorMessage("");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrorMessage("");

//     try {
//       const payload = {
//         first_name: formData.firstName.trim(),
//         last_name: formData.lastName.trim(),
//         email: formData.email.trim(),
//         mobile: formData.phone.trim(),
//         message: formData.enquiryMessage.trim(),
//       };

//       const res = await submitEnquiry(payload);
//       if (res.success) {
//         setSubmitted(true);
//         setFormData({
//           firstName: "",
//           lastName: "",
//           countryCode: "IN",
//           phone: "",
//           email: "",
//           enquiryMessage: "",
//         });
//       } else {
//         setErrorMessage(res.message || "Failed to submit enquiry. Please try again.");
//       }
//     } catch (err) {
//       setErrorMessage("An unexpected error occurred. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full bg-[#f6f6f6] min-h-screen text-[#1c1917] font-nunito pb-0">
//       {/* 1. Breadcrumb Bar */}
//       <div className="w-full border-b border-stone-200/70 bg-white/80 backdrop-blur-sm">
//         <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex items-center gap-2 text-xs sm:text-sm text-stone-500">
//           <button
//             type="button"
//             onClick={() => onNavigate?.("home")}
//             className="hover:text-[#700b10] transition-colors font-medium cursor-pointer"
//           >
//             Home
//           </button>
//           <span>/</span>
//           <span className="text-[#700b10] font-semibold">Contact Us</span>
//         </div>
//       </div>

//       {/* 2. Top Banner: /contect-us.png with Overlay Heading Card */}
//       <section className="w-full relative overflow-hidden bg-[#faeed1] shadow-xs flex items-center justify-center">
//         <div className="w-full flex items-center justify-center relative">
//           <img
//             src="https://megaecomm.megascale.co.in/backend/media/16/general/329ba22dc957e706d85660d29601e5f1.png"
//             alt="Contact Us - Shri Nilkanth Store"
//             className="w-full h-auto max-w-[1920px] object-contain select-none block"
//             loading="eager"
//           />

//           {/* Centered Floating 'Contact Us' Card matching screenshot */}
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
//             <div className="px-8 sm:px-14 md:px-18 py-4 sm:py-6 md:py-8">
//               <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#700b10] font-normal tracking-tight text-center whitespace-nowrap">
//                 Contact Us
//               </h1>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 3. Centered Clean Form Section matching screenshot */}
//       <section className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 md:pt-16 pb-10">
//         {submitted ? (
//           <div className="bg-white rounded-2xl p-8 sm:p-10 border border-stone-200/90 shadow-sm text-center">
//             <div className="w-14 h-14 rounded-full bg-[#ebd99c]/30 text-[#700b10] flex items-center justify-center mx-auto mb-4">
//               <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
//             </div>
//             <h3 className="font-serif text-2xl text-[#700b10] mb-2">
//               Thank You for Contacting Us!
//             </h3>
//             <p className="text-stone-600 text-sm max-w-md mx-auto mb-6">
//               Your inquiry has been received successfully. We will get back to
//               you shortly.
//             </p>
//             <button
//               type="button"
//               onClick={() => setSubmitted(false)}
//               className="bg-[#1f1f1f] text-white hover:bg-black text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
//             >
//               Submit Another Response
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Error message alert */}
//             {errorMessage && (
//               <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium p-3.5 rounded-xl flex items-start gap-2.5 animate-fadeIn">
//                 <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
//                 <span>{errorMessage}</span>
//               </div>
//             )}

//             {/* First Name */}
//             <div>
//               <input
//                 type="text"
//                 name="firstName"
//                 required
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 placeholder="First name"
//                 className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden focus:border-stone-500 transition-colors shadow-2xs"
//               />
//             </div>

//             {/* Last Name */}
//             <div>
//               <input
//                 type="text"
//                 name="lastName"
//                 required
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 placeholder="Last name"
//                 className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden focus:border-stone-500 transition-colors shadow-2xs"
//               />
//             </div>

//             {/* Country code (IN) + Phone +91 */}
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="w-16 sm:w-20 px-3 py-3 rounded-lg border border-stone-300 bg-white text-stone-700 text-xs sm:text-sm font-semibold text-center select-none shadow-2xs flex items-center justify-center">
//                 IN
//               </div>
//               <input
//                 type="tel"
//                 name="phone"
//                 required
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Phone +91"
//                 className="flex-1 px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden focus:border-stone-500 transition-colors shadow-2xs"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//                 className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden focus:border-stone-500 transition-colors shadow-2xs"
//               />
//             </div>

//             {/* Enquiry Message */}
//             <div>
//               <textarea
//                 name="enquiryMessage"
//                 required
//                 rows={4}
//                 value={formData.enquiryMessage}
//                 onChange={handleChange}
//                 placeholder="Enquiry Message"
//                 className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm placeholder-stone-400 focus:outline-hidden focus:border-stone-500 transition-colors shadow-2xs resize-y"
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="pt-1">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 style={{
//                   backgroundColor: "#1c1c1c",
//                   color: "#ffffff",
//                 }}
//                 className="w-full text-white font-medium text-sm sm:text-base py-3.5 px-6 rounded-lg transition-all duration-200 cursor-pointer shadow-md hover:opacity-90 active:scale-[0.99] disabled:opacity-75 flex items-center justify-center gap-2"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin text-white" />
//                     <span style={{ color: "#ffffff" }}>Submitting...</span>
//                   </>
//                 ) : (
//                   <span style={{ color: "#ffffff", fontWeight: 600 }}>
//                     Submit
//                   </span>
//                 )}
//               </button>
//             </div>
//           </form>
//         )}

//         {/* 4. Rounded Gray Info Box matching screenshot */}
//         <div className="mt-8 bg-[#ececec] rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center space-y-2.5">
//           {/* Email */}
//           <div className="flex items-center justify-center gap-2 text-stone-800 text-sm sm:text-[15px]">
//             <Mail className="w-4 h-4 text-stone-700 flex-shrink-0" />
//             <span>
//               <strong>Email:</strong>{" "}
//               <a
//                 href="mailto:contact@nilkanthstore.com"
//                 className="text-[#2563eb] hover:underline"
//               >
//                 contact@nilkanthstore.com
//               </a>
//             </span>
//           </div>

//           {/* Phone */}
//           <div className="flex items-center justify-center gap-2 text-stone-800 text-sm sm:text-[15px]">
//             <Phone className="w-4 h-4 text-stone-700 flex-shrink-0" />
//             <span>
//               <strong>Phone:</strong>{" "}
//               <a
//                 href="tel:+918866794111"
//                 className="text-[#2563eb] hover:underline"
//               >
//                 +91 88667 94111
//               </a>
//             </span>
//           </div>

//           {/* Time */}
//           <div className="text-stone-700 text-sm sm:text-[15px] pt-0.5">
//             <strong>Time:</strong> 8:30 to 6:00
//           </div>
//         </div>
//       </section>

//       {/* 5. Google Maps Location Section - Edge-to-Edge Responsive Full Width */}
//       <section className="w-full mt-10 sm:mt-14 pb-0">
//         <div className="w-full h-[520px] sm:h-[620px] md:h-[700px] lg:h-[780px] relative overflow-hidden bg-[#e5e3df] border-t border-stone-200">
//           <iframe
//             title="Shri Nilkanth Store Location - NiketanDham Rd, Poicha, Rajpipla"
//             src="https://maps.google.com/maps?q=21.96998,73.467531+(Nilkanth+Store)&hl=en&z=15&output=embed"
//             className="w-full h-full border-0 block"
//             style={{ width: "100%", height: "100%", minHeight: "450px" }}
//             allowFullScreen=""
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//           />

//           {/* Top-Left 'Open in Maps' Floating Button matching screenshot */}
//           <div className="absolute top-4 left-4 z-20">
//             <a
//               href="https://www.google.com/maps/search/Nilkanth+Store+NiketanDham+Rd+Poicha+Rajpipla/@21.96998,73.467531,3385m/data=!3m1!1e3?hl=en-US&entry=ttu"
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex items-center gap-1.5 bg-white text-[#1a73e8] hover:text-[#174ea6] font-medium text-xs sm:text-[13px] px-3.5 py-2 rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.25)] border border-stone-200/90 transition-all hover:bg-stone-50"
//             >
//               <span>Open in Maps</span>
//               <svg
//                 className="w-3.5 h-3.5 stroke-current stroke-[2.2] fill-none"
//                 viewBox="0 0 24 24"
//               >
//                 <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
//                 <polyline points="15 3 21 3 21 9"></polyline>
//                 <line x1="10" y1="14" x2="21" y2="3"></line>
//               </svg>
//             </a>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
