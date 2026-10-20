# NEONBYTE — متجر جيمينج

واجهة متجر عربية RTL بمظهر Gaming / Neon، مبنية بـ HTML وCSS وJavaScript، مع Supabase للمصادقة وقاعدة البيانات ولوحة تحكم لإدارة المنتجات. جاهزة للنشر كملفات ثابتة على GitHub Pages بعد إعداد Supabase.

## الموجود في المشروع
- `index.html` واجهة المتجر + تصفية الأقسام + سلة تجريبية.
- `login.html` صفحة تسجيل دخول الأدمن.
- `admin.html` لوحة تحكم لإضافة وتعديل وحذف المنتجات.
- `style.css` تصميم متجاوب بألوان Neon.
- `app.js`, `auth.js`, `admin.js` وظائف الواجهة.
- `config.js` إعدادات Supabase العامة.
- `schema.sql` جداول قاعدة البيانات وسياسات RLS.

## 1) إعداد قاعدة البيانات وتسجيل الدخول
1. أنشئ مشروعًا على [Supabase](https://supabase.com/).
2. افتح **SQL Editor**، والصق محتوى `schema.sql` ثم اضغط **Run**.
3. من **Project Settings → API** انسخ **Project URL** و **anon/public key**.
4. افتح `config.js` واستبدل `https://YOUR-PROJECT.supabase.co` بعنوان مشروعك، و`YOUR_SUPABASE_ANON_KEY` بالمفتاح العام (anon/publishable).
5. لا تضع `service_role` أو أي مفتاح سري داخل الموقع أو GitHub.
6. من **Authentication → Users** أنشئ مستخدمًا لحساب الأدمن. إن كان التسجيل العام مغلقًا، أنشئ المستخدم من لوحة Supabase.
7. افتح سجل المستخدم وانسخ UUID الخاص به. في **SQL Editor** نفّذ الأمر التالي بعد استبدال UUID:
   ```sql
   update public.profiles
   set role = 'admin'
   where id = 'YOUR-AUTH-USER-UUID';
   ```
8. افتح `login.html` وسجّل الدخول بحساب الأدمن. الحسابات الجديدة تبدأ بصلاحية `customer` ولا تستطيع ترقية نفسها.

## 2) النشر على GitHub Pages
1. أنشئ Repository جديدًا على GitHub.
2. ارفع ملفات المشروع إلى جذر المستودع (خصوصًا `index.html`).
3. افتح **Settings → Pages**.
4. اختر **Deploy from a branch** ثم فرع `main` ومجلد `/(root)`، واضغط **Save**.
5. انتظر رابط Pages وافتحه. استخدم رابط HTTPS.
6. لو لم يعمل تسجيل الدخول، راجع إعدادات Supabase Authentication → URL Configuration وأضف رابط موقع GitHub Pages إلى **Site URL** و **Redirect URLs** عند الحاجة.

## 3) اختبار محلي
يمكنك فتح `index.html` لمعاينة التصميم، وسيظهر عدد من المنتجات التجريبية. وظائف قاعدة البيانات ولوحة الأدمن تحتاج إعداد Supabase أولًا. الأفضل تشغيل الملفات عبر خادم محلي بسيط بدل فتح الملفات مباشرة.

## مهم قبل الاستخدام التجاري
- السلة الحالية تجريبية ولا تنشئ طلبًا في قاعدة البيانات ولا تنفّذ دفعًا. لا تعرض زرها كوسيلة دفع فعلية قبل بناء backend/checkout آمن.
- صور المنتجات حاليًا رموز تعبيرية؛ يمكن إضافة صور حقيقية لاحقًا.
- لا يوجد نظام شحن أو كوبونات أو إدارة طلبات في النسخة الحالية.
- `config.js` يحتوي فقط على عنوان المشروع والمفتاح العام؛ سياسات RLS في `schema.sql` هي التي تحمي تغييرات المنتجات. لا تعطِ أي حساب غير موثوق صلاحية admin.
- GitHub Pages يستضيف الواجهة الثابتة فقط؛ Supabase هو خدمة قاعدة البيانات وتسجيل الدخول.
