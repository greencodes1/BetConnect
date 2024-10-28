'use client';
import React from 'react';
import { ReactSVG } from 'react-svg';
// import { useNavigate } from "react-router-dom";

const Hero = () => {
  //const navigate = useNavigate()
  return (
    <>
 <section
  className="hidden md:block text-white py-20 px-8 flex flex-col items-center"
  style={{ background: "#14051E" }}
>
  <p
    className="text-lg flex justify-center items-center"
    style={{
      background: "linear-gradient(to right, #351A88, #FF6654)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      fontSize: 50,
      fontWeight: 800,
      textAlign: "center",
      height: 120,
      lineHeight: 1.2

    }}
  >
    Put Your Money Where Your Mouth Is!!!
  </p>
  <div
    className="flex flex-wrap justify-center items-center w-full gap-18 mt-0"
  >
    <div className="flex items-center justify-center">
      <ReactSVG 
        src="/assets/image2.svg"
        beforeInjection={(svg) => {
          svg.setAttribute('style', 'width: 100%; height: auto;');
        }} 
      />
    </div>
  </div>
</section>


{/* <div className="block md:hidden relative w-full h-full"> */}
<section className="block md:hidden text-white bg-darkBlue py-20 px-8" style={{ background: "#14051E",}}>
<p
    className="text-lg flex justify-center items-center"
    style={{
      background: "linear-gradient(to right, #351A88, #FF6654)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      fontSize: 25,
      fontWeight: 800,
      textAlign: "center",
      height: 120,
      lineHeight: 1.2

    }}
  >
    Put Your Money Where Your Mouth Is !!!
  </p>
  <div
    className="flex flex-wrap justify-center items-center w-full gap-18 mt-0"
  >
    <div className="flex items-center justify-center">
      <ReactSVG 
        src="/assets/image1.svg"
        beforeInjection={(svg) => {
          svg.setAttribute('style', 'width: 100%; height: auto;');
        }} 
      />
    </div>
  </div>
      
  </section>

</>
  
  );
};

export default Hero;
