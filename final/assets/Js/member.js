document.addEventListener("DOMContentLoaded", function () {

  /* ===== 左側選單切換 ===== */
  const menuItems = document.querySelectorAll(".member-menu li[data-target]");
  const sections = document.querySelectorAll(".member-section");

  menuItems.forEach(item => {
    item.addEventListener("click", function () {
      const targetId = this.dataset.target;

      // 切換左側 active
      menuItems.forEach(i => i.classList.remove("active"));
      this.classList.add("active");

      // 切換右側內容
      sections.forEach(section => {
        section.classList.remove("active");
      });

      document.getElementById(targetId).classList.add("active");
    });
  });

  /* ===== 基本資料表單 ===== */
  const form = document.getElementById("memberForm");
  if (!form) return; // 非基本資料頁直接略過

  const nameInput = document.getElementById("userName");
  const emailInput = document.getElementById("userEmail");
  const phoneInput = document.getElementById("userPhone");

  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");

  const inputs = [nameInput, emailInput, phoneInput];

  function setReadonly(isReadonly) {
    inputs.forEach(input => input.disabled = isReadonly);
    editBtn.style.display = isReadonly ? "inline-block" : "none";
    saveBtn.style.display = isReadonly ? "none" : "inline-block";
  }

  // 讀取資料
  const savedMember = JSON.parse(localStorage.getItem("memberData"));
  if (savedMember) {
    nameInput.value = savedMember.name || "";
    emailInput.value = savedMember.email || "";
    phoneInput.value = savedMember.phone || "";
  }

  // 預設不可編輯
  setReadonly(true);

  editBtn.addEventListener("click", function () {
    setReadonly(false);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const memberData = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value
    };

    localStorage.setItem("memberData", JSON.stringify(memberData));
    alert("基本資料已更新");
    setReadonly(true);
    // ==== 購物車資料陣列 ====
let cart = [];

// ==== DOM 選取器 ====
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.querySelector('.right-box .material-icons:nth-child(2)'); // 購物車圖示
const closeCart = document.getElementById('close-cart');
const cartItemsDiv = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-footer .total');

// ==== 打開購物車 ====
cartIcon.addEventListener('click', () => {
  cartModal.style.display = 'flex';
  renderCart();
});

// ==== 關閉購物車 ====
closeCart.addEventListener('click', () => {
  cartModal.style.display = 'none';
});
cartModal.addEventListener('click', e => {
  if(e.target === cartModal) cartModal.style.display = 'none';
});

// ==== 點擊加入購物車 ====
document.querySelectorAll('.product-card button').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    const name = card.querySelector('h3').textContent;
    const price = parseInt(card.querySelector('.price').textContent.replace(/[^\d]/g,''));
    const img = card.querySelector('img').src;

    addToCart({name, price, img, quantity:1});
    cartModal.style.display = 'flex';
  });
});

// ==== 新增或增加商品數量 ====
function addToCart(item) {
  const existing = cart.find(i => i.name === item.name);
  if(existing){
    existing.quantity += 1;
  } else {
    cart.push(item);
  }
  renderCart();
}

// ==== 渲染購物車 ====
function renderCart(){
  cartItemsDiv.innerHTML = '';

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p class="price">NT$${item.price}</p>
        <div class="quantity">
          <button class="minus">-</button>
          <input type="text" value="${item.quantity}" readonly>
          <button class="plus">+</button>
        </div>
      </div>
      <button class="remove">刪除</button>
    `;
    cartItemsDiv.appendChild(div);

    // ==== 數量控制 ====
    div.querySelector('.minus').addEventListener('click', () => {
      if(item.quantity > 1) item.quantity--;
      renderCart();
    });
    div.querySelector('.plus').addEventListener('click', () => {
      item.quantity++;
      renderCart();
    });

    // ==== 刪除商品 ====
    div.querySelector('.remove').addEventListener('click', () => {
      cart.splice(index, 1);
      renderCart();
    });
  });

  // ==== 更新總額 ====
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  cartTotal.textContent = `總計：NT$${total}`;
}

  });

});
