import Header from "components/Common/Header";
import HeroSection from "components/Home/HeroSection";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

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
      session: JSON.stringify(
        await unstable_getServerSession(ctx.req, ctx.res, authOptions)
      ),
    },
  };
};
