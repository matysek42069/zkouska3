let loggedIn = false;

async function login() {
  const username = document.getElementById('user').value;
  const password = document.getElementById('pass').value;

  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.success) {
    loggedIn = true;
    document.getElementById('adminPanel').style.display = 'block';
    loadOrders();
    loadProducts();
  } else {
    alert('Login failed');
  }
}

async function addProduct() {
  const name = document.getElementById('pname').value;
  const price = parseFloat(document.getElementById('pprice').value);

  const res = await fetch('/api/admin/add-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });

  const data = await res.json();
  alert(data.success ? 'Product added' : 'Failed to add');
}

async function editProduct(id, name, price) {
  const res = await fetch('/api/admin/edit-product', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, name, price })
  });

  const data = await res.json();
  alert(data.success ? 'Produkt upraven' : 'Chyba při úpravě');
}

async function deleteProduct(id) {
  const res = await fetch('/api/admin/delete-product', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });

  const data = await res.json();
  alert(data.success ? 'Produkt smazán' : 'Chyba při mazání');
  loadProducts(); // znovu načte produkty po smazání
}

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
      card.style.width = '120px';

    const nameSpan = document.createElement('h3');
    nameSpan.innerText = p.name;

    const priceSpan = document.createElement('span');
    priceSpan.innerText = ` - ${p.price} Kč`;

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Upravit';

    editBtn.onclick = () => {
      const nameInput = document.createElement('input');
      nameInput.value = p.name;

      const priceInput = document.createElement('input');
      priceInput.type = 'number';
      priceInput.value = p.price;

      card.replaceChild(nameInput, nameSpan);
      card.replaceChild(priceInput, priceSpan);
      editBtn.innerText = 'Uložit';

      editBtn.onclick = async () => {
        const newName = nameInput.value;
        const newPrice = parseFloat(priceInput.value);
        await editProduct(p.id, newName, newPrice);
        loadProducts(); // znovu načte seznam
      };
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Smazat';
    deleteBtn.onclick = () => {
      if (confirm(`Opravdu smazat produkt "${p.name}"?`)) {
       deleteProduct(p.id);
      }
    };
    
    card.appendChild(nameSpan);
    card.appendChild(priceSpan);
    card.appendChild(editBtn);
    card.appendChild(deleteBtn);
    container.appendChild(card);
  });
}

async function logout() {
  loggedIn = false;
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

function NewTab(URL) {
  window.open(`/${URL}`, '_blank'); //otevření URL v novém okně
}

async function loadOrders() {
  const res = await fetch('/api/admin/orders');
  const orders = await res.json();

  const container = document.getElementById('orders');
  container.innerHTML = '';  // Vyčistíme obsah před přidáním nových dat

  if (!orders || orders.length === 0) {
    container.innerHTML = 'Žádné objednávky k zobrazení.';
    return;
  }

  // Pro každou objednávku vytvoříme kartičku
  orders.forEach(order => {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card'; // Přidáme class pro stylování karty

    // Zobrazíme adresu objednávky
    const orderAddress = document.createElement('p');
    orderAddress.textContent = `Address: ${order.address} | Items: ${order.items.map(i => i.name).join(', ')}`;
    orderCard.appendChild(orderAddress);

    // Přidáme tlačítko pro smazání objednávky
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Smazat objednávku';
    deleteButton.onclick = () => {
      if (confirm(`Opravdu chcete smazat tuto objednávku?`)) {
        deleteOrder(order.id); // Zavoláme funkci pro smazání objednávky
      }
    };

    // Agregace počtu produktů v objednávce pro graf
    const productCounts = {};
    order.items.forEach(item => {
      productCounts[item.name] = (productCounts[item.name] || 0) + 1;
    });

    // Data pro graf
    const labels = Object.keys(productCounts);
    const data = Object.values(productCounts);

    // Vytvoříme graf pro každou objednávku
    const canvas = document.createElement('canvas');
    orderCard.appendChild(canvas);

    // Zavoláme funkci pro vykreslení grafu
    drawOrderChart(canvas, labels, data);

    //Přidám tlačítko pro smazání objednávky
    orderCard.appendChild(deleteButton);

    // Přidáme kartičku do kontejneru
    container.appendChild(orderCard);
  });
  }

  // Funkce pro vykreslení grafu objednávek
  function drawOrderChart(canvas, labels, data) {
    const ctx = canvas.getContext('2d');
  
    new Chart(ctx, {
      type: 'pie', // Koláčový graf
      data: {
        labels: labels,
        datasets: [{
          label: 'Počet objednávek produktů',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ]
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.label + ': ' + tooltipItem.raw;
              }
            }
          }
        }
      }
    });
  }  
loadOrders();

// Funkce pro smazání objednávky
async function deleteOrder(orderId) {
  const res = await fetch(`/api/admin/delete-order?orderId=${orderId}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (data.success) {
    alert('Objednávka byla smazána');
    loadOrders(); // Znovu načteme objednávky, aby se změna projevila
  } else {
    alert('Chyba při mazání objednávky');
  }
}
