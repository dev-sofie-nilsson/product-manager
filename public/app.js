document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  document.getElementById('product-form').addEventListener('submit', handleSubmit);
});

async function fetchProducts() {
  const response = await fetch('/api/products');
  const products = await response.json();
  renderProducts(products);
}

function renderProducts(products) {
  const tbody = document.getElementById('products-body');
  tbody.innerHTML = '';

  products.forEach(product => {
    const tr = document.createElement('tr');
    tr.classList.add('even:bg-gray-50');
    tr.innerHTML = `
      <td class="px-3 py-2 text-sm border-b border-gray-200">${product.name}</td>
      <td class="px-3 py-2 text-sm border-b border-gray-200">${product.sku}</td>
      <td class="px-3 py-2 text-sm border-b border-gray-200">${product.price}</td>
      <td class="px-3 py-2 text-sm border-b border-gray-200 text-center">
        <button class="delete-btn hover:text-red-500" data-id="${product.id}">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', handleDelete);
  });
}

async function handleSubmit(e) {
  e.preventDefault();

  const errorEl = document.getElementById('form-error');
  errorEl.textContent = '';

  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const sku = document.getElementById('sku').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!name || !sku || !description || isNaN(price)) {
    errorEl.textContent = 'Alla fält är obligatoriska.';
    return;
  }

  if (price <= 0) {
    errorEl.textContent = 'Priset måste vara ett positivt tal.';
    return;
  }

  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, sku, description })
  });

  if (response.status === 201) {
    const newProduct = await response.json();
    addProductToTable(newProduct);
    document.getElementById('product-form').reset();
  } else {
    const data = await response.json();
    errorEl.textContent = data.error || 'Något gick fel, försök igen.';
  }
}

function addProductToTable(product) {
  const tbody = document.getElementById('products-body');
  const tr = document.createElement('tr');
  tr.classList.add('even:bg-gray-50');
  tr.innerHTML = `
    <td class="px-3 py-2 text-sm border-b border-gray-200">${product.name}</td>
    <td class="px-3 py-2 text-sm border-b border-gray-200">${product.sku}</td>
    <td class="px-3 py-2 text-sm border-b border-gray-200">${product.price}</td>
    <td class="px-3 py-2 text-sm border-b border-gray-200 text-center">
      <button class="delete-btn hover:text-red-500" data-id="${product.id}">🗑</button>
    </td>
  `;
  tbody.appendChild(tr);
  tr.querySelector('.delete-btn').addEventListener('click', handleDelete);
}

async function handleDelete(e) {
  const id = e.target.dataset.id;

  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE'
  });

  if (response.status === 204) {
    e.target.closest('tr').remove();
  } else {
    alert('Kunde inte ta bort produkten. Försök igen.');
  }
}