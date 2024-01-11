package com.spetrol_driver_app2;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reposenergy.reposbluetooth.Bluetooth.BluetoothDataReceiveEventListener;

import javax.annotation.Nullable;

public class ReposBluetoothDataReceiver extends ReactContextBaseJavaModule implements BluetoothDataReceiveEventListener {
    ReactApplicationContext ctx;
    ReposBluetoothDataReceiver(ReactApplicationContext context) {
        super(context);
        ctx = context;
    }

    @Override
    public String getName() {
        return "ReposBluetoothDataReceiver";
    }

    @Override
    public void onOrderSet(boolean isOrderSet) {
        /**
         * Add your logic here onOrderSet
         */
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "Order is set successfully");
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFuelRateSet(boolean isFuelRateSet) {
        /**
         * Add your logic here onFuelRateSet
         */
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "Fuel rate is set successfully");
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFuelDensitySet(boolean isFuelDensitySet) {
        /**
         * Add your logic here onFuelRateSet
         */
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "Fuel density is set successfully");
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onOrderFinished(double quantity, String token, double volumeTotaliser, double x) {
        /**
         * When DU Nozzle put back on DU onOrderFinished will be called
         * Quantity:- Dispensed quantity.
         * VolumeTotaliser: Total Amount of Diesel Dispensed By DU.
         */
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "On order finished");
        params.putDouble("quantity", quantity);
        params.putString("token", token);
        params.putDouble("volumeTotaliser", volumeTotaliser);
        params.putDouble("x", x);
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onError(String e) {
        /**onParsingFailed will be called when we get garbage data. **/
        System.out.println("e: " + e);
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", true);
        params.putString("msg", "Something went wrong");
        params.putString("errData", e.toString());
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFeedDataReceived(double level1, double level2, double level3, double level4) {
        /**
        * Add your logic here
        Levels will come according to the number of sensors installed in RPP. **/
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "On feed data received");
        params.putDouble("level1", level1);
        params.putDouble("level2", level2);
        params.putDouble("level3", level3);
        params.putDouble("level4", level4);
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFccStatusDataReceived(boolean isDuActive, String firmwareVersion) { /**
        * Add your logic here
        * If there will one single du then this method will be called
        **/
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "On fcc data received");
        params.putBoolean("isDuActive", isDuActive);
        params.putString("firmwareVersion", firmwareVersion);
        sendEvent(ctx, "ReBluetoothEvent", params);
    }

    @Override
    public void onFccStatusDataReceived(boolean isDuActive, boolean x, String firmwareVersion) { /**
        * Add your logic here
        * If there will one single du then this method will be called
        **/
        System.out.println("isDuActive2: " + isDuActive);
        WritableMap params = Arguments.createMap();
        params.putBoolean("error", false);
        params.putString("msg", "On fcc data received[duplicate]");
        sendEvent(ctx, "ReBluetoothEvent", params);

    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
