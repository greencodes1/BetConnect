"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback,useContext } from "react";

import Link from 'next/link';
import { ReactSVG } from "react-svg";
import { NearContext } from '../wallets/near'


const Header = ({ page }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [modalIsOpen, setModalIsOpen] = useState(false);
 const [connected2, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [availableWallets, setAvailableWallets] = useState("");
  const menuRef = useRef(null);


  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Disconnect ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel('Connect wallet');
    }
  }, [signedAccountId, wallet]);





  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleNavClick = (path) => {
    setActiveLink(path);
    setMenuOpen(false);
  };

  const linkStyle = (path) => (path === activeLink ? "text-orange-500" : "hover:text-orange-500");

  // Load connection state from localStorage on initial render
  useEffect(() => {
    const storedConnected = localStorage.getItem("connected") === "true";
    const storedWalletAddress = localStorage.getItem("walletAddress");

    if (storedConnected && storedWalletAddress) {
      setConnected(true);
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  return (
    <header className="py-6 px-8  text-white" style={{ background: "#14051E",}}>
    <div className="hidden md:block flex justify-between items-center relative">
        <ReactSVG
          src="/assets/logo1.svg"
          beforeInjection={(svg) => {
            svg.setAttribute("style", "width: 70px; height: auto;");
          }}
        />

         <div className="flex justify-end" style={{marginTop:-40}}>
             
             <nav className="space-x-10 z-10">
               <Link
                 href="/"
                // className={page === "home" ? "text-orange-500" : "hover:text-orange-500"}
                 onClick={() => handleNavClick("/")}
                 style={{color: page === "home" ? "#907DB3" : "white"}}
               >
                 Home
               </Link>
               <Link
                 href="/wager"
                // className={page === "product" ? "text-orange-500" : "hover:text-orange-500"}
                 onClick={() => {handleNavClick("/wager")}}
                 style={{color: page === "wager" ? "#907DB3" : "white"}}
               >
                 Wagers
               </Link>


               <Link
                 href="/leader"
                // className={page === "upload" ? "text-orange-500" : "hover:text-orange-500"}
                 onClick={() => handleNavClick("/leader")}
                 style={{color: page === "leader" ? "#907DB3" : "white"}}
               >
                 Leaderboard
               </Link>
               {/* <button
               onClick={() => {
                 setModalIsOpen(true);

               }}
               className=" text-white px-4 py-2 rounded-lg  focus:outline-none"
               style={{ background: "linear-gradient(to right, #1A61ED, #11BAE3)",}}
             >
               {connected ? "Disconnect Wallet" : "Connect Wallet"}
             </button> */}
             </nav>
             
           </div>
      </div>
        
      {isMobile && (
  <>
    <div className="flex flex-row justify-between" ref={menuRef}>
      <ReactSVG
        src="/assets/logo1.svg"
        beforeInjection={(svg) => {
          svg.setAttribute("style", "width: 50px; height: auto;");
        }}
      />
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-3xl focus:outline-none flex justify-end mt-4"
      >
       <ReactSVG
        src="/assets/bar.svg"
        beforeInjection={(svg) => {
          svg.setAttribute("style", "width: 25px; height: auto;");
        }}
      />
      </button>
    </div>

    {/* Overlay */}
    {menuOpen && (
      <div
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
      ></div>
    )}

    {/* Sliding Nav Menu */}
    <nav
      style={{
        background: "#14051E",
        transition: "transform 0.3s ease-in-out",
        transform: menuOpen ? "translateX(0)" : "translateX(100%)", // Sliding in and out
        width: "60vw", // 60% of the screen width
        height: "100vh", // Full viewport height
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 50,
        overflowY: "auto",
      }}
      className="py-2 text-white shadow-lg"
      ref={menuRef}
    >
      {/* Close (X) Button */}
      <div className="flex justify-end px-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl focus:outline-none"
        >
          &#10005; 
        </button>
      </div>

      {/* Links */}
      <Link
        href="/"
        className={`block px-4 py-2 ${linkStyle("/")} flex justify-center mt-10 mb-2`}
        onClick={() => { handleNavClick("/"); setMenuOpen(false); }}
        style={{ color: page === "home" ? "#907DB3" : "white", fontSize:page === "home" ? 20 :16 }}
      >
        Home
      </Link>
      <Link
        href="/wager"
        className={`block px-4 py-2 ${linkStyle("/wager")} flex justify-center mb-2`}
        onClick={() => { handleNavClick("/wager"); setMenuOpen(false); }}
        style={{ color: page === "wager" ? "#907DB3" : "white", fontSize:page === "wager" ? 20 :16 }}
      >
        Wagers
      </Link>
      <Link
        href="/leader"
        className={`block px-4 py-2 ${linkStyle("/leader")} flex justify-center`}
        onClick={() => { handleNavClick("/leader");setMenuOpen(false); }}
        style={{ color: page === "leader" ? "#907DB3" : "white", fontSize:page === "leader" ? 20 :16  }}
      >
        Leaderboard
      </Link>
    </nav>
  </>
)}

    </header>
  );
};

export default Header;



