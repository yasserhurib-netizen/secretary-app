// يضيف الصلاحيات اللازمة للتنبيهات والميكروفون إلى مشروع أندرويد بعد إنشائه
const fs = require('fs');
const file = 'android/app/src/main/AndroidManifest.xml';
let xml = fs.readFileSync(file, 'utf8');
const perms = [
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.SCHEDULE_EXACT_ALARM',
  'android.permission.USE_EXACT_ALARM',
  'android.permission.RECEIVE_BOOT_COMPLETED',
  'android.permission.VIBRATE',
  'android.permission.WAKE_LOCK',
  'android.permission.RECORD_AUDIO',
];
const missing = perms.filter((p) => !xml.includes(p));
const lines = missing.map((p) => `    <uses-permission android:name="${p}" />`).join('\n');
// خدمة التعرف على الكلام تحتاج إعلان الاستعلام عنها على أندرويد 11+
const queries = xml.includes('<queries>') ? '' : `    <queries>\n        <intent><action android:name="android.speech.RecognitionService" /></intent>\n        <intent><action android:name="android.intent.action.TTS_SERVICE" /></intent>\n    </queries>\n`;
xml = xml.replace('<application', `${lines}\n${queries}\n    <application`);
fs.writeFileSync(file, xml);
console.log('Manifest patched:', missing.join(', ') || 'nothing to add');
