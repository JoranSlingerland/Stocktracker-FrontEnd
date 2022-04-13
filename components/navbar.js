import { useState } from 'react';
import Link from 'next/link';

function NavLink({ to, children }) {
  return (
    <a href={to} className={`mx-4`}>
      {children}
    </a>
  );
}

function MobileNav({ open, setOpen }) {
  return (
    <div
      className={`absolute top-0 left-0 h-screen w-screen bg-white transform ${
        open ? '-translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out filter drop-shadow-md `}
    >
      <div className="flex items-center justify-center h-20 bg-white filter drop-shadow-md">
        {' '}
        {/*logo container*/}
        <Link href="/" className="text-xl font-semibold">
          <a>HOME</a>
        </Link>
      </div>
      <div className="flex flex-col ml-4">
        <a
          className="my-4 text-xl font-medium"
          href="/about"
          onClick={() =>
            setTimeout(() => {
              setOpen(!open);
            }, 100)
          }
        >
          About
        </a>
        <a
          className="my-4 text-xl font-normal"
          href="/contact"
          onClick={() =>
            setTimeout(() => {
              setOpen(!open);
            }, 100)
          }
        >
          Contact
        </a>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="flex items-center h-20 px-4 py-4 bg-white filter drop-shadow-md">
      <MobileNav open={open} setOpen={setOpen} />
      <div className="flex items-center w-3/12">
        <Link href="/" className="text-xl font-semibold">
        <a>Home</a>
        </Link>
      </div>
      <div className="flex items-center justify-end w-9/12">
        <div
          className="relative z-50 flex flex-col items-center justify-between w-8 h-8 md:hidden"
          onClick={() => {
            setOpen(!open);
          }}
        >
          {/* hamburger button */}
          <span
            className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${
              open ? 'rotate-45 translate-y-3.5' : ''
            }`}
          />
          <span
            className={`h-1 w-full bg-black rounded-lg transition-all duration-300 ease-in-out ${
              open ? 'w-0' : 'w-full'
            }`}
          />
          <span
            className={`h-1 w-full bg-black rounded-lg transform transition duration-300 ease-in-out ${
              open ? '-rotate-45 -translate-y-3.5' : ''
            }`}
          />
        </div>

        <div className="hidden md:flex">
          <NavLink to="/portfolio">portfolio</NavLink>
          <NavLink to="/performance">Performance</NavLink>
          <NavLink to="/actions">Actions</NavLink>
        </div>
      </div>
    </nav>
  );
}
