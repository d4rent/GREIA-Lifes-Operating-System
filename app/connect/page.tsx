import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export default function ConnectPage() {
  const handleGitHubConnect = async () => {
    try {
      await signIn("github", { callbackUrl: "/connect" });
    } catch (error) {
      console.error("GitHub connection error:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Connect with GREIA</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Connect Your GitHub Account</h2>
          <p className="mb-4">Link your GitHub account to access additional features and seamlessly integrate with your development workflow.</p>
          <Button 
            onClick={handleGitHubConnect}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Connect GitHub
          </Button>
        </div>
      </div>
    </main>
  );
}