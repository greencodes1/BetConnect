import Image from 'next/image';

import NearLogo from '/public/near.svg';
import NextLogo from '/public/next.svg';
import styles from './app.module.css';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Put from '@/components/Put';
// import Security from '@/components/Security';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    // <main className={styles.main}>
       <div className=" text-white bg-darkBlue ">
      <Header page={"home"} />
      <Hero/>
      <Put/>
      {/* <Security /> */}
      <Footer />
    </div>
     
  );
}