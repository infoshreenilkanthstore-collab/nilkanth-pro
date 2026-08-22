const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Read the SVG created earlier
const svgPath = path.join(__dirname, '../nilkanthdham_qr.svg');
const svg = fs.readFileSync(svgPath, 'utf8');

// The QR code matrix size
const size = 25;
const quiet = 2; // quiet zone in modules
const scale = 20; // pixels per module (580px total)
const imgSize = (size + quiet * 2) * scale;

// Create 2D array for modules (0 = white, 1 = black)
const grid = Array.from({ length: size }, () => new Array(size).fill(0));

// Parse paths from SVG d attribute
const blackPathMatch = svg.match(/fill="#000000" d="([^"]+)"/);
if (blackPathMatch) {
  const d = blackPathMatch[1];
  const items = d.split(/(?=M)/);
  for (const item of items) {
    const m = item.match(/M\s*(\d+)[,\s]+(\d+)\s*h(\d+)\s*v(\d+)/i);
    if (m) {
      const x = parseInt(m[1], 10);
      const y = parseInt(m[2], 10);
      const w = parseInt(m[3], 10);
      const h = parseInt(m[4], 10);
      for (let r = y; r < y + h; r++) {
        for (let c = x; c < x + w; c++) {
          if (r < size && c < size) {
            grid[r][c] = 1;
          }
        }
      }
    }
  }
}

// Generate raw PNG bytes
const width = imgSize;
const height = imgSize;

const rowBytes = 1 + width * 3;
const buffer = Buffer.alloc(height * rowBytes);

for (let y = 0; y < height; y++) {
  const offset = y * rowBytes;
  buffer[offset] = 0; // Filter type 0 (None)
  
  const modY = Math.floor(y / scale) - quiet;
  
  for (let x = 0; x < width; x++) {
    const modX = Math.floor(x / scale) - quiet;
    let isBlack = false;
    
    if (modY >= 0 && modY < size && modX >= 0 && modX < size) {
      if (grid[modY][modX] === 1) {
        isBlack = true;
      }
    }
    
    const pixelOffset = offset + 1 + x * 3;
    if (isBlack) {
      buffer[pixelOffset] = 0;     // R
      buffer[pixelOffset + 1] = 0; // G
      buffer[pixelOffset + 2] = 0; // B
    } else {
      buffer[pixelOffset] = 255;     // R
      buffer[pixelOffset + 1] = 255; // G
      buffer[pixelOffset + 2] = 255; // B
    }
  }
}

// Compress data with zlib
const compressedData = zlib.deflateSync(buffer);

// Helper for CRC32
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(typeAndData);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([lenBuf, typeAndData, crcBuf]);
}

// PNG Signature
const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

// IHDR Chunk
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8; // Bit depth: 8
ihdr[9] = 2; // Color type: 2 (Truecolor RGB)
ihdr[10] = 0; // Compression method
ihdr[11] = 0; // Filter method
ihdr[12] = 0; // Interlace method

const ihdrChunk = makeChunk('IHDR', ihdr);
const idatChunk = makeChunk('IDAT', compressedData);
const iendChunk = makeChunk('IEND', Buffer.alloc(0));

const pngFile = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);

const outputPath = path.join(__dirname, '../nilkanthdham_qr.png');
fs.writeFileSync(outputPath, pngFile);
console.log('SUCCESS: nilkanthdham_qr.png generated at ' + outputPath + ' (' + pngFile.length + ' bytes, ' + width + 'x' + height + 'px)');
