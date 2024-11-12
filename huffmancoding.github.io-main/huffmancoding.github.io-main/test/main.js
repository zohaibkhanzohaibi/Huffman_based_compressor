class Node {
    constructor(symbol, freq, left = null, right = null) {
      this.symbol = symbol;
      this.freq = freq;
      this.left = left;
      this.right = right;
    }
  }
  
  // Color Quantization by reducing each RGB component to nearest multiple of 64
  function quantizeColors(data) {
    return data.map(value => Math.floor(value / 64) * 64);
  }
  
  // Reverse Quantization by adding 32 (approximation of original values)
  function reverseQuantizeColors(data) {
    return data.map(value => value + 32);
  }
  
  // Divide Image into Blocks
  function divideIntoBlocks(data, blockSize = 4) {
    const blocks = [];
    for (let i = 0; i < data.length; i += blockSize * 4) {
      blocks.push(data.slice(i, i + blockSize * 4).toString());
    }
    return blocks;
  }
  
  // Build Huffman Tree from Frequency Map
  function buildHuffmanTree(freqMap) {
    const nodes = Object.entries(freqMap).map(([symbol, freq]) => new Node(symbol, freq));
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.freq - b.freq);
      const left = nodes.shift();
      const right = nodes.shift();
      const newNode = new Node(null, left.freq + right.freq, left, right);
      nodes.push(newNode);
    }
    return nodes[0];
  }
  
  // Generate Huffman Codes from Tree
  function generateCodes(node, code = "", codes = {}) {
    if (node.symbol !== null) {
      codes[node.symbol] = code;
    } else {
      generateCodes(node.left, code + "0", codes);
      generateCodes(node.right, code + "1", codes);
    }
    return codes;
  }
  
  // Invert Huffman Codes for Decoding
  function invertCodes(codes) {
    const invertedCodes = {};
    for (const key in codes) {
      invertedCodes[codes[key]] = key;
    }
    return invertedCodes;
  }
  
  // Compress Image Function
  async function compressImage() {
    const uploadInput = document.getElementById('upload');
    if (!uploadInput.files[0]) return alert("Please select an image.");
  
    const image = await createImageBitmap(uploadInput.files[0]);
    const canvas = document.getElementById("originalCanvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
    // Get image data
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = Array.from(imgData.data);
  
    // Step 1: Quantize Colors
    const quantizedData = quantizeColors(pixelData);
  
    // Step 2: Divide into Blocks
    const blocks = divideIntoBlocks(quantizedData);
  
    // Step 3: Build Frequency Map for Huffman Encoding
    const freqMap = blocks.reduce((acc, block) => {
      acc[block] = (acc[block] || 0) + 1;
      return acc;
    }, {});
  
    // Step 4: Huffman Encoding
    const huffmanTree = buildHuffmanTree(freqMap);
    const huffmanCodes = generateCodes(huffmanTree);
    const encodedData = blocks.map(block => huffmanCodes[block]).join("");
  
    // Convert binary string to bytes
    const binaryArray = new Uint8Array(Math.ceil(encodedData.length / 8));
    for (let i = 0; i < encodedData.length; i += 8) {
      binaryArray[i / 8] = parseInt(encodedData.slice(i, i + 8).padEnd(8, '0'), 2);
    }
  
    // Store Huffman tree and encoded data in an ArrayBuffer for download
    const blob = new Blob([JSON.stringify({ huffmanTree, encodedData })], { type: "application/octet-stream" });
    const compressedLink = document.getElementById("downloadCompressedLink");
    compressedLink.href = URL.createObjectURL(blob);
    compressedLink.download = "compressed.huff";
    compressedLink.style.display = "inline";
    compressedLink.innerText = "Download Compressed File";
  }
  
  // Decompress Image Function
  function decompressImage() {
    const compressedFileInput = document.getElementById('compressedFile');
    if (!compressedFileInput.files[0]) return alert("Please select a compressed file.");
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const { huffmanTree, encodedData } = JSON.parse(e.target.result);
  
      // Invert Huffman Codes
      const codes = generateCodes(huffmanTree);
      const invertedCodes = invertCodes(codes);
  
      // Decode compressed data to blocks
      let buffer = "";
      const blocks = [];
      for (const bit of encodedData) {
        buffer += bit;
        if (invertedCodes[buffer]) {
          blocks.push(invertedCodes[buffer]);
          buffer = "";
        }
      }
  
      // Reconstruct image data with reversed quantization
      let decompressedData = [];
      blocks.forEach(block => {
        const quantizedBlock = block.split(',').map(Number);
        const originalBlock = reverseQuantizeColors(quantizedBlock);
        decompressedData = decompressedData.concat(originalBlock);
      });
  
      // Draw decompressed image on canvas
      const canvas = document.getElementById("decompressedCanvas");
      const ctx = canvas.getContext("2d");
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      imgData.data.set(new Uint8ClampedArray(decompressedData));
      ctx.putImageData(imgData, 0, 0);
  
      // Create downloadable link for decompressed image
      canvas.toBlob((blob) => {
        const link = document.getElementById("downloadDecompressedLink");
        link.href = URL.createObjectURL(blob);
        link.download = "decompressed_image.png";
        link.style.display = "inline";
        link.innerText = "Download Decompressed Image";
      });
    };
    reader.readAsText(compressedFileInput.files[0]);
  }