document.addEventListener("DOMContentLoaded", function () {

  // ==== 1. 初始化：從 localStorage 讀取，若無則設為空陣列 ====
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // ==== DOM 選取器 ====
  const cartModal = document.getElementById('cart-modal');
  const cartIcon = document.querySelector('.right-box .material-icons:nth-child(2)'); 
  const closeCart = document.getElementById('close-cart');
  const cartItemsDiv = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-footer .total');
  const checkoutBtn = document.querySelector('.cart-footer .checkout');

  // ==== 2. 新增：儲存函式（供內部重複呼叫） ====
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

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

  // ==== 前往結帳 ====
  if(checkoutBtn){
    checkoutBtn.addEventListener('click', () => {
      window.location.href = 'pay.html';
    });
  }

  // ==== 點擊加入購物車（商品列表頁） ====
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

  // ==== 點擊加入購物車（商品詳情頁） ====
  const addCartBtn = document.querySelector('.add-cart');
  if(addCartBtn){
    addCartBtn.addEventListener('click', () => {
      const name = document.querySelector('.product-info h1').textContent;
      const price = parseInt(document.querySelector('.product-info .price').textContent.replace(/[^\d]/g,''));
      const img = document.querySelector('.product-images .main-img').src;
      const quantity = parseInt(document.getElementById('quantity').value);

      addToCart({name, price, img, quantity});
      cartModal.style.display = 'flex';
    });
  }

  // ==== 新增或增加商品數量 ====
  function addToCart(item) {
    const existing = cart.find(i => i.name === item.name);
    if(existing){
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    saveCart(); // 儲存變動
    renderCart();
  }

  // ==== 渲染購物車 ====
  function renderCart(){
    cartItemsDiv.innerHTML = '';

    if(cart.length === 0){
      cartItemsDiv.innerHTML = '<p>購物車內尚無商品</p>';
    }

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
        if(item.quantity > 1) {
          item.quantity--;
          saveCart(); // 儲存變動
          renderCart();
        }
      });
      div.querySelector('.plus').addEventListener('click', () => {
        item.quantity++;
        saveCart(); // 儲存變動
        renderCart();
      });

      // ==== 刪除商品 ====
      div.querySelector('.remove').addEventListener('click', () => {
        cart.splice(index, 1);
        saveCart(); // 儲存變動
        renderCart();
      });
    });

    // ==== 更新總額 ====
    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    cartTotal.textContent = `總計：NT$${total}`;
  }

});