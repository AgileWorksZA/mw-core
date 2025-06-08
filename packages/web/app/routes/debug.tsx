import fs from "node:fs";
import { useLoaderData } from "react-router";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export async function loader() {
  const ide = fs.readFileSync("public/store-kit/ide/ide/_.json", "utf-8");
  return {
    ide: JSON.parse(ide),
  };
}

export default function Debug() {
  const { ide } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      navigate("/debug");
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-bold">Debug</h2>
      <pre>{JSON.stringify(ide, null, 2)}</pre>
    </div>
  );
}
