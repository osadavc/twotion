import { NotionOAuthOptions, User } from "@prisma/client";
import Header from "components/Common/Header";
import ConnectNotion from "components/Dashboard/ConnectNotion";
import prisma from "lib/prisma";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

interface DashboardProps {
  user: User & {
    notion: NotionOAuthOptions | null;
  };
}

const Dashboard: NextPage<DashboardProps> = ({ user }) => {
  return (
    <div>
      <Header />

      <div className="mx-auto max-w-7xl px-4 pt-10">
        {!user.notion?.accessToken && <ConnectNotion />}
      </div>
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

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      notion: true,
    },
  });

  return {
    props: {
      session,
      user,
    },
  };
};
