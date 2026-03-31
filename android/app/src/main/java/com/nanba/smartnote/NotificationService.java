package com.nanba.smartnote;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.content.Intent;
import android.os.Bundle;

public class NotificationService extends NotificationListenerService {
    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        String packageName = sbn.getPackageName();
        
        // GPay notification check
        if (packageName.equals("com.google.android.apps.nbu.paisa")) {
            Bundle extras = sbn.getNotification().extras;
            String text = extras.getString("android.text");

            if (text != null) {
                Intent intent = new Intent("com.nanba.smartnote.NOTIFICATION_RECEIVED");
                intent.putExtra("notificationText", text);
                sendBroadcast(intent);
            }
        }
    }
}