import Image from 'next/image';


import Header from '@/components/Header';
import Wagers from '@/components/Wagers';
import Footer from '@/components/Footer';

export default function Wager() {
  return (
    // <main className={styles.main}>
       <div className=" text-white bg-darkBlue ">
      <Header page={"wager"} />
      <Wagers  />
     
      <Footer  />

    </div>
     
  );
}