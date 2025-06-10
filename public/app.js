let cart = [];

async function loadProducts() {
  const res = await fetch('/api/products'); 
  const products = await res.json();
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
      card.style.border = '1px solid #ccc';
      card.style.borderRadius = '8px';
      card.style.padding = '16px';
      card.style.margin = '10px 0';
      card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
      card.style.width = '260px';
  
      const name = document.createElement('h3');
      name.innerText = p.name;
  
      const price = document.createElement('p');
      price.innerText = `Cena: ${p.price} Kč`;
  
      const addButton = document.createElement('button');
      addButton.innerText = 'Přidat do košíku';
      addButton.onclick = () => addToCart(p);
  
      card.appendChild(name);
      card.appendChild(price);
      card.appendChild(addButton);
      container.appendChild(card);
  });
}

function openCart() {
  const cartModal = document.getElementById('cartModal');
  cartModal.classList.add('open'); // Přidáme třídu pro animaci otevření
}

function closeCart() {
  const cartModal = document.getElementById('cartModal');
  cartModal.classList.remove('open'); // Odebereme třídu pro zavření
}

function addToCart(product) {
  cart.push(product);
  updateCart();
}

function removeFromCart(product) {
  cart = cart.filter(item => item !== product);
  updateCart();
}

function updateCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';
  cart.forEach(p => {
    const item = document.createElement('div');
    item.textContent = p.name + p.price + ' Kč';
    cartDiv.appendChild(item);
    const removeButton = document.createElement('button');
    removeButton.innerText = 'Odebrat';
    removeButton.onclick = () => removeFromCart(p);
    cartDiv.appendChild(removeButton);
  });
}

function checkout() {
  document.getElementById('addressForm').style.display = 'block';
}

async function submitOrder() {
  const address = document.getElementById('address').value;
  const res = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address, items: cart })
  });
  const data = await res.json();
  if (data.success) {
    alert('Order placed!');
    cart.forEach(item => { 
      removeFromCart(item);
    });
  updateCart();
  document.getElementById('addressForm').style.display = 'none';
  }
}

loadProducts();
