import Header from "components/Common/Header";
import HeroSection from "components/Home/HeroSection";
import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
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
