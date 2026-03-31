package com.nanba.smartnote;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String text = intent.getStringExtra("notificationText");
            // React app-ku data-va anupputhu
            getBridge().getWebView().evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('notificationReceived', { detail: { text: '" + text + "' } }));",
                null
            );
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Receiver-ah register pannu
        registerReceiver(receiver, new IntentFilter("com.nanba.smartnote.NOTIFICATION_RECEIVED"), Context.RECEIVER_EXPORTED);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(receiver);
    }
}