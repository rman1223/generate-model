import logo from "./logo.svg";
import "./App.css";
import { WebIO } from "@gltf-transform/core";
// import fs from "node:fs";

let modelUint8Array, textureUint8Array;
const io = new WebIO({ credentials: "include" });
// io.read();
async function convertGlb() {
  if (!modelUint8Array || !textureUint8Array)
    window.alert("Please make sure you input necessary files.");
  else {
    let document;
    // Load glb as document
    document = await io.readBinary(modelUint8Array);

    // Load Texture
    const texture1 = document
      .createTexture("myTexture")
      .setImage(textureUint8Array)
      .setMimeType("image/png");

    const material = document
      .createMaterial("Loaded")
      // .setExtension('KHR_materials_unlit', true)
      .setBaseColorTexture(texture1);

    const nodes = document.getRoot().listNodes();
    nodes.forEach((node, idx) => {
      const mesh = node.getMesh();
      mesh.listPrimitives().forEach((primitive, index) => {
        primitive.setMaterial(material);
      });
    });
    // const nodes2 = document.listNodes()

    // Write.
    // await io.write("newmodel.glb", document); // → void
    const resultBinary = await io.writeBinary(document); // Document → Uint8Array

    const blob = new Blob([resultBinary], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const downloadLink = window.document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "Result.glb";

    window.document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up
    window.document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }
}

const handleInputModel = (e) => {
  if (e.target.files.length) {
    const file = e.target.files[0];
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const modelArrayBuffer = reader.result;
        modelUint8Array = new Uint8Array(modelArrayBuffer);
        console.log("model", modelUint8Array);
        resolve(modelUint8Array);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  } else window.alert("You should input model.");
};

const handleInputTexture = (e) => {
  if (e.target.files.length) {
    const file = e.target.files[0];
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const textureArrayBuffer = reader.result;
        textureUint8Array = new Uint8Array(textureArrayBuffer);
        resolve(textureUint8Array);
        console.log("texture", textureUint8Array);
      };

      reader.onerror = reject;

      reader.readAsArrayBuffer(file);
    });
  } else window.alert("You should input texture");
};

function App() {
  return (
    <div className="App">
      <div className="input-container">
        <label htmlFor="fileInput1">Select Model:</label>
        <input
          type="file"
          id="fileInput1"
          name="fileInput1"
          accept=".glb"
          onChange={handleInputModel}
        />
      </div>
      <div className="input-container">
        <label htmlFor="fileInput2">Select Texture:</label>
        <input
          type="file"
          id="fileInput2"
          name="fileInput2"
          accept=".jpg, jpeg, .webp, .png"
          onChange={handleInputTexture}
        />
      </div>
      <div download-container>
        <button id="downloadButton" onClick={convertGlb}>
          Download
        </button>
      </div>
    </div>
  );
}

export default App;
