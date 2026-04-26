# Orig

**Your art. Invisibly signed.**

Orig is a creator-protection web app that lets independent artists invisibly sign images and PDFs, download protected copies, and later verify whether a file still carries its hidden Orig ownership signature.

Orig was built for **SJHacks Track 4: DIY Software**, focused on accessible and secure software for independent creatives.

---

## Why Orig?

Independent artists share their work online every day, but once a file is reposted, screenshotted, or separated from its original account, proving ownership becomes difficult. Existing watermarking tools are often visible, expensive, cloud-based, enterprise-focused, or too technical for everyday creators.

Orig solves this by providing:

- **Invisible ownership signatures**
- **No visible image watermark**
- **Browser-based signing and verification**
- **Simple drag-and-drop workflow**
- **Local artist profile**
- **Local signing registry**
- **Image and PDF support**

The proof travels with the file.

---

## Features

### Artist Profile

Artists can create a local profile containing:

- Display name or handle
- Unique artist ID
- Optional contact URL
- Optional copyright statement

This profile is used when signing files and is stored locally in the browser.

---

### Sign Images

Users can upload or drag in an image, and Orig embeds ownership data invisibly using LSB steganography.

The signed image:

- Downloads automatically as PNG
- Looks visually identical to the original
- Contains hidden ownership metadata
- Is logged in the signature registry

---

### Sign PDFs

Users can also sign PDF files. Orig embeds an Orig PDF marker and ownership payload into the PDF so the file can later be checked for hidden signature data.

---

### Verify Images and PDFs

Users can drag in a supported file and scan it for an Orig signature.

Orig can show:

- Your signature found
- Another artist’s signature found
- No Orig signature detected
- Signature found, but visual content may have changed

For images, Orig also uses a rotation-tolerant visual hash so normal rotation does not count as a content change, while obvious visual edits can still trigger a warning.

---

### Signature Registry

Every signed file can be saved in a registry with:

- Preview thumbnail
- Filename
- Signed timestamp
- Hash / signature record
- Re-verify action
- Download action when available

The registry supports:

- Filtering
- CSV export
- JSON export
- Removing entries
- Previewing signed files
- Re-downloading signed files
- Re-verifying signed files

---

### Local Privacy

Orig minimizes data exposure. Files are processed in the browser during signing and verification, and profile/registry data is stored locally.

The app stores:

- Artist profile
- Artist ID
- Signature registry
- Signed file references or registry metadata

Users can delete local Orig data from the Profile page.

---

## How It Works

Orig uses **LSB steganography** for image signing through the browser’s Canvas API.

Each image is made of pixels. Each pixel stores red, green, blue, and alpha color values. Orig modifies the least significant bit of the RGB values to hide signature data. These changes are visually imperceptible but can be read later by Orig.

### Image Signing Process

1. Image is loaded into an off-screen canvas.
2. Pixel data is extracted with `getImageData()`.
3. Ownership payload is serialized.
4. Payload bits are embedded into RGB least significant bits.
5. Modified pixel data is written back with `putImageData()`.
6. Canvas exports the signed image as PNG.
7. Signed PNG downloads locally.
8. A registry record is saved.

### Image Verification Process

1. Image is loaded into canvas.
2. Pixel data is extracted.
3. LSB data is decoded.
4. Orig attempts to deserialize a valid signature payload.
5. Artist ID is compared with the local profile.
6. A rotation-tolerant visual hash checks whether the image appears modified.
7. Result is displayed to the user.

### PDF Signing and Verification

For PDFs, Orig uses `pdf-lib` to embed an Orig signature marker and ownership payload into the PDF. Verification checks whether the PDF contains the Orig marker and signature data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Image Processing | HTML Canvas API |
| Image Signing | Custom LSB steganography |
| PDF Signing | pdf-lib |
| Hashing | Web Crypto API / SHA-256, visual hash logic |
| File Handling | File API, FileReader |
| Local Storage | localStorage |
| Database | SQLite |

---

## Pages

### `/registry`

Default landing page. Shows the local signature registry of signed files.

### `/sign`

Upload or drag an image or PDF to embed an invisible Orig signature and download a protected copy.

### `/verify`

Upload or drag an image or PDF to scan for an Orig signature.

### `/profile`

Create or update the local artist profile. Also includes the local data delete option.

### `/about`

Explains what Orig does, how invisible signing works, and what information gets embedded.

### `/privacy`

Explains Orig’s privacy model and what data is stored locally.

---

## Limitations

Orig is not DRM. It is a proof-of-ownership and verification layer.

Image signatures can be damaged or removed by:

- JPEG conversion
- Heavy recompression
- Cropping
- Resizing
- Screenshots
- Format conversion
- Aggressive image editing

Visual edit detection is best-effort. Orig can detect some obvious visual edits, but it is not a perfect forensic tool.

Large signed files may also exceed browser storage limits if the full signed file is saved into the local registry. Signing and downloading can still work even when registry storage is limited.

---

## Getting Started

### Prerequisites

Install Node.js and npm.

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
