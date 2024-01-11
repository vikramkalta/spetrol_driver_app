package com.spetrol_driver_app2;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reposenergy.reposbluetooth.Bluetooth.BluetoothFactory;
import com.reposenergy.reposbluetooth.Bluetooth.DUSelectionType;
import com.reposenergy.reposbluetooth.Bluetooth.ReBluetooth;
import com.reposenergy.reposbluetooth.Bluetooth.SDKInitializationListener;
import com.reposenergy.reposbluetooth.Bluetooth.SDKInitializationStatus;

import java.util.Map;
import java.util.HashMap;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import javax.annotation.Nullable;

public class ReposIOT extends ReactContextBaseJavaModule {
    ReactApplicationContext ctx;
    ReposIOT(ReactApplicationContext context) {
        super(context);
        ctx = context;
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
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
    public String getName() {
        return "ReposIOT";
    }
    ReposHelper bluetoothSdk;

    @ReactMethod
    public void connect() {
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BluetoothDevice.ACTION_FOUND);
        intentFilter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
        bluetoothSdk.reBluetooth.connect(BluetoothAdapter.getDefaultAdapter(), intentFilter, ctx);
    }

    @ReactMethod
    public void setOrder(Double amount, String orderId) {
        bluetoothSdk.reBluetooth.setOrder(amount, orderId, DUSelectionType.DU_A);
    }
    @ReactMethod
    public void setFuelRate(Double price) {
        bluetoothSdk.reBluetooth.setFuelRate(price);
    }
    /**
     * string deviceId
     * string partnerId,
     * int duCount
     */
    @ReactMethod
    public void initRepos(String deviceId, String partnerId, String orderDetails) {
        bluetoothSdk = new ReposHelper(deviceId, partnerId, getCurrentActivity(), ctx, orderDetails);
    }
}
