import Header from "components/Common/Header";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const Dashboard = () => {
  return (
    <div>
      <Header />
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
