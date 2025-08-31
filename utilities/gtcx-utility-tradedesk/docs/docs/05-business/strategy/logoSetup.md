# GTCX Logo Setup

## Logo File Requirements

The app expects a logo file at `assets/gtcx-logo.png`. 

### Current Status
- ✅ Logo component updated to use `gtcx-logo.png`
- ❌ Logo file needs to be added

### To Add Your Logo:

1. **Place your logo file** at `assets/gtcx-logo.png`
2. **Recommended dimensions**: 200x200px or larger (will be scaled down)
3. **Format**: PNG with transparency preferred
4. **File size**: Keep under 100KB for optimal performance

### Logo Specifications:
- **Location**: `assets/gtcx-logo.png`
- **Format**: PNG
- **Background**: Transparent or white
- **Colors**: Should work well on black background
- **Aspect ratio**: Square (1:1) recommended

### Alternative: Create a Simple Logo

If you don't have a logo file, you can:

1. **Use any image editor** (Photoshop, GIMP, Canva, etc.)
2. **Create a simple logo** with "GTCX" text
3. **Export as PNG** with transparent background
4. **Save as** `assets/gtcx-logo.png`

### Testing the Logo

Once you add the logo file:
1. Restart the development server: `npx expo start --clear`
2. The logo should appear in all headers
3. It will be automatically sized based on the `size` prop

### Logo Component Usage

The logo is used in the Header component and can be customized:

```tsx
<Logo size="medium" showText={true} color="#fff" />
```

**Size options:**
- `small`: 24px
- `medium`: 40px  
- `large`: 64px

**Props:**
- `size`: Logo size
- `showText`: Show "GTCX GeoTag" text
- `color`: Text color
- `style`: Additional styles 