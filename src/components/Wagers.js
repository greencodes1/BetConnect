"use client";

import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { ReactSVG } from 'react-svg';
import { utils } from "near-api-js";

import Modal from "react-modal";

import { ColorRing } from 'react-loader-spinner'
import { useRouter } from 'next/navigation';
import { HelloNearContract } from '../config';
import { NearContext } from '../wallets/near';
const Wagers = () => {
  const navigate = useRouter()
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [modalIsOpen4, setModalIsOpen4] = useState(false);
  const [modalIsOpen5, setModalIsOpen5] = useState(false);
  const [modalIsOpen6, setModalIsOpen6] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = ["Player1", "Player2"]
  
  const [amount, setamount] = useState(0);
  const [title, settitle] = useState('');
  const [name, setname] = useState('');
  const [desc, setdesc] = useState('');
  const [BetId, setBetId] = useState('');
  const [post2, setPost2] = useState([]);


  const CONTRACT = HelloNearContract;

  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');
  const [connected, setConnected] = useState(false);







  useEffect(() => {
    const initializeWallet = () => {
      if (!wallet) return;
  
      if (signedAccountId) {
        setAction(() => wallet.signOut);
        setLabel(`Disconnect ${signedAccountId}`);
        setConnected(true);
      } else {
        setAction(() => wallet.signIn);
        setLabel('Connect wallet');
        setConnected(false);
      }
    };
  
    const handleUpload = async () => {
      try {
        let activeBets = [];
        let inactiveBets = [];
  
        if (signedAccountId) {
          const data = await fetchDocuments(signedAccountId);
          if (data?.data) {
            activeBets = data.data.filter((bet) => bet.isActive);
            inactiveBets = data.data.filter((bet) => !bet.isActive);
          }
        }
  
        // Update state
        setPost(activeBets);
        setPost2(inactiveBets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
  
    initializeWallet();
    handleUpload();
  
    // Avoid attaching listeners more than once
    window.addEventListener('load', initializeWallet);
    window.addEventListener('load', handleUpload);
  
    return () => {
      window.removeEventListener('load', initializeWallet);
      window.removeEventListener('load', handleUpload);
    };
  }, [wallet, signedAccountId]);
  

 

  const [walletAddress, setWalletAddress] = useState(null);
  const [availableWallets, setAvailableWallets] = useState("");
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
const [isMobile, setIsMobile] = useState(false);
const [loading, setLoading] = useState(true);
  
  const [post, setPost] = useState([]);


  const createbet = async () => {
 
    try {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
      

        const hash = array[0].toString(36).slice(0, 7);
        setBetId(hash)

     let deposit = utils.format.parseNearAmount(amount.toString());
      const products = await wallet.callMethod({ contractId: CONTRACT, method: 'createBet', args: { betID:hash , title:title, creatorName: name, creatorDesc: desc, amount: deposit  } }) //await contract.createBet(hash,title,name,desc).send({callValue : amount * 1000000});
      const products2 = await wallet.viewMethod({ contractId: CONTRACT, method: 'getBet', args: { betID: hash } }) 


      products2.BetId = hash
    

      await uploadDocuments(hash,products2, products2.creator)
     
      await handleUpload()
  
     await wallet.callMethod({ contractId: CONTRACT, method: 'paycreateBet', args: { betID:hash},deposit })
    setLoading(false)
    setModalIsOpen(true)
    setModalIsOpen5(true)

   

                


    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };



  const acceptbet = async () => {
   
    try {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
      
     
        const hash = array[0].toString(36).slice(0, 7);

       
      const products2 =  await wallet.viewMethod({ contractId: CONTRACT, method: 'getBet', args: { betID: BetId } })  
      const dataaa = products2.amount
      const intAmount = dataaa.toLocaleString('fullwide', { useGrouping: false }) 
      let deposit = utils.format.parseNearAmount(amount.toString());
    

      if (deposit === intAmount.toString()){
      

        const products = await wallet.callMethod({ contractId: CONTRACT, method: 'acceptBet', args: { betID:BetId , acceptorName: name, acceptorDesc: desc, amount: deposit  } }) 
        const products2 = await wallet.viewMethod({ contractId: CONTRACT, method: 'getBet', args: { betID: BetId } })  

       
  


      products2.BetId = BetId
     
       

    
        await uploadDocuments(BetId,products2, products2.creator)
        await uploadDocuments(BetId,products2, products2.acceptor)
        await handleUpload()
    
        await wallet.callMethod({ contractId: CONTRACT, method: 'payacceptBet', args: { betID:BetId},deposit })
        setLoading(false)
        setModalIsOpen(true)
          setModalIsOpen5(true)
      }else{
        setLoading(false)
        alert("Ensure you entered the same amount as the creator\n and you entered all the expected parameter")
      }

                


    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false)
      alert("Ensure you entered the same amount as the creator\n and you entered all the expected parameter")

    }
  };


  const endbet = async () => {
    
    try {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
      const products2 = await wallet.viewMethod({ contractId: CONTRACT, method: 'getBet', args: { betID: BetId } })
      const playerid = selectedCategory === "Player1"?  products2.creator : products2.acceptor
      const products =   await wallet.callMethod({ contractId: CONTRACT, method: 'submitResult', args: { betID: BetId, winnerId:playerid  } })
      const products3 = await wallet.viewMethod({ contractId: CONTRACT, method: 'getBet', args: { betID: BetId } })
    products3.BetId = BetId
   
    
      
      await uploadDocuments(BetId,products3, products3.creator)
      await uploadDocuments(BetId,products3, products3.acceptor)
await handleUpload()


  
     setLoading(false)
setModalIsOpen(true)
  setModalIsOpen5(true)

                


    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  
  async function uploadDocuments(BetID,data, userwallet) {
    try {
      const response = await fetch('https://us-central1-almond-1b205.cloudfunctions.net/tronvoiceapi/BetUploadData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ BetID,data,userwallet}),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const results = await response.json();
     
      return results;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return null;
    }
  }

  async function fetchDocuments(userwallet) {
    try {
      const response = await fetch('https://us-central1-almond-1b205.cloudfunctions.net/tronvoiceapi/BetGetData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userwallet}),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const results = await response.json();
     
      return results;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return null;
    }
  }





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




 


  const handleUpload = async () => {
       
    try {
  
      const data = await fetchDocuments(signedAccountId);
      let activeBets = []
      let inactiveBets = []
if (data.data){
   activeBets = data.data.filter((bet) => bet.isActive);
   inactiveBets = data.data.filter((bet) => !bet.isActive);
}else{
  activeBets = []
  inactiveBets = []
}
     

      // Update state with filtered data
      setPost(activeBets);
      setPost2(inactiveBets);
     
      // setPost(data.data)
     // setLoading(false)
     

    } catch (error) {
      console.error('Error fetchingggg documents:', error);
    }
  };

  return (
    <>
      {loading? <div style={{ background: "#14051E",}} className="flex flex-col items-center justify-center min-h-screen bg-darkBlue text-white">
      <ColorRing
  visible={true}
  height="130"
  width="130"
  ariaLabel="color-ring-loading"
  wrapperStyle={{}}
  wrapperClass="color-ring-wrapper"
  colors={["#351A88", '#FF6654', '#907DB3', '#abbd81', '#849b87']}
  />
  {!wallet ?  <p className="text-md md:text-lg mb-4 mt-10" style={{fontSize: 15}}>Please ensure your wallet is connected.....</p> : <p className="text-md md:text-lg mb-4 mt-10" style={{fontSize: 15}}></p>}
        
    </div> :
    <>
 <section
  className="hidden md:block text-white py-20 px-8 flex flex-col items-center"
  style={{ background: "#14051E" }}
>
    <div className='flex flex-row justify-between mb-8'>
    <p
    className="text-lg flex "
    style={{
      background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.7))",
      WebkitBackgroundClip: "text",
      color: "transparent",
      fontSize: 29,
      fontWeight: 800,

      lineHeight: 1.2

    }}
  >
Live Bets
  </p>
  <div className='flex flex-row'>
  <button
         onClick={() => {
            setModalIsOpen(true)
            setModalIsOpen2(false)
            setModalIsOpen3(true)
            setModalIsOpen4(false)
            setModalIsOpen5(false)
            setModalIsOpen6(false)
 
        }} 
          className="ml-4 text-white rounded-full "
          style={{ background: "linear-gradient(to right, #351A88,rgba(255, 102, 84, 0.7))", height: 50, alignItems: "center", fontSize: 16, width: 130, fontWeight: 700, fontFamily: "Popins" }}
        >
          Create Bets
        </button>
        <button
         onClick={() => {
            setModalIsOpen(true)
            setModalIsOpen2(false)
            setModalIsOpen3(false)
            setModalIsOpen4(false)
            setModalIsOpen5(false)
            setModalIsOpen6(true)
          
        }} 
          className="ml-4 text-white rounded-full "
          style={{ background: "linear-gradient(to right, #351A88,rgba(255, 102, 84, 0.7))", height: 50, alignItems: "center", fontSize: 16, width: 130, fontWeight: 700, fontFamily: "Popins" }}
        >
          Join Bet
        </button>
       
  </div>

    </div>

    <div
  className="flex flex-col gap-6 overflow-y-auto"
  style={{ width: "100%", alignSelf: "center", maxHeight: "100vh" }}
>
  {(!post || post.length === 0) ? ( 
    <div  style={{ fontSize: 24, fontFamily: "Poppins", marginTop: 90 }}  className="text-center text-gray-400">No Bets Available</div>
  ) : (
    post.map((comment, commentIndex) => (
      <div
        key={commentIndex}
        className="flex flex-col gap-2 bg-gray-800 p-10 rounded-lg mb-5"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)",
        }}
      >
         <h2
          className="text-sm text-white font-semibold flex justify-center items-center mb-4"
          style={{ fontSize: 20, fontFamily: "Poppins", marginTop: 0 }}
        >
          BetID : {comment.BetId}
        </h2>
        <h2
          className="text-sm text-white font-semibold flex justify-center items-center mb-8"
          style={{ fontSize: 24, fontFamily: "Poppins", marginTop: 0 }}
        >
          {comment.title}
        </h2>
       

        <div className="flex flex-row justify-between">
          <div
            className="flex flex-col"
            style={{
              marginLeft: "10%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactSVG
              src="/assets/human.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 120px; height: auto;");
              }}
            />
            <p
              className="text-lg font-semibold text-white"
              style={{ fontSize: 25, fontFamily: "Poppins", marginTop: 5, marginBottom: 10 }}
            >
                {comment.creatorName}
            </p>
            <h2
              className="text-sm text-gray-400"
              style={{ fontSize: 16, maxWidth: 160, textAlign: "center" }}
            >
             {comment.creatorDesc}
            </h2>
          </div>
         {comment.acceptorName === '' && comment.acceptorDesc  === '' && comment.acceptor === "" ? 
         <div
         className="flex flex-col"
         style={{
           marginRight: "10%",
           alignItems: "center",
           justifyContent: "center",
         }}>
          <p
   className="text-lg font-semibold text-white"
   style={{
     fontSize: 25,
     fontFamily: "Poppins",
     marginTop: 5,
     marginBottom: 10,
   }}
 >
   Waiting for friend...
 </p>
         </div>: 
 <div
 className="flex flex-col"
 style={{
   marginRight: "10%",
   alignItems: "center",
   justifyContent: "center",
 }}
>
 <ReactSVG
   src="/assets/human.svg"
   beforeInjection={(svg) => {
     svg.setAttribute("style", "width: 120px; height: auto;");
   }}
 />
 <p
   className="text-lg font-semibold text-white"
   style={{
     fontSize: 25,
     fontFamily: "Poppins",
     marginTop: 5,
     marginBottom: 10,
   }}
 >
    {comment.acceptorName}
 </p>
 <h2
   className="text-sm text-gray-400"
   style={{ fontSize: 16, maxWidth: 160, textAlign: "center" }}
 >
   {comment.acceptorDesc}
 </h2>
</div>
        }

        </div>

        <p
          className="text-lg flex justify-center items-center"
          style={{
            background: "linear-gradient(to bottom, #351A88, #FF6654)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: 40,
            fontWeight: 800,
            textAlign: "center",
            height: 120,
            lineHeight: 1.2,
            fontFamily: "Poppins",
            marginTop: -170,
          }}
        >
          VS
        </p>
        {comment.acceptorName === '' && comment.acceptorDesc  === '' && comment.acceptor === "" ? 
        <div  style={{ height: 50,
            fontSize: 16,
            width: 130,}}>
        </div>:
        <button
        onClick={() => {
          setModalIsOpen(true)
          setModalIsOpen2(false)
          setModalIsOpen3(false)
          setModalIsOpen4(true)
          setModalIsOpen5(false)
          setModalIsOpen6(false)
          setBetId(comment.BetId)

        }}
        className="flex text-white rounded-full justify-center items-center"
        style={{
          background: "linear-gradient(to right, #351A88, rgba(255, 102, 84, 0.5))",
          height: 50,
          fontSize: 16,
          width: 130,
          fontWeight: 700,
          fontFamily: "Poppins",
          marginTop: 100,
          alignSelf: "center",
        }}
      >
        End Bet
      </button>
}

      </div>
    ))
  )}
</div>



<div className='flex flex-row justify-between mb-8 ' style={{marginTop : 110}}>
    <p
    className="text-lg flex "
    style={{
      background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.7))",
      WebkitBackgroundClip: "text",
      color: "transparent",
      fontSize: 29,
      fontWeight: 800,
      //textAlign: "center",
      //height: 120,
      lineHeight: 1.2

    }}
  >
Closed Bets
  </p>

    </div>

    <div
  className="flex flex-col gap-6 overflow-y-auto"
  style={{ width: "100%", alignSelf: "center", maxHeight: "100vh" }}
>
  {(!post2 || post2.length === 0) ? ( 
    <div  style={{ fontSize: 24, fontFamily: "Poppins", marginTop: 90 }} className="text-center text-gray-400">No Bets Available</div>
  ) : (
    post2.map((comment, commentIndex) => (
      <div
        key={commentIndex}
        className="flex flex-col gap-2 bg-gray-800 p-10 rounded-lg mb-5"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)",
        }}
      >
        <h2
          className="text-sm text-white font-semibold flex justify-center items-center mb-4"
          style={{ fontSize: 20, fontFamily: "Poppins", marginTop: 0 }}
        >
          BetID : {comment.BetId}
        </h2>
        <h2
          className="text-sm text-white font-semibold flex justify-center items-center mb-8"
          style={{ fontSize: 24, fontFamily: "Poppins", marginTop: 0 }}
        >
         {comment.title}
        </h2>

        <div className="flex flex-row justify-between">
          <div
            className="flex flex-col"
            style={{
              marginLeft: "10%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactSVG
              src="/assets/human.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 120px; height: auto;");
              }}
            />
            <p
              className="text-lg font-semibold text-white"
              style={{ fontSize: 25, fontFamily: "Poppins", marginTop: 5, marginBottom: 10 }}
            >
              {comment.creatorName}
            </p>
            <h2
              className="text-sm text-gray-400"
              style={{ fontSize: 16, maxWidth: 160, textAlign: "center" }}
            >
              {comment.creatorDesc}
            </h2>
          </div>
          <div
            className="flex flex-col"
            style={{
              marginRight: "10%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactSVG
              src="/assets/human.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 120px; height: auto;");
              }}
            />
            <p
              className="text-lg font-semibold text-white"
              style={{
                fontSize: 25,
                fontFamily: "Poppins",
                marginTop: 5,
                marginBottom: 10,
              }}
            >
               {comment.acceptorName}
            </p>
            <h2
              className="text-sm text-gray-400"
              style={{ fontSize: 16, maxWidth: 160, textAlign: "center" }}
            >
              {comment.acceptorDesc}
            </h2>
          </div>
        </div>

        <p
          className="text-lg flex justify-center items-center"
          style={{
            background: "linear-gradient(to bottom, #351A88, #FF6654)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: 40,
            fontWeight: 800,
            textAlign: "center",
            height: 120,
            lineHeight: 1.2,
            fontFamily: "Poppins",
            marginTop: -170,
          }}
        >
          VS
        </p>

        {comment.winner === signedAccountId ?  <p
          className="text-lg flex justify-center items-center"
          style={{
            background: "linear-gradient(to bottom, #351A88, #FF6654)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: 40,
            fontWeight: 800,
            textAlign: "center",
            height: 120,
            lineHeight: 1.2,
            fontFamily: "Poppins",
           // marginTop: -170,
          }}
        >
          You Won!
        </p> :  <p
          className="text-lg flex justify-center items-center"
          style={{
            background: "linear-gradient(to bottom, #351A88, #FF6654)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: 40,
            fontWeight: 800,
            textAlign: "center",
            height: 120,
            lineHeight: 1.2,
            fontFamily: "Poppins",
           // marginTop: -170,
          }}
        >
          You Lost!
        </p>} 
       

       
         <div  style={{ height: 50,
            fontSize: 16,
            width: 130,}}>
        </div>
      </div>
    ))
  )}
</div>


</section>

<section className="block md:hidden text-white bg-darkBlue py-20 px-8" style={{ background: "#14051E",}}>
<p
    className="text-lg flex justify-center items-center"
    style={{
      background: "linear-gradient(to right, #351A88, #FF6654)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      fontSize: 22,
      fontWeight: 800,
      textAlign: "center",
      //height: 120,
      lineHeight: 1.2,
      marginBottom: 25

    }}
  >
    Live Bets
  </p>

<div className='flex flex-row justify-center mb-8'>

  <div className='flex flex-row'>
  <button
         onClick={() => {
            setModalIsOpen(true)
            setModalIsOpen2(false)
            setModalIsOpen3(true)
            setModalIsOpen4(false)
            setModalIsOpen5(false)
            setModalIsOpen6(false)
           
        }} // trigger the search on button click
          className="ml-4 text-white rounded-full "
          style={{ background: "linear-gradient(to right, #351A88,rgba(255, 102, 84, 0.7))", height: 40, alignItems: "center", fontSize: 13, width: 100, fontWeight: 700, fontFamily: "Popins" }}
        >
          Create Bets
        </button>
        <button
         onClick={() => {
            setModalIsOpen(true)
            setModalIsOpen2(false)
            setModalIsOpen3(false)
            setModalIsOpen4(false)
            setModalIsOpen5(false)
            setModalIsOpen6(true)
           
        }} // trigger the search on button click
          className="ml-4 text-white rounded-full "
          style={{ background: "linear-gradient(to right, #351A88,rgba(255, 102, 84, 0.7))", height: 40, alignItems: "center", fontSize: 13, width: 100, fontWeight: 700, fontFamily: "Popins" }}
        >
          Join Bet
        </button>
       
  </div>

    </div>

    <div
  className="flex flex-col gap-6 overflow-y-auto"
  style={{ width: "100%", alignSelf: "center", maxHeight: "100vh" }}
>
  {(!post || post.length === 0) ? (  // Check if post is null, undefined, or empty
    <div  style={{ fontSize: 24, fontFamily: "Poppins", marginTop: 90 }}  className="text-center text-gray-400">No Bets Available</div>
  ) : (
    post.map((comment, commentIndex) => (
        <div
        key={commentIndex}
        className="flex flex-col gap-2 bg-gray-800 p-5 rounded-lg mb-5"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)",
        }}
      >
       
        <h2
          className="text-sm text-white font-semibold flex justify-center items-center mb-8"
          style={{ fontSize: 16, fontFamily: "Poppins", marginTop: 0 }}
        >
         BetID : {comment.BetId}
        </h2>

        <h2
          className="text-sm text-white font-semibold flex justify-center items-center mb-8"
          style={{ fontSize: 16, fontFamily: "Poppins", marginTop: 0 }}
        >
         {comment.title}
        </h2>

        <div className="flex flex-row justify-between">
          <div
            className="flex flex-col"
            style={{
      
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactSVG
              src="/assets/human.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 50px; height: auto;");
              }}
            />
            <p
              className="text-lg font-semibold text-white"
              style={{ fontSize: 17, fontFamily: "Poppins", marginTop: 5, marginBottom: 2 }}
            >
              {comment.creatorName}
            </p>
            <h2
              className="text-sm text-gray-400"
              style={{ fontSize: 12, maxWidth: 160, textAlign: "center" }}
            >
              {comment.creatorDesc}
            </h2>
          </div>
         
                   {comment.acceptorName === '' && comment.acceptorDesc  === '' && comment.acceptor === "" ? 
         <div
         className="flex flex-col"
         style={{
           marginRight: "-15%",
           alignItems: "center",
           justifyContent: "center",
           width : 100
         }}>
          <p
   className="text-lg font-semibold text-white"
   style={{
     fontSize: 15,
     fontFamily: "Poppins",
     marginTop: 5,
     marginBottom: 10,
   }}
 >
   Waiting for friend...
 </p>
         </div>: 
         <div
            className="flex flex-col"
            style={{
              //marginRight: "3%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactSVG
              src="/assets/human.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 50px; height: auto;");
              }}
            />
            <p
              className="text-lg font-semibold text-white"
              style={{
                fontSize: 17,
                fontFamily: "Poppins",
                marginTop: 5,
                marginBottom: 2,
              }}
            >
               {comment.acceptorName}
            </p>
            <h2
              className="text-sm text-gray-400"
              style={{ fontSize: 12, maxWidth: 160, textAlign: "center" }}
            >
              {comment.acceptorDesc}
            </h2>
          </div>
        }
        </div>

        <p
          className="text-lg flex justify-center items-center"
          style={{
            background: "linear-gradient(to bottom, #351A88, #FF6654)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: 25,
            fontWeight: 800,
            textAlign: "center",
            height: 120,
            lineHeight: 1.2,
            fontFamily: "Poppins",
            marginTop: -130,
          }}
        >
          VS
        </p>
        {comment.acceptorName === '' && comment.acceptorDesc  === '' && comment.acceptor === "" ? 
        <div  style={{ height: 10,
            fontSize: 16,
            width: 130,}}>
        </div>:
        <button
        onClick={() => {
          setModalIsOpen(true)
          setModalIsOpen2(false)
          setModalIsOpen3(false)
          setModalIsOpen4(true)
          setModalIsOpen5(false)
          setModalIsOpen6(false)
          setBetId(comment.BetId)

        }}
        className="flex text-white rounded-full justify-center items-center"
        style={{
          background: "linear-gradient(to right, #351A88, rgba(255, 102, 84, 0.5))",
          height: 40,
          fontSize: 14,
          width: 100,
          fontWeight: 700,
          fontFamily: "Poppins",
          marginTop: 50,
          alignSelf: "center",
        }}
      >
        End Bet
      </button>
}

      </div>
    ))
  )}
</div>



    <p
    className="text-lg flex justify-center items-center"
    style={{
      background: "linear-gradient(to right, #351A88, #FF6654)",
      WebkitBackgroundClip: "text",
      color: "transparent",
      fontSize: 22,
      fontWeight: 800,
      textAlign: "center",
      //height: 120,
      lineHeight: 1.2,
      marginBottom: 25,
      marginTop : 50
    }}
  >
    Closed Bets
  </p>


    <div
  className="flex flex-col gap-6 overflow-y-auto"
  style={{ width: "100%", alignSelf: "center", maxHeight: "100vh" }}
>
  {(!post2 || post2.length === 0) ? (  // Check if post is null, undefined, or empty
    <div  style={{ fontSize: 24, fontFamily: "Poppins", marginTop: 90 }} className="text-center text-gray-400">No Bets Available</div>
  ) : (
    post2.map((comment, commentIndex) => (
      <div
        key={commentIndex}
        className="flex flex-col gap-2 bg-gray-800 p-5 rounded-lg mb-5"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)",
        }}
      >
        <h2
          className="text-sm text-white font-semibold flex justify-center items-center mb-8"
          style={{ fontSize: 16, fontFamily: "Poppins", marginTop: 0 }}
        >
         {comment.title}
        </h2>

        <div className="flex flex-row justify-between">
          <div
            className="flex flex-col"
            style={{
             // marginLeft: "3%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactSVG
              src="/assets/human.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 50px; height: auto;");
              }}
            />
            <p
              className="text-lg font-semibold text-white"
              style={{ fontSize: 17, fontFamily: "Poppins", marginTop: 5, marginBottom: 2 }}
            >
              {comment.creatorName}
            </p>
            <h2
              className="text-sm text-gray-400"
              style={{ fontSize: 12, maxWidth: 160, textAlign: "center" }}
            >
              {comment.creatorDesc}
            </h2>
          </div>
          <div
            className="flex flex-col"
            style={{
              //marginRight: "3%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReactSVG
              src="/assets/human.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 50px; height: auto;");
              }}
            />
            <p
              className="text-lg font-semibold text-white"
              style={{
                fontSize: 17,
                fontFamily: "Poppins",
                marginTop: 5,
                marginBottom: 2,
              }}
            >
               {comment.acceptorName}
            </p>
            <h2
              className="text-sm text-gray-400"
              style={{ fontSize: 12, maxWidth: 160, textAlign: "center" }}
            >
              {comment.acceptorDesc}
            </h2>
          </div>
        </div>

        <p
          className="text-lg flex justify-center items-center"
          style={{
            background: "linear-gradient(to bottom, #351A88, #FF6654)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: 25,
            fontWeight: 800,
            textAlign: "center",
            height: 120,
            lineHeight: 1.2,
            fontFamily: "Poppins",
            marginTop: -130,
          }}
        >
          VS
        </p>

        {comment.winner === signedAccountId ?  <p
          className="text-lg flex justify-center items-center"
          style={{
            background: "linear-gradient(to bottom, #351A88, #FF6654)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: 25,
            fontWeight: 800,
            textAlign: "center",
            height: 120,
            lineHeight: 1.2,
            fontFamily: "Poppins",
           // marginTop: -170,
          }}
        >
          You Won!
        </p> :  <p
          className="text-lg flex justify-center items-center"
          style={{
            background: "linear-gradient(to bottom, #351A88, #FF6654)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: 25,
            fontWeight: 800,
            textAlign: "center",
            height: 120,
            lineHeight: 1.2,
            fontFamily: "Poppins",
           // marginTop: -170,
          }}
        >
          You Lost!
        </p>} 
       

       
      </div>
    ))
  )}
</div>

      
  </section>
  </>
  }
  <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="relative bg-black text-white p-6 rounded-lg w-full max-w-lg mx-auto text-center min-h-96"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"

      >
        <div className="flex justify-end px-4">
        <button
          onClick={() => setModalIsOpen(false)}
          className="text-2xl focus:outline-none"
        >
          &#10005; 
        </button>
      </div>

        {modalIsOpen2 &&
        <>


        </> }
        
        
        {modalIsOpen3 && (
            !modalIsOpen5 ?  < div style={{ }}>
            <h2 className="text-xl font-semibold mb-1">Create Bet</h2>
            <p style={{ marginTop: 10,fontSize:16, marginBottom:1, fontFamily: "Poppins", fontWeight: 20}}>Enter Bet Title</p>
            <div className="relative flex-grow">
         
              <input
                type="text"
                placeholder="Eg. Chelsea vs Mancity"
                //value={donateamt}
            
                onChange={(e) => settitle(e.target.value)} // update temporary state
                className=" px-4 py-2 bg-white  text-gray-500 focus:outline-none "
                style={{ height: 40, fontSize: 13, background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.9))", marginTop: 5, textAlign: "center", color: "white", borderRadius: 10, width: "70%"}}
              />
    
            </div>
            <p style={{ marginTop: 10,fontSize:16, marginBottom:1, fontFamily: "Poppins", fontWeight: 20}}>Enter Your Name</p>
            <div className="relative flex-grow">
         
              <input
                type="text"
                placeholder="Name"
                // value={donateamt}
            
                onChange={(e) => setname(e.target.value)} // update temporary state
                className=" px-4 py-2 bg-white  text-gray-500 focus:outline-none "
                style={{ height: 40, fontSize: 13, background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.9))", marginTop: 5, textAlign: "center", color: "white", borderRadius: 10, width: "70%"}}
              />
    
            </div>
    
            <p style={{ marginTop: 10,fontSize:16, marginBottom:1, fontFamily: "Poppins", fontWeight: 20}}>Enter Description </p>
            <div className="relative flex-grow">
         
              <input
                type="text"
                placeholder="Eg. Chelsea Will Beat Mancity"
                // value={donateamt}
            
                onChange={(e) => setdesc(e.target.value)} // update temporary state
                className=" px-4 py-2 bg-white  text-gray-500 focus:outline-none "
                style={{ height: 40, fontSize: 13, background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.9))", marginTop: 5, textAlign: "center", color: "white", borderRadius: 10, width: "70%"}}
              />
    
            </div>
    
            <p style={{ marginTop: 10,fontSize:16, marginBottom:1, fontFamily: "Poppins", fontWeight: 20}}>Enter Wager Amount </p>
            <div className="relative flex-grow">
         
              <input
                type="text"
                placeholder="Eg. $20 NEAR"
                // value={donateamt}
            
                onChange={(e) => setamount(e.target.value)} // update temporary state
                className=" px-4 py-2 bg-white  text-gray-500 focus:outline-none "
                style={{ height: 40, fontSize: 13, background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.9))", marginTop: 5, textAlign: "center", color: "white", borderRadius: 10, width: "70%"}}
              />
    
            </div>
           
            <button
             onClick={() => {
                setModalIsOpen(false)
                setLoading(true)

                createbet()
                // setLoading(true)
                // Donate()
            }} // trigger the search on button click
              className=" text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ background: "linear-gradient(to right, #351A88,rgba(255, 102, 84, 0.7))", height: 40, alignItems: "center", fontSize: 15, width: 170, marginTop: 30}}
            >
              Continue
            </button>
           
    
            </div> : 
              <>

              <div className="flex-col bg-darkBlue  justify-center items-center" >
                <div className="flex flex-col justify-center items-center mb-5">
                {/* <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="128px" height="128px"><polygon  fill="#907DB3"  points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg> */}
                <ReactSVG src="/assets/tick.svg" beforeInjection={(svg) => {
                        svg.setAttribute('style', 'width: 100px; height: auto;');
                      }} />
                </div>
                <h2 className="text-xl font-semibold mb-4" >Bet Placed Succcessfully </h2>
                <h2 className="text-xl font-semibold mb-4" style={{fontSize: 19}}>Bet ID : {BetId} </h2>
                <div className="flex-1 flex justify-center" style={{fontSize: 15}}>Give this Bet ID Code to the friend to enable them join</div>

                
              </div>
                      </> 
        )  
        
       
        
        }

{modalIsOpen4 && (
  <>
  
   {!modalIsOpen5 ? 
   <>
   <h2 className="text-xl font-semibold mb-3">End Bet</h2>
    <p style={{ marginTop: 0, fontSize: 14, marginBottom: 3 }}>Who Won This Bet?</p>
    <p className="text-gray-400" style={{ marginTop: 0, fontSize: 12, marginBottom: 20 }}>
      Ensure you both enter the same winner in order to release funds.
    </p>

    <div className="flex justify-center mb-2 mt-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => {
            setSelectedCategory(category); // Set the selected category
            
          }}
          className={`flex items-center justify-center w-20 h-10 m-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 focus:outline-none ${
            selectedCategory === category ? 'ring-1 ring-orange-500' : ''
          }`}
          style={{
            backgroundColor: "rgba(255, 102, 84, 0.3)",
            color: "rgba(255, 102, 84, 1)",
            fontSize: 13,
            position: 'relative', // Ensure the button stays in place
            zIndex: 10, // Adjust the z-index if needed
            pointerEvents: 'auto', // Ensure the button is clickable
          }}
        >
          {category}
        </button>
      ))}
    </div>

    <button
             onClick={() => {
               setLoading(true)
               setModalIsOpen(false)
                endbet()
                // setLoading(true)
                // Donate()
            }} // trigger the search on button click
              className=" text-white rounded-full focus:outline-none "
              style={{ background: "linear-gradient(to right, #351A88,rgba(255, 102, 84, 0.7))", height: 40, alignItems: "center", fontSize: 15, width: 150, marginTop: 30}}
            >
              Continue
            </button>
            </>:
            <>

<div className="flex-col bg-darkBlue  justify-center items-center" >
  <div className="flex flex-col justify-center items-center mb-5">
  {/* <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="128px" height="128px"><polygon  fill="#907DB3"  points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg> */}
  <ReactSVG src="/assets/tick.svg" beforeInjection={(svg) => {
          svg.setAttribute('style', 'width: 100px; height: auto;');
        }} />
  </div>
  <h2 className="text-xl font-semibold mb-4" >Bet Submitted Succcessfully</h2>
  <h2 className="text-xl font-semibold mb-4" style={{fontSize: 19}}>Bet ID : {BetId} </h2>
  <div className="flex-1 flex justify-center" style={{fontSize: 15}}>Winner will be decided and credited shortly...</div>

  
</div>
        </> 

        }
           
  </>

  
)}

{modalIsOpen6 && (
            !modalIsOpen5 ?  < div style={{ }}>
            <h2 className="text-xl font-semibold mb-1">Join Bet</h2>
            <p style={{ marginTop: 10,fontSize:16, marginBottom:1, fontFamily: "Poppins", fontWeight: 20}}>Enter Bet ID</p>
            <div className="relative flex-grow">
         
              <input
                type="text"
                placeholder="Enter BetID from creator"
                //value={donateamt}
            
                onChange={(e) => setBetId(e.target.value)} // update temporary state
                className=" px-4 py-2 bg-white  text-gray-500 focus:outline-none "
                style={{ height: 40, fontSize: 13, background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.9))", marginTop: 5, textAlign: "center", color: "white", borderRadius: 10, width: "70%"}}
              />
    
            </div>
            <p style={{ marginTop: 10,fontSize:16, marginBottom:1, fontFamily: "Poppins", fontWeight: 20}}>Enter Your Name</p>
            <div className="relative flex-grow">
         
              <input
                type="text"
                placeholder="Name"
                // value={donateamt}
            
                onChange={(e) => setname(e.target.value)} // update temporary state
                className=" px-4 py-2 bg-white  text-gray-500 focus:outline-none "
                style={{ height: 40, fontSize: 13, background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.9))", marginTop: 5, textAlign: "center", color: "white", borderRadius: 10, width: "70%"}}
              />
    
            </div>
    
            <p style={{ marginTop: 10,fontSize:16, marginBottom:1, fontFamily: "Poppins", fontWeight: 20}}>Enter Description </p>
            <div className="relative flex-grow">
         
              <input
                type="text"
                placeholder="Eg. Chelsea Will Beat Mancity"
                // value={donateamt}
            
                onChange={(e) => setdesc(e.target.value)} // update temporary state
                className=" px-4 py-2 bg-white  text-gray-500 focus:outline-none "
                style={{ height: 40, fontSize: 13, background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.9))", marginTop: 5, textAlign: "center", color: "white", borderRadius: 10, width: "70%"}}
              />
    
            </div>
    
            <p style={{ marginTop: 10,fontSize:16, marginBottom:1, fontFamily: "Poppins", fontWeight: 20}}>Enter Wager Amount </p>
            <div className="relative flex-grow">
         
         <input
           type="text"
           placeholder="Ensure you enter the same amount as the creator"
          value={amount}
       
           onChange={(e) => setamount(e.target.value)} // update temporary state
           className=" px-4 py-2 bg-white  text-gray-500 focus:outline-none "
           style={{ height: 40, fontSize: 13, background: "linear-gradient(to bottom, #351A88, rgba(255, 102, 84, 0.9))", marginTop: 5, textAlign: "center", color: "white", borderRadius: 10, width: "70%"}}
         />

       </div>
           
            <button
             onClick={() => {
                setModalIsOpen(false)
                setLoading(true)
                acceptbet()
                // setLoading(true)
                // Donate()
            }} // trigger the search on button click
              className=" text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ background: "linear-gradient(to right, #351A88,rgba(255, 102, 84, 0.7))", height: 40, alignItems: "center", fontSize: 15, width: 170, marginTop: 30}}
            >
              Continue
            </button>
           
    
            </div> : 
              <>

              <div className="flex-col bg-darkBlue  justify-center items-center" >
                <div className="flex flex-col justify-center items-center mb-5">
                {/* <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="128px" height="128px"><polygon  fill="#907DB3"  points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg> */}
                <ReactSVG src="/assets/tick.svg" beforeInjection={(svg) => {
                        svg.setAttribute('style', 'width: 100px; height: auto;');
                      }} />
                </div>
                <h2 className="text-xl font-semibold mb-4" >Joined Bet Succcessfully </h2>
                <h2 className="text-xl font-semibold mb-4" style={{fontSize: 19}}>Bet ID : {BetId}</h2>
                <div className="flex-1 flex justify-center" style={{fontSize: 15}}>You have Succcessfully Joined bet and its Live!!!!</div>

                
              </div>
                      </> 
        )  
        
       
        
        }

        

      </Modal>

</>
  
  );
};

export default Wagers;
