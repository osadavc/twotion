import { signIn, useSession } from "next-auth/react";
import { FC, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn("twitter");
    }
  }, [session]);

  return <>{children}</>;
};

export default Layout;
