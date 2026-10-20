const config = window.STORE_CONFIG || {};
const configured = config.SUPABASE_URL && !config.SUPABASE_URL.includes("YOUR-PROJECT") && config.SUPABASE_ANON_KEY && !config.SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
const db = configured && window.supabase ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY) : null;
const demoProducts = [
 {id:"demo1",name:"سماعة Phantom X",category:"سماعات",price:1450,description:"صوت محيطي وميكروفون واضح لجلسات اللعب.",emoji:"🎧"},
 {id:"demo2",name:"كيبورد Mecha RGB",category:"كيبورد",price:1890,description:"مفاتيح ميكانيكية وإضاءة RGB قابلة للتخصيص.",emoji:"⌨️"},
 {id:"demo3",name:"ماوس Viper Pro",category:"ماوس",price:790,description:"استجابة سريعة وتصميم مريح للتحكم.",emoji:"🖱️"},
 {id:"demo4",name:"ماوس باد Neon XL",category:"إكسسوارات",price:420,description:"مساحة واسعة وسطح انسيابي للحركة.",emoji:"🎮"}
];
let products=[], cart=[], activeCategory="الكل";
const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat("ar-EG",{maximumFractionDigits:0}).format(Number(n)||0)+" ج.م";
function toast(msg){const t=$("#toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
async function loadProducts(){
 if(db){const {data,error}=await db.from("products").select("*").eq("active",true).order("created_at",{ascending:false});if(!error&&data)products=data.map(p=>({...p,emoji:p.emoji||"🎮"}));else{products=demoProducts;console.warn(error)}}
 else products=demoProducts;
 renderProducts();
}
function renderProducts(){const grid=$("#productGrid");if(!grid)return;const shown=products.filter(p=>activeCategory==="الكل"||p.category===activeCategory);grid.innerHTML=shown.length?shown.map(p=>`<article class="product-card"><div class="product-image">${escapeHTML(p.emoji||"🎮")}</div><div class="product-category">${escapeHTML(p.category||"منتجات")}</div><h3>${escapeHTML(p.name)}</h3><div class="product-description">${escapeHTML(p.description||"معدات جيمينج مميزة.")}</div><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${escapeHTML(String(p.id))}" aria-label="أضف للسلة">+</button></div></article>`).join(""):'<div class="empty">مفيش منتجات في القسم ده حاليًا.</div>'}
function escapeHTML(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderCart(){const items=$("#cartItems");if(!items)return;$("#cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);items.innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><b>${escapeHTML(x.name)}</b><small>${money(x.price)} × ${x.qty}</small></div><div><b>${money(x.price*x.qty)}</b><button class="danger-btn" data-remove="${escapeHTML(String(x.id))}">حذف</button></div></div>`).join(""):'<p class="muted">السلة لسه فاضية. اختار منتجاتك الأول.</p>';$("#cartTotal").textContent=money(cart.reduce((n,x)=>n+x.price*x.qty,0))}
function openCart(){ $("#cartPanel")?.classList.add("open");$("#overlay")?.classList.add("open");}
function closeCart(){ $("#cartPanel")?.classList.remove("open");$("#overlay")?.classList.remove("open");}
document.addEventListener("click",e=>{
 const filter=e.target.closest("[data-category]");if(filter){activeCategory=filter.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===filter));renderProducts()}
 const add=e.target.closest("[data-add]");if(add){const p=products.find(x=>String(x.id)===add.dataset.add);if(p){const old=cart.find(x=>String(x.id)===String(p.id));old?old.qty++:cart.push({...p,qty:1});renderCart();toast("اتضاف المنتج للسلة");}}
 const remove=e.target.closest("[data-remove]");if(remove){cart=cart.filter(x=>String(x.id)!==remove.dataset.remove);renderCart()}
});
$("#cartBtn")?.addEventListener("click",openCart);$("#closeCart")?.addEventListener("click",closeCart);$("#overlay")?.addEventListener("click",closeCart);
$("#checkoutBtn")?.addEventListener("click",()=>toast("دي نسخة واجهة تجريبية؛ اربط نظام الطلبات قبل استقبال مدفوعات."));
$("#year")&&($("#year").textContent=new Date().getFullYear());
loadProducts();renderCart();