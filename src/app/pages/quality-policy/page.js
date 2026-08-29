import React from 'react';

export default function QualityPolicy() {
    return (
        <div className="max-w-5xl mx-auto py-24 px-6 min-h-[60vh]">
            <h1 className="text-3xl md:text-5xl font-nunito font-bold mb-10 text-[#700b10] border-b border-yellow-100 pb-6 uppercase">
                Quality Policy - Our Promise
            </h1>

            <div className="prose prose-lg max-w-none font-nunito text-gray-800 leading-relaxed
                prose-headings:text-[#700b10] prose-headings:font-nunito
                prose-strong:text-[#700b10] prose-strong:font-bold">
                
                <p className="text-xl font-medium text-[#700b10] mb-8 italic">
                    At Nilkanth Store, purity, quality, and devotion are the cornerstones of everything we do.
                </p>

                <p>
                    We take great pride in working only with supply chains that reflect our values — where only the finest ingredients and the highest standards are accepted. From the moment our raw materials are sourced to the time our prasadam reaches your hands, every step is guided by care, tradition, and integrity.
                </p>

                <h2 className="text-2xl mt-12 mb-6">Ever wondered how your favorite Nilkanth Store reaches you and your loved ones?</h2>

                <ul className="space-y-6 list-none p-0">
                    <li className="flex gap-4 items-start bg-yellow-50/30 p-6 rounded-2xl border border-yellow-100/50">
                        <span className="w-3 h-3 bg-[#700b10] rounded-full mt-2.5 shrink-0" />
                        <p className="m-0">
                            <strong>Source of Devotion:</strong> It all begins at the source — with ethically and responsibly sourced raw ingredients from trusted local farms across India. These are selected with devotion and processed minimally to preserve their natural essence, staying true to our time-honored recipes.
                        </p>
                    </li>

                    <li className="flex gap-4 items-start bg-yellow-50/30 p-6 rounded-2xl border border-yellow-100/50">
                        <span className="w-3 h-3 bg-[#700b10] rounded-full mt-2.5 shrink-0" />
                        <p className="m-0">
                            <strong>Hygienic Craftsmanship:</strong> Inside our production units, the ingredients are blended with freshly ground spices using advanced, hygienic technology. Our experienced staff ensures that each step is carefully monitored, maintaining sanctity and taste throughout.
                        </p>
                    </li>

                    <li className="flex gap-4 items-start bg-yellow-50/30 p-6 rounded-2xl border border-yellow-100/50">
                        <span className="w-3 h-3 bg-[#700b10] rounded-full mt-2.5 shrink-0" />
                        <p className="m-0">
                            <strong>Uncompromising Standards:</strong> Before anything leaves our hands, it undergoes multiple quality checks to ensure every batch meets our uncompromising standards. Only the prasadam that lives up to our promise of excellence moves forward.
                        </p>
                    </li>

                    <li className="flex gap-4 items-start bg-yellow-50/30 p-6 rounded-2xl border border-yellow-100/50">
                        <span className="w-3 h-3 bg-[#700b10] rounded-full mt-2.5 shrink-0" />
                        <p className="m-0">
                            <strong>Delivered with Care:</strong> Once approved, the final product is packaged with love and care — then distributed through our trusted network, ready to be delivered to your nearest store or directly to your doorstep.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
