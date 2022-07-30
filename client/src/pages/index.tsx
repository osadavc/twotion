import Header from "components/Common/Header";
import Footer from "components/Home/Footer";
import HeroSection from "components/Home/HeroSection";
import HowTwotion from "components/Home/HowTwotion";
import Pricing from "components/Home/Pricing";
import WhyTwotion from "components/Home/WhyTwotion";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <WhyTwotion />
      <HowTwotion />
      <Pricing />
      <Footer />
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      session: await getSession(ctx),
    },
  };
};
