package com.spetrol_driver_app2;

import android.bluetooth.BluetoothDevice;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reposenergy.reposbluetooth.Bluetooth.BluetoothConnectionStateListener;
import com.reposenergy.reposbluetooth.Bluetooth.ConnectionStatus;

import javax.annotation.Nullable;

public class ReposBluetoothListener extends ReactContextBaseJavaModule implements BluetoothConnectionStateListener {
    ReactApplicationContext ctx;
    ReposBluetoothListener(ReactApplicationContext context) {
        ctx = context;
    }
    @Override
    public String getName() {
    return "ReposBluetoothListener";
}

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    @Override
    public void onConnectionStatusChange(ConnectionStatus connectionStatus) {
        /**
         * Add your logic on different Connection status
         * CONNECTING,
         * CONNECTED,
         * DISCONNECTED
         */
        System.out.println("connectionStatus: " + connectionStatus);
        Log.i("connectionStatus", "onConnectionStatusChange:"+connectionStatus.toString());
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "Status change.");
//        params.putString("device", connectionStatus.name());
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFailed(Exception e) {
        /**
         * Add your logic here on connection Failed
         */
        System.out.println("e not connected: " + e);
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", true);
//        System.out.println("err e: " + e);
        params.putString("msg", e.toString());
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFailed(String e) {
        /**
         * Add your logic here on connection Failed
         */
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", true);
        System.out.println("err: " + e);
        params.putString("msg", e);
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onBleDeviceDiscovered(BluetoothDevice device) {
        /**
         * Get Bluetooth Device instance
         */
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "Device found.");
//        params.putString("device", device.getName());
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    private void  sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
