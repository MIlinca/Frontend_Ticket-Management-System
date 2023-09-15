import { useStyle } from './src/styles.js';
import {removeLoader,addLoader} from './loader.js';
import { kebabCase, addPurchase } from "/src/utils.js";
function getEventsTemplate() {
    return `
     <div id="content" class="hidden">
     <div class="search-bar">
     <input type="text" class="search-input" placeholder="Search..." id="search">
     <button class="search-button">Search</button>
   </div>
</li>
        <div class="events items-center justify-center flex-wrap">
        </div>
      </div>
    `;
  }
export async function renderEventsPage() {
    const mainContentDiv = document.querySelector('.main-content-component');
    mainContentDiv.innerHTML = getEventsTemplate();

    const searchButton = document.querySelector('.search-button');
    const searchInput = document.getElementById('search');

    addLoader();
    searchButton.addEventListener('click', async () => {
        try {
          const events = await fetchEvents();
          addEvents(events);
        } catch (error) {
          toastr.error('Error fetching events');
        }
      });

      searchInput.addEventListener('input', async () => {
        try {
          const events = await fetchEvents();
          addEvents(events);
        } catch (error) {
          toastr.error('Error fetching events');
        }
      });

    try {
      const events= await fetchEvents();
      setTimeout(() => {
        removeLoader();
        addEvents(events);
      }, 500); 
    } catch (error) {
      toastr.error('Error fetching events');
    }
  }

  async function fetchEvents() {
 
    const response = await fetch('https://localhost:7135/api/Event/GetAll');
    const data = await response.json();
    return data;
  }
  const addEvents = (events) => {
    const eventDiv = document.querySelector('.events');
    eventDiv.innerHTML = 'No events';

    const searchInput = document.getElementById('search').value.toUpperCase();
    const filteredEvents=events.filter(event=>event.name.toUpperCase().includes(searchInput));
    if (filteredEvents.length) {
        eventDiv.innerHTML = '';
        filteredEvents.forEach((Event) => {
          eventDiv.appendChild(createEvent(Event));
        });
      }
    };
  const createEvent = (eventData) => {
    const title = kebabCase(eventData.name);
    const eventElement = createEventElement(eventData, title);
    return eventElement;
  };
  const createEventElement = (eventData, title) => {
    const eventDiv = document.createElement('div');
    const eventWrapperClasses = useStyle('eventWrapper');
    const actionsWrapperClasses = useStyle('actionsWrapper');
    const quantityClasses = useStyle('quantity');
    
    const inputClasses = useStyle('input');
    const quantityActionsClasses = useStyle('quantityActions');
    const increaseBtnClasses = useStyle('increaseBtn');
    const decreaseBtnClasses = useStyle('decreaseBtn');
    const addToCartBtnClasses = useStyle('addToCartBtn');
    eventDiv.classList.add(...eventWrapperClasses);
  
    const eventFooter = document.createElement('footer');
    const addToCart = document.createElement('button');
    const actions = document.createElement('div');
    const quantity = document.createElement('div');
    const input = document.createElement('input');
  
    eventsImage(eventData);
    eventDiv.innerHTML = eventStyleInfo(eventData);
  
  
    actions.classList.add(...actionsWrapperClasses);
  
    actions.innerHTML = ticketTypeStyle(title);
  
  
    quantity.classList.add(...quantityClasses);
  
    input.classList.add(...inputClasses);
  
    quantityChanges(quantity, input, quantityActionsClasses, increaseBtnClasses, decreaseBtnClasses, addToCart);
    actions.appendChild(quantity);
    eventDiv.appendChild(actions);
    addToCart.classList.add(...addToCartBtnClasses);
    addToCart.innerText = 'Add To Cart';
    placeOrderStyle(title, addToCart, input);
  
    eventFooter.appendChild(addToCart);
    eventDiv.appendChild(eventFooter);
  
    return eventDiv;
  
  }
  
  function eventsImage(eventData) {
    if (eventData.name == 'Untold')
      eventData.image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMTTyRcPwPgNiqs4y23NQD5AIXXjcPpJ8vPQ&usqp=CAU';
    else if (eventData.name == 'Electric Castle')
      eventData.image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Electric_Castle_Festival_2016_%2827799854113%29.jpg/1200px-Electric_Castle_Festival_2016_%2827799854113%29.jpg';
    else if (eventData.name == 'Wine Festival')
      eventData.image = 'https://zcj.ro/images/db/1_3_250125_1688475563_06498_fav.jpg';
    else if (eventData.name == 'Coachella')
      eventData.image = 'https://whatthefrance.org/wp-content/uploads/2019/01/Coachella-724x302.png';
    else if (eventData.name == 'Yokote Kamakura Festival')
      eventData.image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ1_A6S-pEVdZ5HI1ok_QpbmSrZ5rz4glzVA&usqp=CAU';
    else if (eventData.name == 'Aomori Nebuta Festival')
      eventData.image = 'https://upload.wikimedia.org/wikipedia/commons/1/15/Aomori_Nebuta_AUG_2006_0002.jpg';
    else if (eventData.name == 'Mardi Gras')
      eventData.image = 'https://img.asmedia.epimg.net/resizer/dO8rZmiG20pTgPJQw83_JVPin04=/736x414/cloudfront-eu-central-1.images.arcpublishing.com/diarioas/FYECO3NQK5P6NOU3WY3GQ3KSFM.jpg';
    else if (eventData.name == 'Cannes Film Festival')
      eventData.image = 'https://cdn.vox-cdn.com/thumbor/u5RyN7nQwCP3f-AyA8vrILlEOZc=/0x0:2000x1200/920x613/filters:focal(866x155:1186x475):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/54794825/cannes2019.13.jpg';
  }
  
  function eventStyleInfo(eventData) {
    const contentMarkup = `
      <div class="event-card">
        <div class="event-details">
          <div class="event-title">${eventData.name}</div>
          <p class="description text-ivory">${eventData.description}</p>
        </div>
        <div class="event-image-container">
          <img src="${eventData.image}" alt="Event Image" class="event-image">
          <div class="info">
            <h1> Info  </h1>
            <p class="event-dates">
            <span class="text-lg font-bold mb-2 text-ivory">Venue:</span>
              <span class="date">${eventData.venue}</span><br>
              <span class="text-lg font-bold mb-2 text-ivory">Type:</span>
              <span class="date">${eventData.eventType}</span><br>
              <span class="text-lg font-bold mb-2 text-ivory">Start Date:</span>
              <span class="date">${new Date(eventData.startDate).toLocaleDateString()}</span><br>
              <span class="text-lg font-bold mb-2 text-ivory">End Date:</span>
              <span class="date">${new Date(eventData.endDate).toLocaleDateString()}</span><br>
              <span class="text-lg font-bold mb-2 text-ivory">Ticket Price:</span><br>
  <table class="table text-ivory">
    <tr>
      <th class="date">Category</th>
      <th class="date">Price</th>
    </tr>
    <tr>
      <td>Standard</td>
      <td>${eventData.ticketCategories[0].price}</td>
    </tr>
    <tr>
      <td>VIP</td>
      <td>${eventData.ticketCategories[1].price}</td>
    </tr>
  </table>
            </p>
          </div>
        </div>
      </div>
    `;
    return contentMarkup;
  }
  
  function ticketTypeStyle(title) {
   
    const categoriesOption = `
    <option value="Standard">Standard</option>
    <option value="VIP">VIP</option>
  `;
  const ticketTypeMarkup = `
  <div class="ticket-type-container">
    <h2 class="text-lg font-bold  text-ivory">Choose Ticket Type:</h2>
    <form>
    <select id="${title}-ticketType" name="ticketType" class="select ${title}-ticket-type border">
      ${categoriesOption}
    </select>
  </div>
  `;
    return ticketTypeMarkup
  }
  function quantityChanges(quantity, input, quantityActionsClasses, increaseBtnClasses, decreaseBtnClasses, addToCart) {
  
    input.min = '0';
    input.value = '0';
  
    input.addEventListener('input', () => {
      const currentQuantity = parseInt(input.value);
      if (currentQuantity > 0) {
        addToCart.disabled = false;
      } else {
        addToCart.disabled = true;
      }
    });
    quantity.appendChild(input);
  
    const quantityActions = document.createElement('div');
    quantityActions.classList.add(...quantityActionsClasses);
  
    const increase = document.createElement('button');
    increase.classList.add(...increaseBtnClasses);
    increase.innerText = '+';
  
    increase.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
      const currentQuantity = parseInt(input.value);
      if (currentQuantity > 0) {
        addToCart.disabled = false;
      } else {
        addToCart.disabled = true;
      }
    });
    const decrease = document.createElement('button');
    decrease.classList.add(...decreaseBtnClasses);
    decrease.innerText = '-';
  
    decrease.addEventListener('click', () => {
      input.value = parseInt(input.value) - 1;
      const currentQuantity = parseInt(input.value);
      if (currentQuantity > 0) {
        addToCart.disabled = false;
      } else {
        addToCart.disabled = true;
        input.value = 0;
      }
    });
    quantityActions.appendChild(decrease);
    quantityActions.appendChild(input);
    quantityActions.appendChild(increase);
  
    quantity.appendChild(quantityActions);
  }
  
  async function placeOrder(orderData) {
    try {
      addLoader();
      const response = await fetch('https://localhost:7135/api/Order/AddOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: 0,
          customerName: "Popescu Mirela",
          ticketCategory: orderData.ticketCategory,
          orderedAt: new Date().toISOString(),
          numberOfTickets: parseInt(orderData.numberOfTickets),
          totalPrice: 0, 
        }),
      });
      const responseData = await response.json();
  
      if (response.ok) {
        addPurchase(responseData);
        toastr.success("Order placed successfully!");
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      toastr.error("There was an error processing the order! Try later!");
    } finally {
      setTimeout(() => {
        removeLoader();
      }, 200); 
    }
  }

  function placeOrderStyle(title, addToCart, input) {
    addToCart.disabled = true;
    addToCart.addEventListener('click', () => {
      const ticketType = document.getElementById(`${title}-ticketType`).value;
      const quantity = parseInt(input.value);
      if (ticketType && quantity > 0) {
        try {
          const orderData = {
            ticketCategory: ticketType,
            numberOfTickets: quantity,
          };
  
          const response = placeOrder(orderData);
  
          console.log('Order placed:', response);
          addToCart.disabled = true;
          input.value = '0';
          document.getElementById(`${title}-ticketType`).selectedIndex = 0;
  
        } catch (error) {
          toastr.error('Error placing order:');
        }
      } else {
        toastr.error('Please select a ticket type and quantity.');
      }
    });
  }
  