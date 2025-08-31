# GTCX App User Guide

## **How to Access Key Features**

### **1. User Registration & Login**

**When NOT logged in (no avatar in header):**
- Look at the **top-right corner** of the header
- You'll see two buttons: **"Tour"** and **"Login"**
- Click **"Login"** → Auth screen appears
- Click **"Sign Up"** at bottom → Registration screen
- Fill in your details and create account

**When logged in (avatar visible in header):**
- Click your **avatar** (circular image) in top-right corner
- Menu opens with options: Settings, Take Tour, Profile, Logout

### **2. Product Tour**

**Method 1 - Not logged in:**
- Click **"Tour"** button in top-right corner of header

**Method 2 - Logged in:**
- Click your **avatar** in top-right corner
- Click **"Take Tour"** from the menu

**Method 3 - Direct access:**
- Navigate to `/onboarding` in your browser

### **3. Avatar Display**

**Current Status:**
- Avatar should appear in top-right corner when logged in
- If you see a person icon instead of photo, you're not logged in
- If you see "27" in logs, there's an image loading issue

**To see your avatar:**
1. Click "Login" in header
2. Use demo credentials: `demo@gtcx.com` / `password`
3. Avatar should appear in top-right corner

### **4. Navigation Structure**

**Header (Top Bar):**
```
[GEOTAG Logo] ← [GTCX Logo (clickable)] → [Tour/Login OR Avatar]
```

**Bottom Navigation:**
- **Home** - Main dashboard
- **Camera** - Photo capture
- **GPS** - Location tracking  
- **Analytics** - Data insights
- **Settings** - App configuration

### **5. Quick Access Guide**

**For New Users:**
1. **Start Tour**: Click "Tour" button in header
2. **Register**: Click "Login" → "Sign Up" → Create account
3. **Avatar**: Should appear automatically after login

**For Existing Users:**
1. **Login**: Click "Login" → Enter credentials
2. **Avatar**: Should appear in top right
3. **Menu**: Click avatar → Access settings, tour, profile, logout

**For Testing:**
1. **Test Page**: Navigate to `/test-avatar` for debugging
2. **All Features**: Test login, registration, tour, navigation

### **6. Troubleshooting**

**If you don't see Tour/Login buttons:**
- Make sure you're on the home page (`/`)
- Check if you're already logged in (look for avatar)
- Try refreshing the page

**If avatar isn't showing:**
- Navigate to `/test-avatar` to test image loading
- Try logging out and back in
- Check browser console for errors

**If navigation isn't working:**
- Make sure you're using the latest version
- Try clearing browser cache
- Check if all routes are accessible

### **7. Direct URLs for Testing**

- **Home**: `/`
- **Login**: `/auth`
- **Register**: `/auth-secure`
- **Tour**: `/onboarding`
- **GPS**: `/gps`
- **Camera**: `/camera`
- **Analytics**: `/analytics`
- **Settings**: `/settings`
- **Test Page**: `/test-avatar`

### **8. Demo Credentials**

**For testing:**
- Email: `demo@gtcx.com`
- Password: `password`

**For registration:**
- Use any email/password combination
- Account will be created locally

### **9. Feature Locations**

**Tour Access:**
- ✅ Header button (when not logged in)
- ✅ Avatar menu (when logged in)
- ✅ Direct URL: `/onboarding`

**Avatar Display:**
- ✅ Top-right corner of header
- ✅ Shows after successful login
- ✅ Clickable for user menu

**User Registration:**
- ✅ Header "Login" button → "Sign Up"
- ✅ Direct URL: `/auth-secure`
- ✅ Test page: `/test-avatar`

**Navigation:**
- ✅ Bottom tab bar
- ✅ Header logo (home)
- ✅ Avatar menu (when logged in)

---

## **Visual Guide**

```
┌─────────────────────────────────────────────────────────┐
│ [GEOTAG] ← [GTCX LOGO] → [Tour] [Login] OR [Avatar] │ ← Header
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    Main Content                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [Home] [Camera] [GPS] [Analytics] [Settings]          │ ← Bottom Nav
└─────────────────────────────────────────────────────────┘
```

**When NOT logged in:**
- Top-right shows: [Tour] [Login]

**When logged in:**
- Top-right shows: [Avatar] (clickable)
- Avatar menu: Settings, Take Tour, Profile, Logout 