package com.spetrol_driver_app2;

import android.app.Activity;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothAdapter;
import android.content.IntentFilter;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reposenergy.reposbluetooth.Bluetooth.BluetoothConnectionStateListener;
import com.reposenergy.reposbluetooth.Bluetooth.BluetoothDataReceiveEventListener;
import com.reposenergy.reposbluetooth.Bluetooth.BluetoothFactory;
import com.reposenergy.reposbluetooth.Bluetooth.ConnectionStatus;
import com.reposenergy.reposbluetooth.Bluetooth.ReBluetooth;
import com.reposenergy.reposbluetooth.Bluetooth.SDKInitializationListener;
import com.reposenergy.reposbluetooth.Bluetooth.SDKInitializationStatus;

import javax.annotation.Nullable;

public class ReposHelper implements BluetoothDataReceiveEventListener, BluetoothConnectionStateListener, SDKInitializationListener {
    private String deviceId;
    public ReBluetooth reBluetooth;
    private Activity context;
    private ReactContext reactCtx;
    private String orderDetails;

    public ReposHelper(String deviceId, String partnerId, Activity context, ReactApplicationContext ctx, String orderDetails) {
        this.deviceId = deviceId;
        this.context = context;
        this.reactCtx = ctx;
        this.orderDetails = orderDetails;
        BluetoothFactory.init(deviceId, partnerId, context, this);
    }

    private void init() {
        reBluetooth.setBluetoothDataReceiveEventListener(this);
        reBluetooth.setBluetoothConnectionStateListener(this);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BluetoothDevice.ACTION_FOUND);
        intentFilter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
        reBluetooth.connect(BluetoothAdapter.getDefaultAdapter(), intentFilter, reactCtx);
    }

    @Override
    public void onOrderSet(boolean isOrderSet) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "Order is set successfully");
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFuelRateSet(boolean isFuelRateSet) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putBoolean("fuelRateSet", true);
        params.putString("msg", "Fuel rate is set successfully");
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFuelDensitySet(boolean isFuelDensitySet) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "Fuel density is set successfully");
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onOrderFinished(double quantity, String token, double duOneTotaliser, double duTwoTotaliser) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "On order finished");
        params.putDouble("quantity", quantity);
        params.putString("token", token);
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onError(String message) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", true);
        params.putString("msg", message);
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFeedDataReceived(double level1, double level2, double level3, double level4) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "On feed data received");
        params.putDouble("level1", level1);
        params.putDouble("level2", level2);
        params.putDouble("level3", level3);
        params.putDouble("level4", level4);
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFccStatusDataReceived(boolean isDuActive, String firmwareVersion) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "On fcc data received");
        params.putBoolean("isDuActive", isDuActive);
        params.putString("firmwareVersion", firmwareVersion);
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFccStatusDataReceived(boolean isDuOneActive, boolean isDuTwoActive, String firmwareVersion) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "On fcc data received[duplicate]");
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onConnectionStatusChange(ConnectionStatus connectionStatus) {
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "Status change to: " + connectionStatus.toString());
        params.putString("connectionStatus", "Status change to: " + connectionStatus.toString());
        if (connectionStatus.equals(ConnectionStatus.CONNECTED)) {
            params.putBoolean("deviceFound", true);
        }
        if (connectionStatus.equals(ConnectionStatus.CONNECTING)) {
            params.putBoolean("deviceFound", false);
        }
        params.putString("orderDetails", this.orderDetails);
        params.putBoolean("sdkInitialised", true);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFailed(Exception e) {
        Log.i("Bluetooth exception","Connection Status: " + e.getMessage());
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", true);
        params.putString("msg", e.toString());
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);

    }

    @Override
    public void onFailed(String message) {
        Log.i("Bluetooth onFailed",message);
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", true);
        System.out.println("err: " + message);
        params.putString("msg", message);
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onBleDeviceDiscovered(BluetoothDevice device) {
        Log.i("Bluetooth Transactions","Device Discovered: " + device.getName());
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "Device found: " + device.getName());
        params.putBoolean("sdkInitialised", true);
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onSDKInitialized(ReBluetooth reBluetooth) {
        Log.i("SDK Initialised", reBluetooth.toString());
        this.reBluetooth = reBluetooth;
        init();
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "SDK initialization successfully.");
        params.putBoolean("sdkInitialised", true);
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    @Override
    public void onSDKSInitializationFailed(String message, SDKInitializationStatus sdkInitializationStatus) {
        Log.i("SDK Failed", message);
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", true);
        params.putString("msg", "SDK initialization failed.");
        params.putString("status", sdkInitializationStatus.name());
        params.putString("orderDetails", this.orderDetails);
        sendEvent(reactCtx, "ReBluetoothEvent", params);
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
