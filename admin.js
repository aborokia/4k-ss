const cfg=window.STORE_CONFIG||{};
const ready=cfg.SUPABASE_URL&&!cfg.SUPABASE_URL.includes("YOUR-PROJECT")&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
const db=ready&&window.supabase?window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY):null;
const $=s=>document.querySelector(s);let currentProducts=[];
function msg(s){$("#adminMessage").textContent=s}
async function requireAdmin(){if(!db){$("#metricStatus").textContent="غير مربوط";$("#adminProducts").innerHTML='<p class="empty-admin">اربط قاعدة البيانات من config.js.</p>';msg("أكمل إعداد Supabase أولًا.");return false}
 const {data:{session}}=await db.auth.getSession();if(!session){location.href="login.html";return false}
 const {data:profile,error}=await db.from("profiles").select("role").eq("id",session.user.id).single();
 if(error||profile?.role!=="admin"){await db.auth.signOut();location.href="login.html";return false}
 $("#metricStatus").textContent="متصل";return true}
async function loadAdminProducts(){const {data,error}=await db.from("products").select("*").order("created_at",{ascending:false});if(error){msg("تعذر قراءة المنتجات. راجع سياسات RLS وملف schema.sql.");return}
 currentProducts=data||[];$("#metricProducts").textContent=currentProducts.length;$("#metricActive").textContent=currentProducts.filter(p=>p.active).length;
 $("#adminProducts").innerHTML=currentProducts.length?currentProducts.map(p=>`<article class="admin-product"><div><h3>${esc(p.name)}</h3><small>${esc(p.category)} · ${new Intl.NumberFormat("ar-EG").format(p.price)} ج.م · ${p.active?"نشط":"مخفي"}</small></div><div class="admin-actions"><button class="secondary-btn" data-edit="${esc(p.id)}">تعديل</button><button class="danger-btn" data-delete="${esc(p.id)}">حذف</button></div></article>`).join(""):'<p class="empty-admin">لسه مفيش منتجات. أضف أول منتج من النموذج.</p>'}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function reset(){ $("#productForm").reset();$("#productId").value="";$("#emoji").value="🎮";$("#active").checked=true;$("#formTitle").textContent="إضافة منتج جديد";msg("")}
$("#resetForm").addEventListener("click",reset);
$("#productForm").addEventListener("submit",async e=>{e.preventDefault();if(!db)return;const id=$("#productId").value;const item={name:$("#name").value.trim(),category:$("#category").value,price:Number($("#price").value),emoji:$("#emoji").value.trim()||"🎮",description:$("#description").value.trim(),active:$("#active").checked};
 if(!item.name||!Number.isFinite(item.price)||item.price<0){msg("راجع اسم المنتج والسعر.");return}
 const result=id?await db.from("products").update(item).eq("id",id).select().single():await db.from("products").insert(item).select().single();
 if(result.error){msg("فشل الحفظ. راجع صلاحيات قاعدة البيانات.");console.error(result.error);return}msg("تم حفظ المنتج.");reset();await loadAdminProducts()});
$("#adminProducts").addEventListener("click",async e=>{const edit=e.target.closest("[data-edit]");if(edit){const p=currentProducts.find(x=>String(x.id)===edit.dataset.edit);if(!p)return;$("#productId").value=p.id;$("#name").value=p.name;$("#category").value=p.category;$("#price").value=p.price;$("#emoji").value=p.emoji||"🎮";$("#description").value=p.description||"";$("#active").checked=!!p.active;$("#formTitle").textContent="تعديل المنتج";window.scrollTo({top:0,behavior:"smooth"});return}
 const del=e.target.closest("[data-delete]");if(del){const p=currentProducts.find(x=>String(x.id)===del.dataset.delete);if(!p||!confirm(`متأكد إنك عايز تحذف "${p.name}"؟`))return;const {error}=await db.from("products").delete().eq("id",p.id);if(error){msg("فشل الحذف. راجع صلاحيات قاعدة البيانات.");return}msg("تم حذف المنتج.");await loadAdminProducts()}});
$("#logout").addEventListener("click",async()=>{if(db)await db.auth.signOut();location.href="login.html"});
(async()=>{if(await requireAdmin())await loadAdminProducts()})();