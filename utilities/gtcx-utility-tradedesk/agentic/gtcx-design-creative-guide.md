# GTCX Design and Creative Guide
## AI Agent Onboarding for Visual and User Experience Design

### Overview

This guide equips design and creative AI agents with the principles, patterns, and priorities for creating visual and experiential elements of the GTCX ecosystem. The design challenge is to create interfaces that convey trust and sophistication while remaining accessible to users in frontier markets with varying literacy levels and technological experience.

---

## 1. Design Philosophy

### 1.1 Core Design Principles

**Trust Through Transparency:**
- Visual clarity that demystifies complex verification processes
- Progressive disclosure of technical information
- Clear visual feedback for every user action
- Consistent visual language across all touchpoints

**Dignity and Empowerment:**
- Designs that respect and elevate users
- Avoiding patronizing or overly simplified aesthetics
- Celebrating local visual cultures while maintaining global coherence
- Empowering imagery that shows users in control

**Accessibility as Foundation:**
- High contrast ratios for outdoor visibility
- Large touch targets for field conditions
- Icon-first navigation for low-literacy users
- Voice and gesture interaction support

### 1.2 Visual Identity Framework

**Color System:**
```css
/* Primary Palette - Trust and Growth */
--gtcx-gold: #D4AF37;      /* Premium, value, verified */
--gtcx-green: #2E7D32;     /* Growth, compliance, success */
--gtcx-blue: #1565C0;      /* Trust, security, technology */

/* Secondary Palette - Accessibility and Clarity */
--gtcx-earth: #6D4C41;     /* Grounding, connection to land */
--gtcx-sky: #81D4FA;       /* Openness, possibility */
--gtcx-sand: #FFF8E1;      /* Neutral, warm background */

/* Functional Colors */
--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
--info: #2196F3;
```

**Typography System:**
```css
/* Heading Stack - Authority and Clarity */
font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;

/* Body Stack - Readability and Accessibility */
font-family: 'Open Sans', 'Arial', sans-serif;

/* Monospace - Technical Information */
font-family: 'JetBrains Mono', 'Courier New', monospace;

/* Scale - Mobile First */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px - minimum for body */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
```

---

## 2. User Interface Patterns

### 2.1 Mobile-First Components

**Card-Based Information Architecture:**
```jsx
// Verification Status Card
<Card variant="elevated" status="verified">
  <CardHeader>
    <Icon name="shield-check" color="success" size="large" />
    <Badge status="active">Verified</Badge>
  </CardHeader>
  <CardBody>
    <Metric value="85" unit="GCI Score" trend="up" />
    <ProgressBar value={85} max={100} color="green" />
  </CardBody>
  <CardFooter>
    <Button variant="primary" fullWidth>
      View Details
    </Button>
  </CardFooter>
</Card>
```

**Progressive Information Disclosure:**
```jsx
// Expandable Compliance Details
<Accordion defaultExpanded={false}>
  <AccordionSummary>
    <Icon name="document" />
    <Text weight="medium">Compliance Documents</Text>
    <Badge count={3} />
  </AccordionSummary>
  <AccordionDetails>
    <DocumentList>
      <DocumentItem 
        title="Mining License"
        status="verified"
        date="2024-03-15"
      />
      <DocumentItem 
        title="Environmental Permit"
        status="pending"
        date="2024-03-20"
      />
    </DocumentList>
  </AccordionDetails>
</Accordion>
```

### 2.2 Field-Optimized Interfaces

**Large Touch Targets:**
```css
/* Minimum touch target sizes for field use */
.touch-target {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
  margin: 4px; /* Prevent accidental taps */
}

/* Extra large for primary actions */
.primary-action {
  min-height: 56px;
  font-size: 18px;
  font-weight: 600;
}
```

**High Visibility Design:**
```css
/* Outdoor-readable contrast */
.outdoor-mode {
  --text-color: #000000;
  --background: #FFFFFF;
  --min-contrast-ratio: 7:1;
}

/* Night mode for low-light conditions */
.night-mode {
  --text-color: #FFFFFF;
  --background: #121212;
  --accent-brightness: 80%;
}
```

---

## 3. Information Architecture

### 3.1 Navigation Patterns

**Bottom Navigation (Mobile):**
```
┌─────────────────────────────┐
│      Current Screen         │
│                             │
│         Content             │
│                             │
├─────────────────────────────┤
│  🏠   👤   📊   🔔   ⚙️   │
│ Home  ID  Score Alert Menu  │
└─────────────────────────────┘
```

**Progressive Onboarding Flow:**
```
Welcome → Identity Setup → Biometric Registration → 
Location Verification → Initial Assessment → Dashboard
```

### 3.2 Data Visualization

**Compliance Score Visualization:**
```jsx
// Circular Progress Indicator
<CircularProgress
  value={gciScore}
  max={100}
  size="large"
  strokeWidth={8}
  color={getScoreColor(gciScore)}
>
  <Text