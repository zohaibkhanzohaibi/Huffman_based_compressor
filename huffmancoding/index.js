document.getElementById('back-button').addEventListener('click', function () {
    document.getElementById('nav-layout').style.display = 'block';
    document.getElementById('encoded-text').style.display = 'none';
    document.getElementById('encoded-codes').style.display = 'none';
    document.getElementById('text-layout').style.display = 'none';
    document.getElementById('file-layout').style.display = 'none';
    document.getElementById('image-layout').style.display = 'none';
});
document.getElementById('text-encoding-button').addEventListener('click', function () {
    document.getElementById('text-layout').style.display = 'block';
    document.getElementById('file-layout').style.display = 'none';
    document.getElementById('image-layout').style.display = 'none';
    document.getElementById('nav-layout').style.display = 'none';
    document.getElementById('text-input').value=null;
});
document.getElementById('text-encode-button').addEventListener('click', function () {
    document.getElementById('encoded-text').style.display = 'block';
    document.getElementById('encoded-codes').style.display = 'block';

});
document.getElementById('file-upload-button').addEventListener('click', function () {
    document.getElementById('text-layout').style.display = 'none';
    document.getElementById('file-layout').style.display = 'block';
    document.getElementById('image-layout').style.display = 'none';
    document.getElementById('nav-layout').style.display = 'none';
    document.getElementById('file-decode-button').style.display = 'block';
});
document.getElementById('image-compression-button').addEventListener('click', function () {
    document.getElementById('text-layout').style.display = 'none';
    document.getElementById('file-layout').style.display = 'none';
    document.getElementById('image-layout').style.display = 'block';
    document.getElementById('nav-layout').style.display = 'none';
});
document.getElementById('file-encode-button').addEventListener('click', function () {
    document.getElementById('download-encoded-file').style.display = 'block';
    document.getElementById('compression-ratio').style.display = 'block';
    document.getElementById('download-decoded-file').style.display = 'none';
});
document.getElementById('file-decode-button').addEventListener('click', function () {
    document.getElementById('download-encoded-file').style.display = 'none';
    document.getElementById('compression-ratio').style.display = 'none';
    document.getElementById('download-decoded-file').style.display = 'block';
});
document.getElementById('image-encode-button').addEventListener('click', function () {
    document.getElementById('download-encoded-image').style.display = 'block';
    document.getElementById('image-compression-ratio').style.display = 'block';
});




document.getElementById('text-encode-button').addEventListener('click', function () {
    const textInput = document.getElementById('text-input').value;
    encodeText(textInput);
});

// Function to calculate the frequency of each character in the text
function calculateFrequency(text) {
    const frequency = {};
    for (const char of text) {
        frequency[char] = (frequency[char] || 0) + 1;
    }
    return frequency;
}

// Function to build the Huffman Tree
function buildHuffmanTree(frequency) {
    const heap = Object.keys(frequency).map(char => ({
        char,
        freq: frequency[char],
        left: null,
        right: null
    }));

    // Convert array to a min-heap
    heap.sort((a, b) => a.freq - b.freq);

    while (heap.length > 1) {
        const left = heap.shift();
        const right = heap.shift();

        const newNode = {
            char: null,
            freq: left.freq + right.freq,
            left,
            right
        };

        // Insert the new node back into the heap
        heap.push(newNode);
        heap.sort((a, b) => a.freq - b.freq); // Maintain the min-heap property
    }

    return heap[0]; // The root node of the Huffman tree
}

// Function to generate the Huffman codes from the tree
function generateHuffmanCodes(node, prefix = "", codes = {}) {
    if (node.char !== null) {
        // If it's a leaf node, store the code
        codes[node.char] = prefix;
    } else {
        // Otherwise, recurse on the left and right subtrees
        if (node.left) generateHuffmanCodes(node.left, prefix + "0", codes);
        if (node.right) generateHuffmanCodes(node.right, prefix + "1", codes);
    }
    return codes;
}

// Function to encode text using Huffman coding
function encodeText(text) {
    const frequency = calculateFrequency(text); // Step 1: Calculate frequency of characters
    const huffmanTree = buildHuffmanTree(frequency); // Step 2: Build the Huffman tree
    const huffmanCodes = generateHuffmanCodes(huffmanTree); // Step 3: Generate Huffman codes

    // Step 4: Encode the text using the generated Huffman codes
    let encodedText = "";
    for (const char of text) {
        encodedText += huffmanCodes[char];
    }

    // Log encoded text for debugging
    console.log("Encoded Text:", encodedText);

    // Display the encoded text and Huffman codes in the textarea
    document.getElementById('encoded-text').value = encodedText; // Display the encoded text
    document.getElementById('encoded-codes').value = JSON.stringify(huffmanCodes, null, 2); // Format and display Huffman codes
}
//let text;
let jsonString;
// Event listener for the encode button
document.getElementById('file-encode-button').addEventListener('click', function () {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file && file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = function (e) {
            const textContent = e.target.result;
            const { encodedText, huffmanCode } = encodeText2(textContent);
           // text = encodedText;  // Huffman encoded text

            // Save the huffmanCode in localStorage for later use during decoding
          //  localStorage.setItem("huffmanCode", JSON.stringify(huffmanCode));

            // Create an object that contains both the Huffman codes and the encoded text
            const encodedData = {
                encodedText,
                huffmanCode
            }
console.log(encodedData);
            // Convert to a JSON string for storage in a file
             jsonString = JSON.stringify(encodedData);

            // Use the downloadFile function to download the encoded file
           

            displayCompressionInfo(file.size, encodedText.length);  // Display compression info
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a .txt file to encode');
    }
});

document.getElementById('download-encoded-file').addEventListener('click',function(){
    downloadFile(jsonString, '.huff', 'encoded-file.huff');
});
let decodedText;
// Event listener for the decode button
document.getElementById('file-decode-button').addEventListener('click', function () {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    
    // Check if the file has the .huff extension
    if (file && file.name.endsWith('.huff')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileContent = e.target.result;
            try {
                // Parse the file content, which is JSON containing both the encoded text and Huffman codes
                const encodedData = JSON.parse(fileContent);
                 console.log(encodedData);

                // Get the encoded text and Huffman codes
                const encodedText = encodedData.encodedText;
                const huffmanCodes = encodedData.huffmanCode;

                // Decode the Huffman encoded text
                decodedText = decodeHuffman(encodedText, huffmanCodes);

                // Download the decoded text as a .txt file
               
            } catch (error) {
                alert('Error reading or parsing the .huff file.');
            }
        };

        reader.readAsText(file);
    } else {
        alert('Please upload a .huff file to decode');
    }
});
document.getElementById('download-decoded-file').addEventListener('click',function(){
    downloadFile(decodedText, '.txt', 'decoded-file.txt');
});


// Function to calculate the frequency of each character in the text


// Function to build the Huffman Tree


// Function to generate the Huffman codes from the tree


// Function to encode text using Huffman coding
function encodeText2(text) {
    const frequency = calculateFrequency(text); // Step 1: Calculate frequency of characters
    const huffmanTree = buildHuffmanTree(frequency); // Step 2: Build the Huffman tree
    const huffmanCode = generateHuffmanCodes(huffmanTree); // Step 3: Generate Huffman codes

    // Step 4: Encode the text using the generated Huffman codes
    let encodedText = "";
    for (const char of text) {
        encodedText += huffmanCode[char];
    }

    return {
        encodedText,
        huffmanCode
    };
}

// Function to decode Huffman encoded text
function decodeHuffman(encodedText, huffmanCodes) {
    let decodedText = '';
    let currentCode = '';

    // Reverse the huffmanCodes object to lookup char by code
    const reversedCodes = Object.fromEntries(Object.entries(huffmanCodes).map(([k, v]) => [v, k]));

    // Decode the encoded text using the reversed Huffman codes
    for (const bit of encodedText) {
        currentCode += bit;
        if (reversedCodes[currentCode]) {
            decodedText += reversedCodes[currentCode];
            currentCode = '';
        }
    }

    return decodedText;
}

// Display compression info (original vs compressed size)
// Display compression info (original vs compressed size)
function displayCompressionInfo(originalSize, compressedSize) {
    // Make sure the elements exist before trying to update them
    const originalElement = document.getElementById('original');
    const compressedElement = document.getElementById('compressed');
    const compressionRatioElement = document.getElementById('compression-ratio-value');

    if (originalElement && compressedElement && compressionRatioElement) {
        const compressionRatio = ((compressedSize / originalSize) * 100).toFixed(2);

        // Display the compression info
        document.getElementById('compression-ratio').style.display = 'block';
        originalElement.textContent = (originalSize / 1024).toFixed(2) + " KB";
        compressedElement.textContent = (compressedSize / 1024).toFixed(2) + " KB";
        compressionRatioElement.textContent = compressionRatio + "%";
    } else {
        console.error("Error: One or more required elements are missing in the DOM.");
    }
}


// Function to trigger file download
function downloadFile(content, extension, filename) {
    const blob = new Blob([content], { type: extension === '.huff' ? 'application/octet-stream' : 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}



document.getElementById('image-encode-button').addEventListener('click', function() {
    document.getElementById('download-encoded-image').style.display = 'block';
    document.getElementById('image-compression-ratio').style.display = 'block';

    class Node {
        constructor(symbol, freq, left = null, right = null) {
            this.symbol = symbol;
            this.freq = freq;
            this.left = left;
            this.right = right;
        }
    }

    // Quantize colors: Reduces color precision for compression
    function quantizeColors(data) {
        return data.map(value => Math.floor(value / 64) * 64);
    }

    // Reverse quantization (approximate color recovery)
    function reverseQuantizeColors(data) {
        return data.map(value => value + 32); // Approximate original value
    }

    // Divide the image data into blocks for compression
    function divideIntoBlocks(data, blockSize = 4) {
        const blocks = [];
        for (let i = 0; i < data.length; i += blockSize * 4) {
            blocks.push(data.slice(i, i + blockSize * 4).join(''));
        }
        return blocks;
    }

    // Build Huffman Tree from frequency map
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

    // Generate Huffman codes from the tree
    function generateCodes(node, code = "", codes = {}) {
        if (node.symbol !== null) {
            codes[node.symbol] = code;
        } else {
            generateCodes(node.left, code + "0", codes);
            generateCodes(node.right, code + "1", codes);
        }
        return codes;
    }

    // Invert the Huffman codes for decoding
    function invertCodes(codes) {
        const invertedCodes = {};
        for (const key in codes) {
            invertedCodes[codes[key]] = key;
        }
        return invertedCodes;
    }

    async function compressImage() {
        const uploadInput = document.getElementById('image-input');
        if (!uploadInput.files[0]) return alert("Please select an image.");

        try {
            // Load image into memory for processing
            const image = await createImageBitmap(uploadInput.files[0]);

            // Create a canvas to process image data
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext("2d");
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Get pixel data from canvas
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixelData = Array.from(imgData.data);

            // Step 1: Quantize colors
            const quantizedData = quantizeColors(pixelData);

            // Step 2: Divide data into blocks
            const blocks = divideIntoBlocks(quantizedData);

            // Step 3: Build frequency map for Huffman encoding
            const freqMap = blocks.reduce((acc, block) => {
                acc[block] = (acc[block] || 0) + 1;
                return acc;
            }, {});

            // Step 4: Build Huffman tree and generate codes
            const huffmanTree = buildHuffmanTree(freqMap);
            const huffmanCodes = generateCodes(huffmanTree);
            const encodedData = blocks.map(block => huffmanCodes[block]).join("");

            // Step 5: Convert encoded data to binary format
            const binaryArray = new Uint8Array(Math.ceil(encodedData.length / 8));
            for (let i = 0; i < encodedData.length; i += 8) {
                binaryArray[i / 8] = parseInt(encodedData.slice(i, i + 8).padEnd(8, '0'), 2);
            }

            // Compress the image data
            const compressedData = { huffmanTree, encodedData };
            displayCompressionStats(pixelData.length, binaryArray.length);
            decompressImage(compressedData);
        } catch (error) {
            alert('Failed to load image. Please try again with a valid image.');
        }
    }

    // Display compression statistics
    function displayCompressionStats(originalSize, compressedSize) {
        const originalSizeKb = (originalSize / 1024).toFixed(2);
        const compressedSizeKb = (compressedSize / 1024).toFixed(2);
        const compressionRatio = (compressedSize / originalSize * 100).toFixed(2);

        document.getElementById('compressed2').textContent = `${compressedSizeKb}kb`;
        document.getElementById('original2').textContent = `${originalSizeKb}kb`;
        document.getElementById('compression-ratio-value2').textContent = `${compressionRatio}%`;
    }

    // Decompress image using the Huffman codes and tree
    function decompressImage(compressedData) {
        const { huffmanTree, encodedData } = compressedData;
    
        // Invert Huffman codes for decoding
        const codes = generateCodes(huffmanTree);
        const invertedCodes = invertCodes(codes);
    
        // Decode the encoded data back into blocks
        let buffer = "";
        const blocks = [];
        for (let i = 0; i < encodedData.length; i++) {
            buffer += encodedData[i];
            if (invertedCodes[buffer]) {
                blocks.push(invertedCodes[buffer]);
                buffer = "";
            }
        }
    
        // Reconstruct the image data with reversed quantization
        let decompressedData = [];
        blocks.forEach(block => {
            const quantizedBlock = block.split(',').map(Number);
            const originalBlock = reverseQuantizeColors(quantizedBlock);
            decompressedData = decompressedData.concat(originalBlock);
        });
    
        // Create a new canvas for the decompressed image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Ensure the canvas size matches the image dimensions
        canvas.width = Math.sqrt(decompressedData.length / 4);  // Assuming square aspect
        canvas.height = canvas.width;
    
        const imgData = ctx.createImageData(canvas.width, canvas.height);
        imgData.data.set(new Uint8ClampedArray(decompressedData));
        ctx.putImageData(imgData, 0, 0);
    
        // Create a downloadable link for the decompressed image
        canvas.toBlob((blob) => {
            // Make sure the link exists
            const link = document.getElementById("download-encoded-image");
            if (link) {
                // Set the link's href to the Blob URL and make it downloadable
                link.href = URL.createObjectURL(blob);
                link.download = "decompressed_image.png"; // Set file name
                link.style.display = "block"; // Ensure it's visible
                link.innerText = "Download Decompressed Image";
    
                // Optionally, trigger the download automatically
                // link.click();  // Uncomment this line to download immediately after decompression
            }
        }, 'image/png');  // Ensure the correct MIME type (e.g., 'image/png')
    }
    

    compressImage();
});




























