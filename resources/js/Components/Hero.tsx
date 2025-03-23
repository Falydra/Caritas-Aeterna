import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-scroll';
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";

export default function Hero() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex w-full h-screen overflow-y-auto items-center justify-center bg-cover bg-center bg-[url('/images/Charity.jpeg')]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-bg to-primary-bg/30"></div>
      <div className="relative flex flex-col items-start w-full justify-center px-4 mt-8">
        <h1 className="text-4xl font-bold text-primary-fg">Caritas Aeterna</h1>
        <p className="text-primary-fg font-thin">
          Your Generosity Can Change the World - Make a Difference Today by Donating <br />
          Securely and Easily, Helping Those in Need, and Creating a Brighter Future for All.
        </p>
        <Link to='charity' smooth>
          Charity
        </Link>
       
        <div className="relative mt-4" ref={dropdownContainerRef}>
          <Button
            variant="outline"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 text-white rounded focus:outline-none"
          >
            Layanan
            {dropdownOpen ? <FaChevronUp className="inline ml-2" /> : <FaChevronDown className="inline ml-2" />}

          </Button>
       
          <div
            className={`absolute transition-all duration-200 ease-in-out mt-2 w-48 rounded shadow-lg border border-primary-fg bg-primary-fg/25 backdrop-blur-xl text-primary-fg
              ${dropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
            `}
          >
            <div className="py-1">
              <Link to="charity" smooth delay={200} className="block px-4 py-2 text-sm hover:bg-primary-accent cursor-pointer">
                Penggalangan Dana
              </Link>
              <Link to="news" smooth delay={200} className="block px-4 py-2 text-sm hover:bg-primary-accent cursor-pointer">
                Program Donasi 
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
