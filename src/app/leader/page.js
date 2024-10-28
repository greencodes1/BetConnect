import Image from 'next/image';


import Header from '@/components/Header';
import Leaderboard from '@/components/Leaderboard';
import Footer from '@/components/Footer';

export default function Leaderboards() {
  return (
    // <main className={styles.main}>
       <div className=" text-white bg-darkBlue ">
      <Header page={"leader"} />
      <Leaderboard  />
     
      <Footer  />

    </div>
     
  );
}