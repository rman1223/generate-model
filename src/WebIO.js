import { WebIO } from "@gltf-transform/core";
import fs from "io:fs";
const io = new WebIO({ credentials: "include" });

// Read.
let document;
document = await io.read("model.glb"); // → Document
document = await io.readBinary(glb); // Uint8Array → Document

// Write.
const glb = await io.writeBinary(document); // Document → Uint8Array

async function convertGlb() {
  let document;
  // Load glb as document
  document = await io.read("cube/Cube-withoutmaterial.glb"); // → Document
  // document = await io.readBinary(glb);   // Uint8Array → Document

  // Load Texture
  const texture1 = document
    .createTexture("myTexture")
    .setImage(fs.readFileSync("cube/Cube_BaseColor.png"))
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
  await io.write("newmodel.glb", document); // → void
  // const glb = await io.writeBinary(document); // Document → Uint8Array
}
