import { Redirect } from "expo-router";
import { useAuth } from "@/components/AuthContext";

export default function IndexPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
