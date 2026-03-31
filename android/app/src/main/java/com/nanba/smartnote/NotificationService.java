package com.nanba.smartnote;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class NotificationService extends NotificationListenerService {
    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        
        // GPay package name check
        if (packageName.equals("com.google.android.apps.nbu.paisa")) {
            Bundle extras = sbn.getNotification().extras;
            String title = extras.getString("android.title");
            String text = extras.getString("android.text");

            Log.d("SmartNote", "GPay Notification: " + text);

            // Send this data to our React App using a Broadcast
            Intent intent = new Intent("com.nanba.smartnote.NOTIFICATION_RECEIVED");
            intent.putExtra("notificationText", text);
            sendBroadcast(intent);
        }
    }
}