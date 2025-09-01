# TradePass™ Identity App - Step-by-Step Cursor + Claude Build
## Digital Identity Management for Ghana Mining Operations

---

## 🎯 **What We're Building - TradePass™**

**TradePass™** is the digital identity and credentials management system that works with your GeoTag app:

### **Core Features:**
- 🆔 **Self-sovereign digital identities** for miners, inspectors, government officials  
- 📜 **Verifiable credentials** for mining roles and certifications
- 🔐 **Biometric authentication** with fingerprint/face ID
- 🏛️ **Government ID integration** (Ghana Card verification)
- 📱 **PWA + Mobile** for universal access
- 🔄 **Offline-first** with intelligent sync
- 🛡️ **Cryptographic security** with tamper-proof credentials

### **Technology Stack:**
- **Frontend**: Next.js 14 PWA (works like mobile app)
- **Identity**: W3C DIDs + Verifiable Credentials  
- **Auth**: WebAuthn (biometric) + PIN fallback
- **Storage**: IndexedDB (offline) + cloud sync
- **Crypto**: Noble cryptography libraries
- **Integration**: Links with your GeoTag app

---

## 📋 **STEP 1: Create TradePass Project (3 minutes)**

### **1.1 Open New Cursor Window**
- **File → New Window** in Cursor
- Navigate to your projects directory (same level as geotag-mobile)

### **1.2 Create Next.js PWA Project**
```bash
npx create-next-app@latest tradepass-identity --typescript --tailwind --eslint --app --src-dir
```

**Wait for:** "Success! Created tradepass-identity"

### **1.3 Navigate and Open**
```bash
cd tradepass-identity
```

Then **File → Open Folder** → Select `tradepass-identity`

### **1.4 Install Identity & Crypto Dependencies**
```bash
npm install @web5/dids @web5/credentials @web5/common
npm install @noble/ed25519 @noble/secp256k1 @noble/hashes
npm install idb zustand @radix-ui/react-dialog @radix-ui/react-tabs
npm install lucide-react class-variance-authority clsx tailwind-merge
```

---

## 📋 **STEP 2: Generate Core Identity Components with Cursor AI**

### **2.1 Ask Cursor to Generate Identity System**

1. **Open Cursor Chat** (Ctrl+Shift+P → "Cursor: Chat")
2. **Paste this prompt:**

```
Create a complete TradePass™ digital identity system for Ghana mining operations. This is a PWA that manages verifiable credentials and integrates with government IDs.

GENERATE THESE COMPONENTS:

1. **Identity Creation Flow** - Multi-step onboarding
2. **Credential Wallet** - Display and manage mining credentials  
3. **Biometric Authentication** - WebAuthn + PIN fallback
4. **Government ID Integration** - Ghana Card verification
5. **Credential Verification** - QR codes and cryptographic proofs

TECHNICAL REQUIREMENTS:
- Next.js 14 with TypeScript
- W3C DIDs and Verifiable Credentials
- WebAuthn for biometric auth
- IndexedDB for offline storage
- PWA capabilities (works like mobile app)
- Ghana government branding (gold, green colors)
- Touch-friendly for tablets and phones

SPECIFIC FILES NEEDED:
- src/components/identity/IdentityCreation.tsx
- src/components/wallet/CredentialWallet.tsx  
- src/components/auth/BiometricAuth.tsx
- src/components/verification/CredentialVerifier.tsx
- src/lib/identity/did-manager.ts
- src/lib/storage/credential-storage.ts

Include TypeScript interfaces and complete implementations.
```

### **2.2 Let Cursor Generate Initial Components**
Cursor will create multiple files. **Accept all suggestions** and let it generate the foundation.

---

## 📋 **STEP 3: Create Identity Management System**

### **3.1 Generate DID Management System**

**Ask Cursor Chat:**
```
Create a complete DID (Decentralized Identifier) management system for TradePass™.

REQUIREMENTS:
- Generate and manage Ed25519 DIDs for users
- Create verifiable credentials for mining roles
- Store credentials securely in IndexedDB
- Generate cryptographic proofs
- Export/import credential data
- Offline-first with sync capabilities

FILES TO CREATE:
- src/lib/identity/did-manager.ts (DID creation and management)
- src/lib/credentials/credential-manager.ts (