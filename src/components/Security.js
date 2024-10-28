
import React from 'react';
import { ReactSVG } from 'react-svg';
//import { useNavigate } from "react-router-dom";

const Security = () => {
  //const navigate = useNavigate()
  return (
    <>
    <section className="hidden md:block text-white  py-20 px-8" style={{ background: "#14051E",}}>
    <div
  className="flex flex-wrap justify-center items-center w-full gap-28"
  style={{ marginLeft: 0 }}
>
  <div
    className="flex flex-col text-center" // Changed to text-center to center-align the text
    style={{ flexGrow: 1, minWidth: "300px" }}
  >
    <p
      className="text-lg mb-8"
      style={{
        width: "100%", // Use 100% to ensure responsiveness
        maxWidth: "600px", // Set a max width for better layout
        fontSize: 55,
        fontWeight: 600,
        lineHeight: 1.1,
        margin: "0 auto" // Center the text block
      }}
    >
      Our platform was built to <span
        className="text-lg"
        style={{
          background: "linear-gradient(to right, #351A88, #FF6654)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          fontSize: 50,
          fontWeight: 800,
        }}
      >
        Secure
      </span> and <span
        className="text-lg"
        style={{
          background: "linear-gradient(to right, #351A88, #FF6654)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          fontSize: 50,
          fontWeight: 800,
        }}
      >
        Protect
      </span> your funds
    </p>

    <p
      className="text-lg mb-4 "
      style={{
        width: "100%", // Use 100% to ensure responsiveness
        maxWidth: "600px", // Set a max width for better layout
        fontSize: 20,
        fontWeight: 200,
        lineHeight: 1.4,
        color: "#A5A3A8",
        marginTop: 40,
        margin: "0 auto" // Center the text block
      }}
    >
      We chose Near for its scalability, low fees, and fast transactions, making it ideal for decentralized apps and smart contracts. Its strong community and ongoing innovation ensure reliability and growth.
    </p>
  </div>

  <div className="flex items-center justify-center">
    <ReactSVG src="/assets/Img.svg" />
  </div>
</div>



    

      
  </section>


<section className="block md:hidden text-white bg-darkBlue py-20 px-8" style={{ background: "#14051E",}}>
<div
  className="flex flex-wrap  justify-center items-center w-full gap-18"
  style={{ marginLeft: 0 }}
>
  <div
  className="flex flex-col text-left justify-center items-center" // Removed items-center
  style={{ flexGrow: 1, minWidth: "300px",  }}
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
   Our platform was built to <span
      className="text-lg"
      style={{
        background: "linear-gradient(to right, #351A88, #FF6654)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: 25,
        fontWeight: 800,
      }}
    >
       Secure
    </span> and <span
      className="text-lg"
      style={{
        background: "linear-gradient(to right, #351A88, #FF6654)",
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontSize: 25,
        fontWeight: 800,
      }}
    >
      Protect
    </span> your funds
  </p>

  <p
    className="text-lg mb-4"
    style={{
      width: 290,
      fontSize: 14,
      fontWeight: 200,
      lineHeight: 1.4,
      color : "#A5A3A8",
      textAlign: "center"
    }}
  >
We chose Near for its scalability, low fees, and fast transactions, making it ideal for decentralized apps and smart contracts. Its strong community and ongoing innovation ensure reliability and growth
  </p>

</div>
  <div className="flex items-center justify-end" style={{}}>
  

    {/* <ReactSVG src="/assets/Img.svg" beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 240px; height: auto;');
      }} /> */}
  </div>
</div>

      
  </section>

</>
  
  );
};

export default Security;
