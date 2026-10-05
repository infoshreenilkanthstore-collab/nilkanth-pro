import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-36 md:bottom-8 right-4 md:right-6 z-50 flex flex-col gap-3">
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 md:w-12 md:h-12 bg-white text-[#700b10] border border-stone-200 rounded-full shadow-lg flex items-center justify-center hover:bg-[#700b10] hover:text-white transition-all transform hover:scale-105"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      <a
        href="https://wa.me/919726778118?text=Welcome%20to%20Shri%20Nilkanth%20Store%2C%20How%20can%20I%20help%20you%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 md:w-12 md:h-12 bg-[#25D366] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#128C7E] transition-all transform hover:scale-105"
        aria-label="WhatsApp Support"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 fill-white" viewBox="0 0 24 24">
          <path d="M12.031 0C5.397 0 .001 5.397.001 12.032c0 2.118.552 4.184 1.6 6l-1.7 6.208 6.35-1.666a12.002 12.002 0 0 0 5.78 1.488h.005c6.633 0 12.03-5.397 12.03-12.032C24.066 5.397 18.667 0 12.031 0zm0 22.062a9.99 9.99 0 0 1-5.093-1.393l-.365-.217-3.779.991 1.008-3.684-.237-.378a9.99 9.99 0 1 1 8.466 4.681zm5.474-7.48c-.3-.15-1.774-.875-2.049-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.489-.893-.796-1.495-1.78-1.67-2.08-.175-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.585-.492-.505-.675-.515-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.895 1.225 3.095c.15.2 2.115 3.23 5.125 4.53.716.31 1.275.495 1.71.634.719.229 1.373.197 1.89.12.577-.087 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
        </svg>
      </a>
    </div>
  );
}
