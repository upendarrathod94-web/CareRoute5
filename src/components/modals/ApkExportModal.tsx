import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
  Terminal,
  CheckCircle2,
  Share2,
  ShieldCheck,
  HardDrive,
  Usb,
  FolderDown,
  Info,
} from 'lucide-react';
import { playChime, triggerHaptic } from '../../utils/audioHaptics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl?: string;
}

export const ApkExportModal: React.FC<Props> = ({ isOpen, onClose, sharedUrl }) => {
  const [activeTab, setActiveTab] = useState<'usb' | 'pwabuilder' | 'icon' | 'pwa' | 'capacitor'>('usb');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [downloadingUsbKit, setDownloadingUsbKit] = useState(false);

  if (!isOpen) return null;

  const appUrl = sharedUrl || (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null' ? window.location.origin : 'https://ais-pre-gfux2mlyxqwlm3366l3r25-633381026259.asia-southeast1.run.app');
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURI(appUrl)}`;

  const handleDownloadUsbKit = () => {
    setDownloadingUsbKit(true);
    playChime('click');
    triggerHaptic(40);

    const kitGuide = `==================================================================
           CareRoute Health - USB Cable Phone Transfer Kit
==================================================================

Thank you for downloading the CareRoute USB Transfer Kit!

CareRoute is a modern healthcare app configured with an Android Web
App Manifest (com.careroute.health), offline service worker, and 3D icons.

------------------------------------------------------------------
METHOD 1: DRAG & DROP REAL APK VIA USB (EASIEST FOR ANY PHONE)
------------------------------------------------------------------
1. Generate your compiled Android APK:
   - Go to: https://www.pwabuilder.com?url=${encodeURI(appUrl)}
   - Click "Package for Android" -> download the real compiled .apk file.

2. Connect your phone:
   - Plug your Android phone into your computer using a USB cable.
   - Unlock your phone screen.
   - Swipe down from the top of the phone screen and tap the USB notification
     ("Charging this device via USB" or "USB Preferences").
   - Select "File Transfer" (or MTP).

3. Copy the APK file:
   - On Windows: Open "This PC" > Your Phone > "Internal shared storage" > "Download".
   - On Mac: Open Android File Transfer or Finder > "Download".
   - Drag & drop your downloaded .apk file into the "Download" folder.

4. Install on your phone:
   - On your phone, open "Files" or "My Files" app.
   - Go to "Downloads".
   - Tap on the CareRoute APK file.
   - If prompted: Tap "Settings" -> enable "Allow from this source" -> tap "Install".
   - CareRoute will now be installed on your phone home screen!

------------------------------------------------------------------
METHOD 2: 1-COMMAND USB INSTALL VIA ADB (FOR DEVELOPERS)
------------------------------------------------------------------
1. Enable USB Debugging on your phone:
   - Go to Settings > About phone > tap "Build number" 7 times.
   - Go to Settings > System > Developer options > enable "USB debugging".
2. Connect USB cable and accept the "Allow USB debugging" prompt on phone.
3. In terminal / Command Prompt, run:
   adb devices
   adb install -r CareRoute.apk

------------------------------------------------------------------
METHOD 3: BUILD NATIVE APK FROM SOURCE CODE VIA CAPACITOR
------------------------------------------------------------------
In AI Studio top-right:
1. Click Settings (gear icon) > "Export project" (ZIP or GitHub).
2. Unzip and run in terminal:
   npm install
   npm run build
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap add android
   npx cap open android
3. In Android Studio, click "Run" with your phone connected via USB!
==================================================================
`;

    const blob = new Blob([kitGuide], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CareRoute-USB-Install-Guide.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadingUsbKit(false);
      playChime('success');
    }, 800);
  };

  const capacitorCommands = `# 1. Export & Unzip project, then in terminal run:
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build
npx cap add android
npx cap open android

# 2. In Android Studio, click:
# Build -> Build Bundle(s) / APK(s) -> Build APK(s)
# 3. Sideload to Phone via USB:
adb install app-release.apk`;

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(appUrl);
    setCopiedUrl(true);
    playChime('success');
    triggerHaptic(40);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCommands = () => {
    navigator.clipboard?.writeText(capacitorCommands);
    setCopiedCommands(true);
    playChime('success');
    triggerHaptic(40);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto animate-fadeIn">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold">
              <Usb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Install CareRoute on Phone via USB
              </h2>
              <p className="text-xs text-slate-400">
                Direct USB transfer, APK file package & installation steps
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 p-1.5 gap-1 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('usb')}
            className={`flex-1 min-w-[110px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'usb'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Usb className="w-3.5 h-3.5 text-teal-300" />
            <span>USB to Phone</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pwabuilder')}
            className={`flex-1 min-w-[100px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pwabuilder'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Online APK</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 min-w-[100px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Direct Phone</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('icon')}
            className={`flex-1 min-w-[90px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'icon'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>App Icon</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('capacitor')}
            className={`flex-1 min-w-[100px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'capacitor'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Capacitor CLI</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* TAB 1: USB Transfer to Phone */}
          {activeTab === 'usb' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Highlight Action: How to get APK and Transfer */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-950 border border-teal-700/60 shadow-lg space-y-3">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-900/80 border border-teal-600 text-teal-300 text-[10px] font-bold">
                    <Usb className="w-3 h-3" />
                    <span>Direct USB Transfer to Phone</span>
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">
                    Transfer CareRoute to Your Phone via USB
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Follow the two quick steps below to copy and install CareRoute on your Android device.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-950 transition-all cursor-pointer text-center"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>1. Get Real APK (PWABuilder)</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>

                  <button
                    type="button"
                    onClick={handleDownloadUsbKit}
                    disabled={downloadingUsbKit}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-teal-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <HardDrive className="w-4 h-4 shrink-0" />
                    <span>
                      {downloadingUsbKit ? 'Downloading Kit...' : 'Download USB Guide (.txt)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step USB Connection Guide */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Usb className="w-4 h-4 text-teal-400" />
                  <span>How to transfer and install with USB cable:</span>
                </h4>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-white">Connect phone to computer via USB</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Plug one end of your charging/data cable into your computer, and the other into your Android phone.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-white">Select "File Transfer (MTP)" mode</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Unlock your phone, swipe down the notification bar, tap <strong>Charging this device via USB</strong>, and choose <strong>File Transfer</strong> (or MTP).
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-white">Copy APK file to your phone</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Open File Explorer (Windows) or Android File Transfer / Finder (Mac). Drag <code className="text-teal-300 bg-slate-900 px-1 py-0.5 rounded">CareRoute-v1.0.apk</code> into your phone's <strong>Download</strong> folder.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      4
                    </span>
                    <div>
                      <p className="font-bold text-white">Tap to Install on Phone</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        On your phone, open <strong>Files</strong> or <strong>My Files</strong> &gt; <strong>Downloads</strong> &gt; tap <code className="text-teal-300">CareRoute-v1.0.apk</code>. If prompted, tap "Allow from this source" and tap <strong>Install</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer ADB Fast USB Command */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-blue-400" />
                    <span>Quick USB install using ADB (Optional for Developers)</span>
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 font-mono text-[11px] text-teal-300 flex items-center justify-between">
                  <span>adb install CareRoute-v1.0.apk</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('adb install CareRoute-v1.0.apk');
                      playChime('click');
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'icon' && (
            <div className="space-y-4 animate-fadeIn">
              {/* App Icon Showcase */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
                <div className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border-2 border-teal-500/40 shrink-0 bg-slate-950">
                  <img
                    src="/icon-512.png"
                    alt="CareRoute App Icon"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl pointer-events-none" />
                </div>

                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-950/80 border border-teal-700/60 text-teal-300 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3" />
                    <span>3D App Store &amp; PWA Icon</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">CareRoute Official Icon</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Custom-rendered 3D healthcare emblem blending a medical cross, dual-tone medicine capsule, and heartbeat line on a deep slate navy background.
                  </p>
                </div>
              </div>

              {/* Download Buttons & Manifest status */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-300">Download for PWABuilder / Play Store:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="/icon-512.png"
                    download="careroute-icon-512.png"
                    className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download 512×512 PNG</span>
                  </a>

                  <a
                    href="/icon-192.png"
                    download="careroute-icon-192.png"
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download 192×192 PNG</span>
                  </a>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-teal-300 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Manifest Configured</span>
                </div>
                <p className="text-slate-400">
                  This icon is registered in <code className="text-teal-300">public/manifest.json</code> and <code className="text-teal-300">index.html</code> with sizes <strong>192×192</strong> and <strong>512×512</strong> (both <strong>any</strong> and <strong>maskable</strong> purposes).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-800/50 space-y-2">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Free, Instant APK via PWABuilder</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  CareRoute now includes a standard <strong>Web App Manifest</strong> and <strong>Service Worker</strong>. Microsoft’s free PWABuilder tool packages it into a production-ready Android APK in 30 seconds.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Live Hosted App URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono select-all truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <ol className="space-y-2 text-slate-300 list-decimal list-inside pl-1 bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                <li>Click <strong>Generate APK on PWABuilder</strong> below.</li>
                <li>Review the manifest score (100% complete).</li>
                <li>Click <strong>Package for Android</strong> and download your <code className="text-teal-300 bg-slate-900 px-1 py-0.5 rounded">.apk</code> file!</li>
              </ol>

              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 transition-all cursor-pointer"
              >
                <span>Generate APK on PWABuilder.com</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/50 space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                  <Smartphone className="w-4 h-4" />
                  <span>Instant Install without downloading unknown APKs</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  CareRoute operates as an installable Progressive Web App. When installed, it places an app icon on your phone's home screen, runs full screen without browser toolbars, and works offline!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <p className="font-bold text-white">Open link in Chrome on Android</p>
                    <p className="text-slate-400 mt-0.5">
                      Open your phone browser and paste the shared app URL:
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={appUrl}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 font-mono truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopyUrl}
                        className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-semibold text-[11px] shrink-0"
                      >
                        {copiedUrl ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <p className="font-bold text-white">Tap Menu (⋮) &gt; "Install app" or "Add to Home screen"</p>
                    <p className="text-slate-400 mt-0.5">
                      Chrome will prompt you to install CareRoute. It installs in 3 seconds directly on your Android launcher!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capacitor' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/50 space-y-1">
                <p className="font-bold text-purple-300 text-xs">Capacitor Android Project Ready</p>
                <p className="text-slate-300 text-[11px]">
                  We have included <code className="text-teal-300">capacitor.config.json</code> in this project with package ID <code className="text-teal-300">com.careroute.health</code>.
                </p>
              </div>

              <div className="relative">
                <pre className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-[11px] text-teal-300 overflow-x-auto leading-relaxed">
                  {capacitorCommands}
                </pre>
                <button
                  type="button"
                  onClick={handleCopyCommands}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[10px] flex items-center gap-1"
                >
                  {copiedCommands ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCommands ? 'Copied' : 'Copy CLI'}</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-slate-200">How to export your code:</p>
                <p>Click the <strong>Settings menu</strong> in the top-right of AI Studio &gt; choose <strong>Export to ZIP</strong> or <strong>Export to GitHub</strong>, then run the commands above on your computer with Android Studio installed.</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>PWA Manifest &bull; Offline SW &bull; Capacitor</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
