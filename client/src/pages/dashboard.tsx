import { NotionOAuthOptions, User } from "@prisma/client";
import Header from "components/Common/Header";
import ConnectNotion from "components/Dashboard/ConnectNotion";
import prisma from "lib/prisma";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

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
        {(!user.notion?.accessToken || user.notion.error) && (
          <ConnectNotion userNotion={user.notion} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

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
      session: JSON.stringify(session),
      user,
    },
  };
};
