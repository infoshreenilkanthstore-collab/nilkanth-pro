import React from 'react';

export default function ReturnRefundPolicy() {
    return (
        <div className="max-w-5xl mx-auto py-24 px-6 min-h-[60vh]">
            <h1 className="text-3xl md:text-5xl font-nunito font-bold mb-6 text-[#700b10] border-b border-yellow-100 pb-6 uppercase">
                Return & Refund Policy
            </h1>
            
            <p className="text-gray-600 mb-10 font-nunito">Effective Date: [01/02/2024]</p>

            <div className="prose prose-lg max-w-none font-nunito text-gray-800 leading-relaxed
                prose-headings:text-[#700b10] prose-headings:font-nunito prose-headings:mt-12 prose-headings:mb-6
                prose-strong:text-[#700b10] prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2">
                
                <p>
                    At Nilkanth Store, we value our customers and aim to ensure your satisfaction with every purchase. If for any reason you are not completely satisfied with your purchase, we offer a straightforward return policy to make the process as simple as possible. Please carefully review the following guidelines regarding returns:
                </p>

                <h2>Eligibility for Returns:</h2>
                <p>To qualify for a return, please ensure the following conditions are met:</p>
                <ul>
                    <li>The item must be in its original packaging.</li>
                    <li>The item must be unused and in the same condition as received.</li>
                    <li>You must initiate the return process within 1 day from the date of delivery.</li>
                </ul>

                <h2>Non-Returnable Items:</h2>
                <p>Certain items are not eligible for return. These include:</p>
                <ul>
                    <li>Items marked as final sale or clearance.</li>
                    <li>Customized or personalized items.</li>
                    <li>Items damaged due to misuse, accidents, or neglect.</li>
                </ul>

                <h2>Return Process:</h2>
                <p>To start a return, please follow these steps:</p>
                <ul>
                    <li>Contact our customer support team at <strong>contact@nilkanthstore.com</strong> to inform us of your intention to return.</li>
                    <li>Provide your order number, details of the item(s) you wish to return, and the reason for the return.</li>
                    <li>Our customer support team will guide you through the return process and issue a return authorization if your return is eligible.</li>
                </ul>

                <h2>Return Shipping:</h2>
                <p>
                    Customers are responsible for the cost of return shipping unless the return is due to an error on our part or a defective product. For your protection, we recommend using a trackable shipping service when returning items.
                </p>

                <h2>Refund Process:</h2>
                <p>
                    Once we receive the returned item and confirm its eligibility, we will process your refund. Refunds will be issued to the original payment method used for the purchase.
                </p>

                <h2>Refund Timeframe:</h2>
                <p>
                    Please allow up to 7 business days for the refund to be processed and reflected in your account. The exact timeframe may vary depending on your payment provider.
                </p>

                <h2>Damaged or Defective Items:</h2>
                <p>
                    If you receive a damaged or defective item, please contact our customer support team immediately for assistance. We will arrange for a replacement or issue a refund, depending on the circumstances.
                </p>

                <h2>Exchange Policy:</h2>
                <p>
                    Currently, Nilkanth Store does not offer exchanges. If you require a different item, color, or size, please initiate a return for the unwanted item and place a new order for the desired item.
                </p>

                <h2>Contact Information:</h2>
                <p>
                    If you have any questions or concerns regarding our Return Policy, please do not hesitate to contact our customer support team at:
                </p>
                <ul className="list-none pl-0">
                    <li><strong>Email:</strong> contact@nilkanthstore.com</li>
                    <li><strong>Phone:</strong> +91 8866794111</li>
                </ul>

                <h2>Changes to Return Policy:</h2>
                <p>
                    Nilkanth Store reserves the right to update or modify this Return Policy as needed. Any changes will be effective immediately upon posting on our website.
                </p>

                <p className="mt-12 font-bold text-[#700b10]">
                    Thank you for choosing Nilkanth Store. We appreciate your business and strive to provide a hassle-free shopping experience for all our customers.
                </p>
            </div>
        </div>
    );
}
