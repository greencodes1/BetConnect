"use client";
import React, { useState, useEffect,useContext } from 'react';
import { ReactSVG } from 'react-svg';
// import { useNavigate } from "react-router-dom";
import { ColorRing } from 'react-loader-spinner'
import { HelloNearContract } from '../config';
import { NearContext } from '../wallets/near';
const Leaderboard = () => {


  const [topUsers, settopUsers] = useState([]);
  const [otherUsers, setotherUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const CONTRACT = HelloNearContract;

  const { signedAccountId, wallet } = useContext(NearContext);





  useEffect(() => {
    const endbet = async () => {
      
        try {

          const products2 =  await wallet.viewMethod({ contractId: CONTRACT, method: 'getTopThreeBets' }) 
          const result = await wallet.viewMethod({ contractId: CONTRACT, method: 'getRemainingBets' })


          settopUsers(products2)
          setotherUsers(result)
        
      
      
         setLoading(false)

        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      };
      endbet()
    }, []);




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
  {!wallet?  <p className="text-md md:text-lg mb-4 mt-10" style={{fontSize: 15}}>Please ensure your wallet is connected.....</p> : <p className="text-md md:text-lg mb-4 mt-10" style={{fontSize: 15}}></p>}
        
    </div> : 
     <div className="bg-gray-900 min-h-screen flex justify-center py-10" style={{ background: "#14051E" }}>
        
     <div className="hidden md:block w-full max-w-4xl px-4">
     <p
   className="text-lg flex justify-center items-center"
   style={{
     background: "linear-gradient(to right, #351A88, #FF6654)",
     WebkitBackgroundClip: "text",
     color: "transparent",
     fontSize: 40,
     fontWeight: 800,
     textAlign: "center",
     height: 120,
     lineHeight: 1.2,
     marginBottom: 50

   }}
 >
   Community LeaderBoard
 </p>

 {(!topUsers || topUsers.length === 0) ? (  // Check if post is null, undefined, or empty
    <div  style={{ fontSize: 28, fontFamily: "Poppins", marginTop: 190 }}  className="text-center text-gray-400">No Leadboard Yet!!</div>
  ) :
  <>
       <div className="flex flex-row items-center justify-center gap-3 mb-10">
 {topUsers.map((user, index) => (
   <div
     key={index}
     className={`flex flex-col items-center justify-center text-center p-4 bg-gray-800 rounded-lg shadow-lg ${
       user.position === 1 ? '-translate-y-10' : ''
     }`}
     style={{
       width: user.position === 1 ? '40%' : '30%',
       background: 'linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)',
     }}
   >
     <div className={`relative `}>
       <ReactSVG
         src="/assets/human.svg"
         beforeInjection={(svg) => {
           svg.setAttribute('style', 'width: 80px; height: auto;');
         }}
       />
     </div>
     <h3 className="text-white font-bold" style={{fontSize: 22, fontWeight: 800, fontFamily: "Poppins"}}>{user.winner === user.acceptor ?  user.acceptorName : user.creatorName}</h3>
     <p className="text-orange-500 text-2xl font-bold" style={{ background: "linear-gradient(to bottom, #351A88, #FF6654)",
     WebkitBackgroundClip: "text",
     color: "transparent",}}>{parseInt(user.amount.toLocaleString('fullwide', { useGrouping: false }))/1000000000000000000000000} Near</p>
     <p className="text-gray-400">{user.winner.substring(0, 15)}...</p>
   </div>
 ))}
</div>
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg"  style={{ background: "linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)",}}>
      <ul>
        {otherUsers.map((user, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-14 border-b border-gray-700 mb-2"
            style={{ background: "linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)",}}
          >
            <div className="flex items-center gap-4">
                <div style={{marginLeft: 20}}>
                <ReactSVG
      src="/assets/human.svg"
      beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 30px; height: auto;');
      }}
    />
                </div>
            
              <div>
              <h3 className="text-white font-bold" style={{fontSize: 22, fontWeight: 800, fontFamily: "Poppins"}}>{user.winner === user.acceptor ?  user.acceptorName : user.creatorName}</h3>
                <p className="text-gray-400">{user.acceptor}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-bold" style={{ background: "linear-gradient(to bottom, #351A88, #FF6654)",
  WebkitBackgroundClip: "text",
  color: "transparent",marginRight: 30, fontSize: 25}}>{parseInt(user.amount.toLocaleString('fullwide', { useGrouping: false }))/1000000000000000000000000} Near</span>
             
            </div>
          </li>
        ))}
      </ul>
    </div>
  </>

}


 
     </div>

     <div className="block md:hidden w-full max-w-4xl px-4">
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
     lineHeight: 1.2,
     marginBottom: 50

   }}
 >
   Community LeaderBoard
 </p>
 {(!topUsers || topUsers.length === 0) ? (  // Check if post is null, undefined, or empty
    <div  style={{ fontSize: 22, fontFamily: "Poppins", marginTop: 150 }}  className="text-center text-gray-400">No Leadboard Yet!!</div>
  ) :

  <>
       <div className="flex flex-row items-center justify-center gap-3 mb-10">
 {topUsers.map((user, index) => (
   <div
     key={index}
     className={`flex flex-col items-center justify-center text-center p-4 bg-gray-800 rounded-lg shadow-lg ${
       user.position === 1 ? '-translate-y-10' : ''
     }`}
     style={{
       width: user.position === 1 ? '40%' : '30%',
       background: 'linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)',
     }}
   >
     <div className={`relative `}>
       <ReactSVG
         src="/assets/human.svg"
         beforeInjection={(svg) => {
           svg.setAttribute('style', 'width: 40px; height: auto;');
         }}
       />
     </div>
     <h3 className="text-white font-bold" style={{fontSize: 15, fontWeight: 800, fontFamily: "Poppins"}}>{user.winner === user.acceptor ?  user.acceptorName : user.creatorName}</h3>
     <p className="text-orange-500 text-2xl font-bold" style={{ background: "linear-gradient(to bottom, #351A88, #FF6654)",
     WebkitBackgroundClip: "text",
     color: "transparent",fontSize: 18}}>{parseInt(user.amount.toLocaleString('fullwide', { useGrouping: false }))/1000000000000000000000000} Near</p>
     <p className="text-gray-400" style={{fontSize: 13}}>{user.winner.substring(0, 10)}...</p>
   </div>
 ))}
</div>
     <div className="bg-gray-800 p-1 rounded-lg shadow-lg"  style={{ background: "linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)",}}>
     <ul>
       {otherUsers.map((user, index) => (
         <li
           key={index}
           className="flex items-center justify-between py-14 border-b border-gray-700 mb-2"
           style={{ background: "linear-gradient(to bottom, rgba(255, 102, 84, 0.1), #351A88)",}}
         >
           <div className="flex items-center gap-4">
               <div style={{marginLeft: 20}}>
               <ReactSVG
     src="/assets/human.svg"
     beforeInjection={(svg) => {
       svg.setAttribute('style', 'width: 40px; height: auto;');
     }}
   />
               </div>
           
             <div>
             <h3 className="text-white font-bold" style={{fontSize: 17, fontWeight: 800, fontFamily: "Poppins"}}>{user.winner === user.acceptor ?  user.acceptorName : user.creatorName}</h3>
               <p className="text-gray-400" style={{fontSize: 13}}>{user.acceptor.substring(0, 20)}...</p>
             </div>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-white text-lg font-bold" style={{ background: "linear-gradient(to bottom, #351A88, #FF6654)",
 WebkitBackgroundClip: "text",
 color: "transparent",marginRight: 30, fontSize: 17}}>{parseInt(user.amount.toLocaleString('fullwide', { useGrouping: false }))/1000000000000000000000000} Near</span>
            
           </div>
         </li>
       ))}
     </ul>
   </div>
  </>

}


  
     </div>
   </div>
    }
    
    
    </>
   
  );
};

export default Leaderboard;
