package me.baron.webviewsample;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

    public class MainActivity extends AppCompatActivity {

        private ValueCallback<Uri> uploadMessage;
        private ValueCallback<Uri[]> uploadMessageAboveL;
        private final static int FILE_CHOOSER_RESULT_CODE = 10000;

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);

            WebView webview = (WebView) findViewById(R.id.web_view);
            assert webview != null;
            WebSettings settings = webview.getSettings();
            settings.setUseWideViewPort(true);
            settings.setLoadWithOverviewMode(true);
            settings.setJavaScriptEnabled(true);
            webview.setWebChromeClient(new WebChromeClient() {

                // For Android < 3.0
                public void openFileChooser(ValueCallback<Uri> valueCallback) {
                    uploadMessage = valueCallback;
                    openImageChooserActivity();
                }

                // For Android  >= 3.0
                public void openFileChooser(ValueCallback valueCallback, String acceptType) {
                    uploadMessage = valueCallback;
                    openImageChooserActivity();
                }

                //For Android  >= 4.1
                public void openFileChooser(ValueCallback<Uri> valueCallback, String acceptType, String capture) {
                    uploadMessage = valueCallback;
                    openImageChooserActivity();
                }

                // For Android >= 5.0
                @Override
                public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, WebChromeClient.FileChooserParams fileChooserParams) {
                    uploadMessageAboveL = filePathCallback;
                    openImageChooserActivity();
                    return true;
                }
            });
            String targetUrl = "file:///android_asset/up.html";
            webview.loadUrl(targetUrl);
        }

        private void openImageChooserActivity() {
            Intent i = new Intent(Intent.ACTION_GET_CONTENT);
            i.addCategory(Intent.CATEGORY_OPENABLE);
            i.setType("image/*");
            startActivityForResult(Intent.createChooser(i, "Image Chooser"), FILE_CHOOSER_RESULT_CODE);
        }

        @Override
        protected void onActivityResult(int requestCode, int resultCode, Intent data) {
            super.onActivityResult(requestCode, resultCode, data);
            if (requestCode == FILE_CHOOSER_RESULT_CODE) {
                if (null == uploadMessage && null == uploadMessageAboveL) return;
                Uri result = data == null || resultCode != RESULT_OK ? null : data.getData();
                if (uploadMessageAboveL != null) {
                    onActivityResultAboveL(requestCode, resultCode, data);
                } else if (uploadMessage != null) {
                    uploadMessage.onReceiveValue(result);
                    uploadMessage = null;
                }
            }
        }

        @TargetApi(Build.VERSION_CODES.LOLLIPOP)
        private void onActivityResultAboveL(int requestCode, int resultCode, Intent intent) {
            if (requestCode != FILE_CHOOSER_RESULT_CODE || uploadMessageAboveL == null)
                return;
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK) {
                if (intent != null) {
                    String dataString = intent.getDataString();
                    ClipData clipData = intent.getClipData();
                    if (clipData != null) {
                        results = new Uri[clipData.getItemCount()];
                        for (int i = 0; i < clipData.getItemCount(); i++) {
                            ClipData.Item item = clipData.getItemAt(i);
                            results[i] = item.getUri();
                        }
                    }
                    if (dataString != null)
                        results = new Uri[]{Uri.parse(dataString)};
                }
            }
            uploadMessageAboveL.onReceiveValue(results);
            uploadMessageAboveL = null;
        }
    }
