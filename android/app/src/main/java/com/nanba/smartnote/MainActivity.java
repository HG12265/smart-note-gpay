package com.nanba.smartnote;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String text = intent.getStringExtra("notificationText");
            if (text != null) {
                // React app-ku data-va anupputhu
                getBridge().getWebView().evaluateJavascript(
                    "window.dispatchEvent(new CustomEvent('notificationReceived', { detail: { text: '" + text + "' } }));",
                    null
                );
            }
        }
    };

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Receiver-ah register pannu (Android 14+ compatibility kooda)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(receiver, new IntentFilter("com.nanba.smartnote.NOTIFICATION_RECEIVED"), Context.RECEIVER_EXPORTED);
        } else {
            registerReceiver(receiver, new IntentFilter("com.nanba.smartnote.NOTIFICATION_RECEIVED"));
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        try {
            unregisterReceiver(receiver);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}