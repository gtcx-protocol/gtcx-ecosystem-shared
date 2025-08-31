# GCTX Production Prototype Plan
## Military-Grade UI with Vercel + Cursor + Tailwind

---

## 🚀 **Production Stack: The Bloomberg Terminal Experience**

### **Core Technology Foundation**
```bash
# Next.js 14 + TypeScript for maximum performance
npx create-next-app@latest gctx-prototype --typescript --tailwind --app
cd gctx-prototype

# Essential dependencies for military-grade UI
npm install @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio
npm install framer-motion lucide-react @headlessui/react
npm install @next/font class-variance-authority clsx tailwind-merge
npm install recharts @vercel/analytics @vercel/og
```

### **Military-Grade Design System**
```typescript
// tailwind.config.js - Bloomberg/BlackRock inspired palette
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Military command center palette
        command: {
          50: '#f0fdf4',
          900: '#0a0a0a',
          950: '#020617'
        },
        // Terminal green (like Bloomberg)
        terminal: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2'
        },
        // Critical alerts
        threat: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'system-ui']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      }
    }
  }
}
```

---

## 🎨 **Component Library Strategy: The Design System That Scales**

### **Option 1: shadcn/ui + Custom Military Theme (RECOMMENDED)**

**Why This Wins**:
- **Enterprise-grade components** out of the box
- **Full customization** - we control every pixel
- **Copy-paste workflow** - perfect for Cursor AI assistance
- **Consistent with modern standards** - used by Vercel, Linear, etc.

```bash
# Setup shadcn/ui with dark military theme
npx shadcn-ui@latest init

# Install core components
npx shadcn-ui@latest add button card dialog input label
npx shadcn-ui@latest add sheet toast alert-dialog badge
npx shadcn-ui@latest add command navigation-menu tabs
```

**Custom Military Theme Setup**:
```typescript
// components/ui/theme.ts
export const militaryTheme = {
  background: 'bg-gray-950',
  card: 'bg-gray-900/50 backdrop-blur-sm border-gray-800',
  button: {
    primary: 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700',
    secondary: 'bg-gray-800 hover:bg-gray-700 border-gray-700',
    ghost: 'hover:bg-gray-800/50'
  },
  text: {
    primary: 'text-white',
    secondary: 'text-gray-400',
    accent: 'text-emerald-400'
  }
}
```

### **Option 2: Headless UI + Custom Components**

**For Maximum Control**:
```typescript
// lib/components/core/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700',
        military: 'bg-gray-900 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10',
        ghost: 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-6',
        lg: 'h-14 px-8 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)
```

---

## 📁 **Project Structure: Enterprise-Grade Organization**

```
gctx-prototype/
├── app/                          # Next.js 14 app directory
│   ├── (dashboard)/             # Dashboard layouts
│   │   ├── overview/           
│   │   ├── telegram/           
│   │   └── stakeholders/       
│   ├── globals.css             # Tailwind + custom military styles
│   └── layout.tsx              # Root layout with theme
├── components/                   # Component library
│   ├── ui/                     # shadcn/ui base components
│   │   ├── button.tsx         
│   │   ├── card.tsx           
│   │   └── ...                
│   ├── gctx/                   # GCTX-specific components
│   │   ├── TelegramTerminal.tsx
│   │   ├── MetricsHUD.tsx     
│   │   ├── StakeholderCard.tsx 
│   │   └── CommandCenter.tsx   
│   └── layout/                 # Layout components
│       ├── Header.tsx         
│       ├── Navigation.tsx     
│       └── Sidebar.tsx        
├── lib/                        # Utilities and configs
│   ├── utils.ts               # cn() utility and helpers
│   ├── constants.ts           # App constants and config
│   └── types.ts               # TypeScript definitions
├── styles/                     # Custom styles
│   ├── military.css           # Military theme styles
│   └── animations.css         # Custom animations
└── public/                     # Static assets
    ├── logos/                 
    └── images/                
```

---

## 🛠️ **Cursor AI Development Workflow**

### **1. Component Generation with Cursor**

**Perfect Cursor Prompts for GCTX Components**:

```
Create a military-grade dashboard header component for GCTX using:
- Next.js 14 + TypeScript
- Tailwind CSS with dark theme (bg-gray-950, text-white)
- Real-time metrics display (users, volume, health, TPS)
- Bloomberg terminal aesthetic with subtle animations
- shadcn/ui components where applicable
- Lucide React icons
- Responsive design for mobile and desktop

Component should include:
- Logo with animated status indicator
- Live metrics counter with number formatting
- Navigation breadcrumbs
- User status indicator
- Search command palette trigger
```

### **2. Rapid Page Development**

```
Build a Telegram terminal interface page for GCTX using:
- Full-height layout with terminal aesthetic
- Real-time message simulation
- Military command center styling
- Stakeholder selection interface
- Live typing indicators
- Message encryption status
- Export to PDF functionality

Use the military color palette:
- Background: bg-gray-950
- Cards: bg-gray-900/50 with backdrop-blur
- Accents: emerald-500, cyan-500, amber-500
- Borders: gray-800
- Text: white primary, gray-400 secondary
```

### **3. Animation and Polish**

```
Add sophisticated animations to GCTX components:
- Framer Motion for page transitions
- Number counting animations for metrics
- Pulse animations for status indicators
- Hover effects for interactive elements
- Loading states with military aesthetics
- Smooth transitions between views

Focus on performance - animations should be 60fps
Use transform and opacity for GPU acceleration
Include prefers-reduced-motion support
```

---

## 🎯 **Development Sprint Plan: 72 Hours to Demo**

### **Day 1: Foundation (8 hours)**
```
Morning (4 hours):
├── Next.js 14 setup with TypeScript
├── Tailwind + shadcn/ui configuration
├── Military theme implementation
└── Basic routing structure

Afternoon (4 hours):
├── Core component library
├── Header with live metrics
├── Navigation system
└── First page (Overview) implementation
```

### **Day 2: Core Features (8 hours)**
```
Morning (4 hours):
├── Telegram terminal interface
├── Stakeholder selection system
├── Message simulation system
└── Real-time typing effects

Afternoon (4 hours):
├── Government dashboard
├── Network node visualization
├── Metrics and charts
└── Interactive demo flows
```

### **Day 3: Polish & Deploy (8 hours)**
```
Morning (4 hours):
├── Animations and micro-interactions
├── Mobile responsiveness
├── Performance optimization
└── Accessibility improvements

Afternoon (4 hours):
├── Vercel deployment setup
├── Domain configuration
├── Analytics integration
└── Final testing and refinement
```

---

## 🚀 **Vercel Deployment Strategy**

### **Instant Preview URLs**
```bash
# Deploy to Vercel from Cursor terminal
npm install -g vercel
vercel --prod

# Result: https://gctx-prototype.vercel.app
# Custom domain: https://demo.gctx.io (if available)
```

### **Environment Configuration**
```typescript
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/**/*.{js,ts,tsx}": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### **Performance Optimization**
```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['demo.gctx.io']
  },
  compress: true,
  poweredByHeader: false
}
```

---

## 📚 **Component Library Scaling Strategy**

### **Phase 1: Core Components (Week 1)**
```
✅ Essential UI components
├── Button (all variants)
├── Card (dashboard style)
├── Input (terminal style)
├── Badge (status indicators)
└── Dialog (command modals)
```

### **Phase 2: GCTX Components (Week 2)**
```
✅ Domain-specific components
├── TelegramTerminal
├── MetricsHUD
├── StakeholderCard
├── CommandCenter
└── GovernmentDashboard
```

### **Phase 3: Advanced Features (Week 3)**
```
✅ Complex interactions
├── Interactive charts
├── Real-time updates
├── Animation library
├── Mobile components
└── Accessibility suite
```

### **Cross-App Consistency Strategy**
```typescript
// packages/gctx-ui/package.json
{
  "name": "@gctx/ui",
  "private": true,
  "exports": {
    "./components": "./src/components/index.ts",
    "./styles": "./src/styles/index.css",
    "./theme": "./src/theme/index.ts"
  }
}

// Import in any GCTX app:
import { Button, Card, MetricsHUD } from '@gctx/ui/components'
import '@gctx/ui/styles'
```

---

## 🎭 **The John Thompson Demo Experience**

### **Landing Experience**
```
URL: https://demo.gctx.io
↓
Immediate "Holy Shit" moment:
├── Military command center loads in <1 second
├── Live metrics counting up in real-time
├── "INITIATE DEMO PROTOCOL" button pulses
└── Background: Subtle matrix-like animation
```

### **Demo Flow**
```
1. Click "INITIATE DEMO" → Smooth transition to terminal
2. Select "Government Official" → Personalized experience begins
3. Watch automated verification flow → Real-time simulation
4. See network effects in action → Live stakeholder updates
5. View sovereign dashboard → Government metrics
```

### **Technical Wow Factors**
```
🔥 Sub-second page transitions
🔥 60fps animations throughout
🔥 Real-time metric updates
🔥 Responsive across all devices
🔥 Accessible keyboard navigation
🔥 Dark mode that doesn't hurt eyes
```

---

## 🚀 **Immediate Next Steps**

### **Ready to Start?** Here's your 30-minute setup:

1. **Initialize the project**:
```bash
npx create-next-app@latest gctx-prototype --typescript --tailwind --app
cd gctx-prototype
```

2. **Install the military-grade stack**:
```bash
npm install @tailwindcss/typography framer-motion lucide-react @headlessui/react
npx shadcn-ui@latest init
```

3. **Open in Cursor** and use these exact prompts:
```
"Create a military-grade dark theme landing page for GCTX using Next.js 14, TypeScript, and Tailwind CSS. Style should be Bloomberg terminal meets BlackRock with live metrics HUD."
```

4. **Deploy immediately**:
```bash
npx vercel --prod
```

**Result**: John Thompson gets a URL he can visit in 30 minutes, and we iterate from there.

**Ready to build the demo that makes John Thompson say "This is the future of trust infrastructure"?** 🚀