'use client';
import React from 'react';
import { ReactSVG } from 'react-svg';
//import { useNavigate } from "react-router-dom";

const Footer = () => {
 // const navigate = useNavigate()
  return (
    <>
<section 
  style={{ 
    // background: "linear-gradient(to bottom, #091729, #091729)",
    background: "#14051E",
   
  }} 
  className="hidden md:block text-white py-20 px-0"
>
  <div className="flex flex-col justify-center items-center" style={{ background: "#14051E",}}>
    <div className="flex flex-col items-center" style={{ marginBottom: 0}}>
      <ReactSVG 
        src="/assets/logo1.svg"  
        beforeInjection={(svg) => {
          svg.setAttribute('style', 'width: 150px; height: auto;');
        }} 
      />
      <p className="text-lg mb-8 mt-3" style={{
        // background: "linear-gradient(to right, #1A61ED, #11BAE3)",
        // WebkitBackgroundClip: "text",
        color: "#907DB3",
        fontSize: 25, 
        fontFamily: "Poppins", 
        fontWeight: 900, 
        lineHeight: 1.3,
        textAlign: "center" // Center-align text
      }}>
        Betconnect
      </p>
      <div className="flex flex-row items-center gap-12 mb-5">
        <a href="/" className="text-lg mb-2" style={{ fontSize: 19, fontFamily: "Poppins" ,color: "#907DB3",}}>
          Home
        </a>
        <a href="/wagers" className="text-lg mb-2" style={{ fontSize: 19, fontFamily: "Poppins",color: "#907DB3", }}>
          Wagers
        </a>
        <a href="/leader" className="text-lg mb-2" style={{ fontSize: 19, fontFamily: "Poppins" , color: "#907DB3",}}>
          Leaderboard
        </a>
        {/* <a href="/upload" className="text-lg mb-2" style={{ fontSize: 19, fontFamily: "Poppins",color: "#907DB3", }}>
          Upload
        </a> */}
      </div>

      <p 
  className="text-lg mb-2" 
  style={{ 
    fontSize: 17, 
    fontFamily: "Poppins", 
    maxWidth: 700,  // Use maxWidth for better responsiveness
    lineHeight: 1.6,
    textAlign: "center",
    background: "linear-gradient(to bottom, #351A88, #FF6654)",
    WebkitBackgroundClip: "text",
    color: "transparent", // Add this to make the gradient text visible
    margin: "0 auto", // Center the paragraph block
  }}
>
  Join Betconnect, the ultimate platform for secure and fast betting with friends and family. Experience a community-driven environment with low fees, rapid transactions, and reliable support. Get in on the action and become a part of Betconnect today!
</p>

    </div>

  </div>
</section>



{/* <div className="block md:hidden relative w-full h-full"> */}
<section 
  style={{ 
    background: "#14051E",
  }} 
  className="block md:hidden text-white py-20 px-0" // Removed px-8 to avoid reducing the width
>
<div className="flex flex-col justify-center items-center" style={{ background: "#14051E",}}>
    <div className="flex flex-col items-center" style={{ marginBottom: 0}}>
      <ReactSVG 
        src="/assets/logo1.svg"  
        beforeInjection={(svg) => {
          svg.setAttribute('style', 'width: 100px; height: auto;');
        }} 
      />
      <p className="text-lg mb-8 mt-3" style={{
        // background: "linear-gradient(to right, #1A61ED, #11BAE3)",
        // WebkitBackgroundClip: "text",
        color: "#907DB3",
        fontSize: 20, 
        fontFamily: "Poppins", 
        fontWeight: 900, 
        lineHeight: 1.3,
        textAlign: "center" // Center-align text
      }}>
        Betconnect
      </p>
      <div className="flex flex-row items-center gap-5 mb-5">
        <a href="/" className="text-lg mb-2" style={{ fontSize: 14, fontFamily: "Poppins" ,color: "#907DB3",}}>
          Home
        </a>
        <a href="/wagers" className="text-lg mb-2" style={{ fontSize: 14, fontFamily: "Poppins",color: "#907DB3", }}>
          Wagers
        </a>
        <a href="/leader" className="text-lg mb-2" style={{ fontSize: 14, fontFamily: "Poppins" , color: "#907DB3",}}>
          Leaderboard
        </a>
       
      </div>

      <p 
  className="text-lg mb-2" 
  style={{ 
    fontSize: 14, 
    fontFamily: "Poppins", 
    maxWidth: 280,  // Use maxWidth for better responsiveness
    lineHeight: 1.6,
    textAlign: "center",
    background: "linear-gradient(to bottom, #351A88, #FF6654)",
    WebkitBackgroundClip: "text",
    color: "transparent", // Add this to make the gradient text visible
    margin: "0 auto", // Center the paragraph block
  }}
>
  Join Betconnect, the ultimate platform for secure and fast betting with friends and family. Experience a community-driven environment with low fees, rapid transactions, and reliable support. Get in on the action and become a part of Betconnect today!
</p>

    </div>

  </div>

</section>

</>
  
  );
};

export default Footer;
