
import { useStyle } from './src/styles.js';
import { removeLoader, addLoader } from './loader.js';

function getOrdersPageTemplate() {
  return `
  <div id="content" class="hidden">
	<div class="purchases">
		<span class="flex-1">Order Id</span>
		<button class="flex flex-1" id='sorting-button-1'>
			<span>EVENT </span>
			<i class='fas fa-long-arrow-alt-up' id="sorting-icon-1"></i>
		</button>
		<span class="flex-1">Customer Name</span>
		<span class="flex-1">Ticket Category</span>
		<span class="flex-1">Number Of Tickets</span>
		<button class="hidden md:flex flex-1 text-center justify-center" id="sorting-button-2">
			<span>ORDERED AT</span>
			<i class='fas fa-long-arrow-alt-up' id="sorting-icon-2"></i>
		</button>
		<button class="hidden md:flex flex-1 text-center justify-center" id="sorting-button-3">
			<span>TOTAL PRICE</span>
			<i class='fas fa-long-arrow-alt-up' id="sorting-icon-3"></i>
		</button>
		<span class="w-28 sm:w-8"></span>
	</div>
</div>
<div id="purchases-content">
</div>

  `;
}
export async function renderOrdersPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  const purchaseContent = document.getElementById('purchases-content');

  addLoader();

  try {
    const orders = await fetchOrders();
    setTimeout(() => {
      removeLoader();
      addOrders(orders, purchaseContent);
    }, 200);
  } catch (error) {
    toastr.error('Error fetching orders');
  }

  eventSorting();
  dataSorting();
  priceSoritng();

}


async function fetchOrders() {
  const response = await fetch('https://localhost:7135/api/Order/GetAll');
  const data = await response.json();

  if (eventSortOrder === 'asc') {
    data.sort((a, b) => a.ticketCategory.localeCompare(b.ticketCategory));
  } else if (eventSortOrder === 'desc') {
    data.sort((a, b) => b.ticketCategory.localeCompare(a.ticketCategory));
  }

  if (dateSortOrder === 'asc') {
    data.sort((a, b) => a.orderedAt.localeCompare(b.orderedAt));
  } else if (dateSortOrder === 'desc') {
    data.sort((a, b) => b.orderedAt.localeCompare(a.orderedAt));
  }

  if (priceSortOrder === 'asc') {
    data.sort((a, b) => parseFloat(a.totalPrice) - parseFloat(b.totalPrice));
  } else if (priceSortOrder === 'desc') {
    data.sort((a, b) => parseFloat(b.totalPrice) - parseFloat(a.totalPrice));
  }

  return data;
}

function addOrders(orders, purchaseContent) {
  orders.forEach((order) => {
    const customerName = "Popescu Mirela";
    const newOrder = createOrderElement(order, customerName);
    addOrderToContainer(newOrder, purchaseContent);
  });
}

const createOrderElement = (orderData, customerName) => {
  const purchase = document.createElement('div');
  purchase.id = `purchase-${orderData.orderId}`;
  purchase.classList.add('purchase');

  const purchaseTitle = createParagraph(...useStyle('purchaseTitle'));
  purchaseTitle.textContent = orderData.orderId;
  purchase.appendChild(purchaseTitle);

  const purchaseEvent = createParagraph(...useStyle('purchaseTitle'));
  purchaseEvent.textContent = orderData.ticketCategory;
  purchase.appendChild(purchaseEvent);

  const purchaseCustomer = createParagraph(...useStyle('purchaseTitle'));
  purchaseCustomer.textContent = orderData.customerName;
  purchase.appendChild(purchaseCustomer);

  const purchaseTicket = createSelect(...useStyle('purchaseQuantity'));

  const standardOption = document.createElement('option');
  standardOption.value = 'Standard';
  standardOption.textContent = 'Standard';
  purchaseTicket.appendChild(standardOption);

  const vipOption = document.createElement('option');
  vipOption.value = 'VIP';
  vipOption.textContent = 'VIP';
  purchaseTicket.appendChild(vipOption);

  purchaseTicket.value = orderData.ticketCategory;
  purchaseTicket.disabled = true;
  const purchaseTypeWrapper = createDiv(...useStyle('purchaseTypeWrapper'));
  purchaseTypeWrapper.append(purchaseTicket);
  purchase.appendChild(purchaseTypeWrapper)


  const purchaseQuantity = createInput(...useStyle('purchaseQuantity'));
  purchaseQuantity.disabled = true;
  purchaseQuantity.value = `${orderData.numberOfTickets}`;
  const purchaseQuantityWrapper = createDiv(...useStyle('purchaseQuantityWrapper'));
  purchaseQuantityWrapper.append(purchaseQuantity);
  purchase.appendChild(purchaseQuantityWrapper)

  const purchaseDate = createDiv(...useStyle('purchaseDate'));
  purchaseDate.innerText = new Date(orderData.orderedAt).toLocaleDateString();
  purchase.appendChild(purchaseDate);

  const purchasePrice = createDiv(...useStyle('purchasePrice'));
  purchasePrice.innerText = orderData.totalPrice;
  purchase.appendChild(purchasePrice);

  const actions = createDiv(...useStyle('actions'));
  const editButton = createButton([...useStyle(['actionButton', 'editButton'])], '<i class="fas fa-edit"></i>', () => updateOrder(orderData, purchaseTicket, purchaseQuantity));
  actions.appendChild(editButton);

  const deleteButton = createButton([...useStyle(['actionButton', 'deleteButton'])], '<i class="fas fa-trash-alt"></i>', () => deleteOrder(orderData));
  actions.appendChild(deleteButton);

  purchase.appendChild(actions);
  function createDiv(...classes) {
    const div = document.createElement('div');
    div.classList.add(...claases);
    return div;
  }
  function createDiv(...classes) {
    const div = document.createElement('div');
    div.classList.add(...classes);
    return div;
  }
  function createParagraph(...classes) {
    const p = document.createElement('p');
    p.classList.add(...classes);
    return p;
  }

  function createInput(...classes) {
    const input = document.createElement('input');
    input.classList.add(...classes);
    return input;
  }

  function createSelect(...classes) {
    const select = document.createElement('select');
    select.classList.add(...classes);
    return select;
  }
  function createButton(classes, innerHTML, handler) {
    const button = document.createElement('button');
    button.classList.add(classes);
    button.innerHTML = innerHTML;
    button.addEventListener('click', handler);
    return button;

  }

  function updateOrder(orderData, purchaseTicket, purchaseQuantity) {
    purchaseTicket.disabled = false;
    purchaseQuantity.disabled = false;
    editButton.disabled = true;

    const saveButton = createButton([...useStyle(['actionButton', 'saveButton'])], '<i class="material-icons">check</i>', async () => {

      orderData.ticketCategory = purchaseTicket.value;
      orderData.numberOfTickets = purchaseQuantity.value;
      try {
        const response = await fetch('https://localhost:7135/api/Order/EntityUpdate', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderData.orderId,
            ticketCategory: orderData.ticketCategory,
            numberOfTickets: orderData.numberOfTickets,
          }),
        });
        renderOrdersPage();
      } catch (error) {
        toastr.error("There was an error processing the order! Try later!");
      }
      console.log(response);
      renderOrdersPage();
    });

    const cancelButton = createButton([...useStyle(['actionButton', 'cancelButton'])], '<i class="material-icons">close</i>', async () => {
      renderOrdersPage();
    });

    actions.innerHTML = '';
    actions.appendChild(saveButton);
    actions.appendChild(cancelButton);
  }


  async function deleteOrder(orderData) {
    console.log(orderData.orderId);
    if (confirm("Are you sure you want to delete this order?"))
      try {
        const response = await fetch('https://localhost:7135/api/Order/Delete?id=' + orderData.orderId, {
          method: 'Delete',
        });
        console.log(response);
        toastr.success("The order has been successfully deleted!");
        renderOrdersPage();
      } catch (error) {
        toastr.error("There was an error in deleting the order! Try later!");
      }
  }

  return purchase;
};


function addOrderToContainer(orderElement, container) {
  container.appendChild(orderElement);
}

let eventSortOrder = 'original';
let dateSortOrder = 'original';
let priceSortOrder = 'original';

function eventSorting() {
  const sortingIcon = document.getElementById('sorting-icon-1');
  const sortingButton1 = document.getElementById('sorting-button-1');
  sortingButton1.addEventListener('click', () => {
    if (eventSortOrder === 'original') {
      eventSortOrder = 'asc';
    } else if (eventSortOrder === 'asc') {
      eventSortOrder = 'desc';
    } else {
      eventSortOrder = 'original';
    }
    renderOrdersPage();
    console.log(eventSortOrder);
  });
}

function dataSorting() {
  const sortingButton2 = document.getElementById('sorting-button-2');
  sortingButton2.addEventListener('click', () => {
    if (dateSortOrder === 'original') {
      dateSortOrder = 'asc';
    } else if (dateSortOrder === 'asc') {
      dateSortOrder = 'desc';
    } else {
      dateSortOrder = 'original';
    }
    renderOrdersPage();
  });
}

function priceSoritng() {
  const sortingButton3 = document.getElementById('sorting-button-3');
  sortingButton3.addEventListener('click', () => {
    if (priceSortOrder === 'original') {
      priceSortOrder = 'asc';
    } else if (priceSortOrder === 'asc') {
      priceSortOrder = 'desc';
    } else {
      priceSortOrder = 'original';
    }
    renderOrdersPage();
  });
}

renderOrdersPage();
