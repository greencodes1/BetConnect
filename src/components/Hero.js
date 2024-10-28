'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback,useContext } from "react";
import { ReactSVG } from 'react-svg';
import { useRouter } from 'next/navigation';
import { HelloNearContract } from '../config';
import { NearContext } from '../wallets/near';

import Modal from "react-modal";

const Hero = () => {
  const navigate = useRouter()

  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [availableWallets, setAvailableWallets] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
const [isMobile, setIsMobile] = useState(false);


const { signedAccountId, wallet } = useContext(NearContext);
const [action, setAction] = useState(() => { });
const [label, setLabel] = useState('Loading...');

useEffect(() => {
  if (!wallet) return;

  if (signedAccountId) {
    setAction(() => wallet.signOut);
    setLabel(`Disconnect ${signedAccountId}`);
    setConnected(true)
  } else {
    setAction(() => wallet.signIn);
    setLabel('Connect wallet');
    setConnected(false)
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



  
  
  return (
    <>
    <section className="hidden md:block text-white  py-20 px-8" style={{ background: "#14051E",}}>
    <div
  className="flex flex-wrap  justify-center items-center w-full gap-18"
  style={{ marginLeft: 0 }}
>
  <div
  className="flex flex-col text-left" // Removed items-center
  style={{ flexGrow: 1, minWidth: "300px", marginLeft: 100 }}
>
  <p
    className="text-lg mb-8"
    style={{
      width: 600,
      fontSize: 55,
      fontWeight: 600,
      lineHeight: 1.1,
    }}
  >
    The Best On-Chain Social betting Platform on{" "}
    <span
      className="text-lg"
      style={{
        background: "linear-gradient(to right, #351A88, #FF6654)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: 50,
        fontWeight: 800,
      }}
    >
      Near
    </span>
  </p>

  <p
    className="text-lg mb-4"
    style={{
      width: 600,
      fontSize: 20,
      fontWeight: 200,
      lineHeight: 1.4,
      color : "#A5A3A8"
    }}
  >
Challenge your friends, make friendly bets, and enjoy a great time together!
  </p>
  <span
      className="text-lg mb-4"
      style={{
        background: "linear-gradient(to bottom, #FF6654, #351A88)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: 17,
        fontWeight: 800,
      }}
    >
      Powered by
    </span>


      <div className="flex flex-wrap  space-x-6 mb-8">
  <div style={{ marginTop: 0, }}>
    <ReactSVG 
      src="/assets/google_cloud.svg"  
      beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 120px; height: auto;');
      }} 
    />
  </div>
 
  <div style={{ marginTop: -10,  }}>
    <ReactSVG 
      src="/assets/logo_rev.svg"   
      beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 100px; height: auto;');
      }} 
    />
  </div>
  <div style={{ marginTop: -10, }}>
    <ReactSVG 
      src="/assets/vottun.svg"  
      beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 100px; height: auto;');
      }} 
    />
  </div>
  
  
</div> 

 
    <button  className="text-white py-3 px-6 rounded-lg text-lg font-medium self-start" // Added self-start
    style={{
      borderRadius: 10,
      fontSize: 14,
      background: "linear-gradient(to right, #351A88, #FF6654)",
    }} onClick={action} > {label} </button>
</div>
  <div className="flex items-center justify-end" style={{}}>
    <ReactSVG src="/assets/tronlogo.svg" />
  </div>
</div>


    

      
  </section>

<section className="block md:hidden text-white bg-darkBlue py-20 px-8" style={{ background: "#14051E",}}>
<div
  className="flex flex-wrap  justify-center items-center w-full gap-28"
  style={{ marginLeft: 0 }}
>
  <div
  className="flex flex-col text-left justify-center items-center" // Removed items-center
  style={{ flexGrow: 1, minWidth: "300px" }}
>
  <p
    className="text-lg mb-4"
    style={{
      width: 290,
      fontSize: 25,
      fontWeight: 600,
      lineHeight: 1.1,
      textAlign: "center"
    }}
  >
    The Best On-Chain Social betting Platform on{" "}
    <span
      className="text-lg"
      style={{
        background: "linear-gradient(to right, #351A88, #FF6654)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: 25,
        fontWeight: 800,
      }}
    >
      Near
    </span>
  </p>

  <p
    className="text-lg mb-4"
    style={{
      width: 280,
      fontSize: 16,
      fontWeight: 200,
      lineHeight: 1.4,
      color : "#A5A3A8",
      textAlign: "center"
    }}
  >
Challenge your friends, make friendly bets, and enjoy a great time together!
  </p>
  <span
      className="text-lg mb-4"
      style={{
        background: "linear-gradient(to bottom, #FF6654, #351A88)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: 14,
        fontWeight: 800,
      }}
    >
      Powered by
    </span>


      <div className="flex flex-wrap  space-x-6 mb-8">
  <div style={{ marginTop: 0, }}>
    <ReactSVG 
      src="/assets/google_cloud.svg"  
      beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 90px; height: auto;');
      }} 
    />
  </div>
 
  <div style={{ marginTop: -5,  }}>
    <ReactSVG 
      src="/assets/logo_rev.svg"   
      beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 70px; height: auto;');
      }} 
    />
  </div>
  <div style={{ marginTop: -8, }}>
    <ReactSVG 
      src="/assets/vottun.svg"  
      beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 70px; height: auto;');
      }} 
    />
  </div>
  
  
</div> 


      <button   
    className="text-white py-1 px-4 rounded-lg text-lg font-medium " 
    style={{
      borderRadius: 50,
      fontSize: 12,
      background: "linear-gradient(to right, #351A88, #FF6654)",
    }} onClick={action}> {label} </button>
</div>
  <div className="flex items-center justify-end" style={{}}>
   

    <ReactSVG src="/assets/tronlogo.svg" beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 290px; height: auto;');
      }} />
  </div>
</div>

      
  </section>


</>
  
  );
};

export default Hero;
