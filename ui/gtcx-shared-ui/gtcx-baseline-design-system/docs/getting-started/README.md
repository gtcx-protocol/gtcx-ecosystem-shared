# 🚀 **Getting Started - Baseline CX**

> **Quick start guide for the world's most advanced enterprise design system** 🌍

[![GTCX Protocol](https://img.shields.io/badge/GTCX-Protocol-blue)](https://github.com/gtcx-protocol)
[![Design System](https://img.shields.io/badge/Design%20System-Baseline%20CX-brightgreen)](https://github.com/gtcx-protocol/gtcx-baseline-design-system)
[![Documentation](https://img.shields.io/badge/Documentation-Getting%20Started-brightgreen)](./README.md)

---

## 🌟 **Quick Start (5 minutes)**

### **1. Install Baseline CX**

```bash
# Install the design system
npm install @gtcx/baseline-cx

# Or with yarn
yarn add @gtcx/baseline-cx

# Or with pnpm
pnpm add @gtcx/baseline-cx
```

### **2. Import Components**

```typescript
// Import the components you need
import { Button, Card, Input, ThemeProvider } from '@gtcx/baseline-cx'

// Or import specific components for tree shaking
import Button from '@gtcx/baseline-cx/components/Button'
import Card from '@gtcx/baseline-cx/components/Card'
```

### **3. Use in Your App**

```tsx
import React from 'react'
import { Button, Card, Input, ThemeProvider } from '@gtcx/baseline-cx'

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Card>
          <h1>Welcome to Baseline CX</h1>
          <Input placeholder="Enter your name" />
          <Button variant="primary" size="lg">
            Get Started
          </Button>
        </Card>
      </div>
    </ThemeProvider>
  )
}

export default App
```

---

## 🎯 **Project Setup (30 minutes)**

### **1. Create New Project**

```bash
# Create a new Next.js project
npx create-next-app@latest my-baseline-app --typescript --tailwind --eslint

# Navigate to project
cd my-baseline-app

# Install Baseline CX
npm install @gtcx/baseline-cx
```

### **2. Configure TypeScript**

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### **3. Configure Tailwind CSS**

```javascript
// tailwind.config.js
const { baselineCX } = require('@gtcx/baseline-cx/tailwind')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      ...baselineCX.theme,
    },
  },
  plugins: [
    ...baselineCX.plugins,
  ],
}
```

### **4. Set Up Theme Provider**

```tsx
// src/app/providers.tsx
'use client'

import { ThemeProvider } from '@gtcx/baseline-cx'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      theme="light"
      locale="en"
      direction="ltr"
    >
      {children}
    </ThemeProvider>
  )
}
```

```tsx
// src/app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

---

## 🎨 **Your First Application**

### **1. Create a Simple Dashboard**

```tsx
// src/app/page.tsx
'use client'

import {
  Button,
  Card,
  Input,
  Select,
  Table,
  Badge,
  Avatar,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gtcx/baseline-cx'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Your Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Built with Baseline CX - The world's most advanced design system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <Card.Header>
            <Card.Title>Total Users</Card.Title>
            <Card.Description>Active users this month</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="text-3xl font-bold">12,345</div>
            <Progress value={75} className="mt-2" />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Revenue</Card.Title>
            <Card.Description>Monthly revenue growth</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="text-3xl font-bold">$89,432</div>
            <Badge variant="success" className="mt-2">+12.5%</Badge>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Performance</Card.Title>
            <Card.Description>System performance score</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="text-3xl font-bold">98.7%</div>
            <Badge variant="info" className="mt-2">Excellent</Badge>
          </Card.Content>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>User Management</Card.Title>
            <Card.Description>Manage your users and permissions</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="flex gap-4 mb-4">
              <Input placeholder="Search users..." className="flex-1" />
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>User</Table.Head>
                  <Table.Head>Role</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <Avatar.Image src="/avatars/user1.jpg" />
                        <Avatar.Fallback>JD</Avatar.Fallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-sm text-muted-foreground">john@example.com</div>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>Admin</Table.Cell>
                  <Table.Cell>
                    <Badge variant="success">Active</Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <Card.Title>Quick Actions</Card.Title>
            <Card.Description>Common tasks and shortcuts</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Share2 className="w-4 h-4 mr-2" />
              Share Report
            </Button>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
```

---

## 🧪 **Testing Your Setup**

### **1. Run the Development Server**

```bash
npm run dev
```

### **2. Open Your Browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see your application.

### **3. Test Components**

Try different components and variants to ensure everything is working correctly.

---

## 🚀 **Next Steps**

### **1. Explore Components**

- **[🧩 Component Library](../components/README.md)** - Complete component reference
- **[🎨 Design Tokens](../design-tokens/README.md)** - Design system foundation
- **[🎭 Design Patterns](../patterns/README.md)** - Usage guidelines

### **2. Learn Advanced Features**

- **[🌍 Localization](../internationalization/README.md)** - Global deployment
- **[🔐 Security](../security/README.md)** - Security and compliance
- **[📊 Performance](../performance/README.md)** - Optimization guide

### **3. Deploy to Production**

- **[🚀 Deployment Guide](../deployment/README.md)** - Production deployment
- **[🔧 Development](../development/README.md)** - Building and extending
- **[🧪 Testing](../testing/README.md)** - Testing strategies

---

## 🆘 **Need Help?**

### **🔧 Common Issues**

**Q: Components not rendering correctly?**
A: Ensure you have the ThemeProvider wrapping your app and check that all CSS is imported.

**Q: TypeScript errors?**
A: Make sure you have the latest TypeScript version and that types are properly imported.

**Q: Styling issues?**
A: Verify that Tailwind CSS is configured correctly and that Baseline CX styles are imported.

### **📞 Support Channels**

- **GitHub Issues**: [Report bugs and request features](https://github.com/gtcx-protocol/gtcx-baseline-design-system/issues)
- **GitHub Discussions**: [Join community conversations](https://github.com/gtcx-protocol/gtcx-baseline-design-system/discussions)
- **Documentation**: [Complete documentation](../README.md)

---

## 📚 **Documentation Navigation**

**[📖 Documentation Hub](../README.md)** → **[🚀 Getting Started](./README.md)** → **[🧩 Components](../components/README.md)** → **[🎨 Design Tokens](../design-tokens/README.md)**

**Start building the future of enterprise design with Baseline CX today!** 🚀🎨

---

*Built with ❤️ by the GTCX Protocol team for a more accessible, consistent, and beautiful world.* 🌍✨
