# Push Notifications Setup

## Overview
The app now supports push notifications using Expo Notifications. This allows the backend to send real-time notifications to users about their car wash services, promotions, and alerts.

## Features Configured

### 1. Notification Service (`/src/infrastructure/services/NotificationService.ts`)
- **Permission Management**: Handles requesting and storing notification permissions
- **Push Token Registration**: Registers device tokens with Expo and sends them to the backend
- **Notification Handling**: Configures how notifications are displayed and handled
- **Test Notifications**: Includes functionality to send test notifications for development

### 2. Notification Provider (`/src/presentation/providers/NotificationProvider.tsx`)
- **Global Setup**: Initializes notifications when the app starts
- **Event Listeners**: Handles notification received and notification tap events
- **Context Provider**: Provides notification functionality throughout the app

### 3. App Configuration (`app.json`)
- **Expo Notifications Plugin**: Configured with proper notification icon and colors
- **Android Permissions**: Added required permissions for notifications
- **Google Services**: Ready for Firebase integration (google-services.json needed)

## How It Works

### 1. Initial Setup
When the app launches:
1. NotificationProvider initializes
2. Permission modal shows to user (if not previously asked)
3. If user accepts, device registers for push tokens
4. Token is sent to backend API endpoint `/push-tokens`

### 2. Receiving Notifications
- Notifications appear in system tray when app is backgrounded
- When app is in foreground, custom handling can be implemented
- Tapping notifications can navigate to specific screens

### 3. Testing
- A "Test Notification" button is available in Configuration screen
- Schedules a local test notification to verify setup

## Backend Integration Required

### API Endpoint
The app expects a `POST /push-tokens` endpoint that accepts:
```json
{
  "token": "ExponentPushToken[xxx]",
  "type": "expo",
  "platform": "ios" // or "android"
}
```

### Sending Notifications
Use Expo's Push API or Firebase to send notifications:
```json
{
  "to": "ExponentPushToken[xxx]",
  "title": "Service Complete",
  "body": "Your car wash service is ready for pickup!",
  "data": {
    "screen": "/transactions/123"
  }
}
```

## Development Notes

### Project ID
The app automatically detects the Expo project ID from the configuration. For production, ensure your EAS project is properly configured.

### Physical Device Required
Push notifications only work on physical devices, not simulators/emulators.

### Google Services (Android)
For production Android builds, add your `google-services.json` file to the project root.

## Next Steps

1. **Backend Implementation**: Create the `/push-tokens` endpoint
2. **Testing**: Test on physical devices with real push notifications
3. **Notification Content**: Customize notification content and actions
4. **Deep Linking**: Implement navigation when notifications are tapped
5. **Notification Categories**: Set up different types of notifications (alerts, promotions, etc.)

## Files Modified/Created

- ✅ `src/infrastructure/services/NotificationService.ts` - Complete rewrite with push notification support
- ✅ `src/presentation/providers/NotificationProvider.tsx` - New provider for notification management
- ✅ `app/_layout.tsx` - Added NotificationProvider to app root
- ✅ `src/shared/config/environment.ts` - Added PUSH_TOKEN endpoint
- ✅ `src/presentation/screens/user/ConfigurationScreen.tsx` - Added test notification button
- ✅ `app.json` - Added expo-notifications plugin and Android permissions
- ✅ `package.json` - Added expo-notifications, expo-device, expo-constants dependencies

## Status
✅ Push notifications are fully configured and ready for testing on physical devices.