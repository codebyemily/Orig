# Orig

**Your art. Invisibly signed.**

Orig is a local-first web app that lets independent artists embed invisible ownership signatures directly into image files. Artists can sign an image, download a visually identical PNG, and later verify whether a copy still carries the hidden Orig signature.

Orig was built for **SJHacks Track 4: DIY Software**, focused on accessible and secure software for independent creatives.

## Why Orig?

Independent artists often share work online without a reliable way to prove ownership if their art is stolen, reposted, or used without credit. Existing watermarking tools are often expensive, enterprise-focused, cloud-based, or too technical for everyday creators.

Orig solves this by providing:

- **Invisible ownership signatures**
- **No visible watermark**
- **No account**
- **No server upload**
- **No backend**
- **Local browser-only processing**

The proof lives inside the image file.

## Features

### Artist Profile

Artists can create a local profile containing:

- Display name or handle
- Unique browser-generated artist ID
- Optional contact URL
- Optional copyright statement

The profile is stored only in the browser using `localStorage`.

### Sign an Image

Users can upload or drag in an image, and Orig embeds ownership data invisibly using LSB steganography.

The signed output:

- Downloads automatically as PNG
- Looks visually identical to the original
- Contains hidden ownership metadata
- Is logged in the local signature registry

### Verify an Image

Users can drag in any image and scan it for an Orig signature.

Orig can show:

- Your signature found
- Another artist’s signature found
- No Orig signature detected
- Signature found but file may have been re-saved or processed

### Signature Registry

Every signed image is saved locally in a registry with:

- Preview thumbnail
- Filename
- Signed timestamp
- Image hash

The registry supports:

- Filtering
- CSV export
- JSON export
- Removing entries
- Previewing signed images
- Re-downloading signed images
- Re-verifying signed images

### Local Privacy

Orig does not upload user images or profile data. Everything runs in the browser through standard Web APIs.

The app stores only local browser data:

- Artist profile
- Artist ID
- Signature registry
- Signed image registry metadata

Users can delete all local Orig data from the Profile page.

## How It Works

Orig uses **LSB steganography** through the browser’s Canvas API.

Each image is made of pixels, and each pixel stores red, green, blue, and alpha color values. Orig modifies the least significant bit of the RGB values to hide signature data. These changes are visually imperceptible but can be read later by Orig.

Signing process:

1. Image is loaded into an off-screen canvas.
2. Pixel data is extracted with `getImageData()`.
3. Ownership payload is serialized.
4. Payload bits are embedded into RGB least significant bits.
5. Modified pixel data is written back with `putImageData()`.
6. Canvas exports the signed image as PNG.
7. Signed PNG downloads locally.

Verification process:

1. Image is loaded into canvas.
2. Pixel data is extracted.
3. LSB data is decoded.
4. Orig attempts to deserialize a valid signature payload.
5. Result is displayed to the user.

The PRD specifies this local Canvas-based signing and verification flow, with PNG output because PNG preserves the LSB data better than lossy formats like JPEG. :contentReference[oaicite:0]{index=0}

## Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Database:** SQLite
- **Styling:** Tailwind CSS
- **Image Processing:** HTML Canvas API
- **Steganography:** Custom LSB encoder and decoder
- **Hashing:** Web Crypto API / SHA-256
- **Storage:** localStorage
- **File Handling:** File API, FileReader, drag-and-drop
- **Deployment:**

Orig has no backend and no server-side image processing. The PRD defines the architecture as fully browser-local with no API routes used for user data. :contentReference[oaicite:1]{index=1}

## Pages

### `/registry`

Default landing page. Shows the local signature registry of signed images.

### `/sign`

Upload or drag an image to embed an invisible signature and download a signed PNG.

### `/verify`

Upload or drag an image to scan for an Orig signature.

### `/profile`

Create or update the local artist profile. Also includes the local data delete option.

### `/about`

Explains what Orig does, how invisible signing works, and what information gets embedded.

### `/privacy`

Explains Orig’s local-first privacy model.

## Limitations

Orig is not DRM. It is a local proof-of-ownership layer.

LSB signatures can be damaged or removed by:

- JPEG conversion
- Heavy recompression
- Cropping
- Resizing
- Screenshots
- Format conversion
- Aggressive image editing

Orig is designed to be a meaningful first line of defense, not an undefeatable protection system. The PRD explicitly requires this limitation to be disclosed clearly in the UI. :contentReference[oaicite:2]{index=2}

## Getting Started

### Prerequisites

Install Node.js and npm.

Recommended:

```bash
node -v
npm -v
```
Install Dependencies
```bash
npm install
```
Run Development Server
```bash
npm run dev
```
Open:
```bash
http://localhost:3000
```
Build
```bash
npm run build
```
## License
Built for SJHacks.
