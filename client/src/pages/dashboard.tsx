import { NotionOAuthOptions, TwitterThreads, User } from "@prisma/client";
import Header from "components/Common/Header";
import ConnectNotion from "components/Dashboard/ConnectNotion";
import InstallExtension from "components/Dashboard/InstallExtension";
import TwitterThreadList from "components/Dashboard/TwitterThreadList";
import prisma from "lib/prisma";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

interface DashboardProps {
  user: User & {
    twitterThreads: (TwitterThreads & {
      tweets: {
        id: string;
        text: string;
      }[];
    })[];
    notion: NotionOAuthOptions | null;
  };
}

const Dashboard: NextPage<DashboardProps> = ({
  user: { twitterThreads, ...user },
}) => {
  return (
    <div>
      <Header />

      <div className="mx-auto max-w-7xl space-y-3 px-4 pt-10">
        {(!user.notion?.accessToken || user.notion.error) && (
          <ConnectNotion userNotion={user.notion} />
        )}

        <InstallExtension />
        {user.notion?.accessToken && (
          <TwitterThreadList twitterThreads={twitterThreads} />
        )}
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
      twitterThreads: {
        include: {
          tweets: {
            select: {
              id: true,
              text: true,
            },
          },
        },
      },
    },
  });

  return {
    props: {
      session: session,
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};
