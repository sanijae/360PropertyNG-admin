// components/AuthGuard.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      router.replace("/admin/login"); 
    }
  }, [router]);

  return <>{children}</>;
};

export default AuthGuard;
