import type { LoaderFunctionArgs } from "react-router";

export async function loader(args: LoaderFunctionArgs) {
  console.log("Chat loader called");
  return { 
    data: { 
      message: "Test chat data",
      timestamp: Date.now() 
    } 
  };
}

export default function ChatTestRoute() {
  console.log("Chat component rendering");
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Chat Test Route</h1>
      <p>If you see this, the route is working!</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}