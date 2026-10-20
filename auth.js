const cfg=window.STORE_CONFIG||{};
const ready=cfg.SUPABASE_URL&&!cfg.SUPABASE_URL.includes("YOUR-PROJECT")&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
const client=ready&&window.supabase?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
const form=document.querySelector("#loginForm"),message=document.querySelector("#message");
form.addEventListener("submit",async e=>{e.preventDefault();if(!client){message.textContent="اربط Supabase أولًا من ملف config.js واتبع README.";return}
 message.textContent="جاري التحقق...";
 const {data,error}=await client.auth.signInWithPassword({email:document.querySelector("#email").value.trim(),password:document.querySelector("#password").value});
 if(error){message.textContent="تعذر تسجيل الدخول: تأكد من البيانات وإعدادات Supabase.";return}
 const {data:profile,error:profileError}=await client.from("profiles").select("role").eq("id",data.user.id).single();
 if(profileError||profile?.role!=="admin"){await client.auth.signOut();message.textContent="الحساب ده مش عنده صلاحية الأدمن.";return}
 location.href="admin.html";
});