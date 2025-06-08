import { loader } from "~/modules/ide/routes/ide.$type.$id";

/**
 * This is a simple test script to validate that pointer resolution works correctly.
 * It simulates a request to the IDE route loader and checks that pointers are resolved
 * correctly, including multi-hop pointers that reference other pointers.
 */
async function testPointerResolution() {
  // Create a mock request to the loader
  const mockArgs = {
    params: {
      type: "test-file",
      id: "company-c"
    },
    request: new Request("http://localhost:5173/ide/test-file/company-c")
  };

  try {
    // Call the loader with our mock args
    const result = await loader(mockArgs as any);
    
    console.log("Loader result:", JSON.stringify(result, null, 2));
    
    // Check if we successfully resolved the pointer chain
    if (result.resolved && result.resolved.length > 0) {
      const indirectRef = result.resolved.find(r => r.path === "indirectCompanyRef");
      if (indirectRef) {
        console.log("Multi-hop resolution result:", indirectRef.resolved);
        if (indirectRef.resolved === "ACME Corporation") {
          console.log("✅ SUCCESS! Multi-hop resolution is working correctly");
        } else {
          console.log("❌ FAILURE! Value was resolved but not to the expected 'ACME Corporation'");
        }
      } else {
        console.log("❌ FAILURE! indirectCompanyRef was not found in the resolved pointers");
      }
    } else {
      console.log("❌ FAILURE! No resolved pointers found");
    }
  } catch (error) {
    console.error("❌ ERROR:", error);
  }
}

// Run the test
testPointerResolution().catch(err => console.error("Unhandled error:", err));