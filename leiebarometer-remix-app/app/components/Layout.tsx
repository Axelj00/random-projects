// app/components/Layout.tsx
import React, { useState } from "react";
import { Link } from "@remix-run/react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Property Finder
          </Link>
          <nav>
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <ul
              className={`md:flex md:space-x-4 ${
                isMobileMenuOpen ? "block" : "hidden"
              }`}
            >
              <li className="mt-2 md:mt-0">
                <Link
                  to="/"
                  className="block px-2 py-1 rounded hover:bg-primary-light"
                >
                  Home
                </Link>
              </li>
              <li className="mt-2 md:mt-0">
                <Link
                  to="/about"
                  className="block px-2 py-1 rounded hover:bg-primary-light"
                >
                  About
                </Link>
              </li>
              <li className="mt-2 md:mt-0">
                <Link
                  to="/contact"
                  className="block px-2 py-1 rounded hover:bg-primary-light"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6 container mx-auto">{children}</main>
      <footer className="bg-neutral-dark text-white p-4 text-center">
        © {new Date().getFullYear()} Property Finder. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
