// Quick view component for jsons that shows a compact version in the ide file list
import { useJsonFileSelector } from "~/modules/json.ide/hooks/use-json-file-selector";
import { useManifest } from "~/modules/ide/hooks/use-manifest";

export function QuickView() {
  // Cast to JsonArtifact to access specific properties
  const manifest = useManifest();
  const path = manifest.path;
  const json = useJsonFileSelector((state) => state.context.data);
  const fileName = path.split("/").pop() || "";
  const output = manifest.mapping.output.variables || {};
  return (
    <div className="px-2 py-1">
      <div className="text-sm font-medium">{fileName}</div>
      <div className="text-xs text-gray-500">JSON Document</div>
      <pre>{JSON.stringify(json, null, 2)}</pre>
      <div className="text-xs text-gray-500">Outputs</div>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </div>
  );
}
