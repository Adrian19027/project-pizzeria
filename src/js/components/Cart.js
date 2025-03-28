import { select, classNames, templates, settings } from './settings.js';
import CartProduct from './CartProduct.js';

class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    getElements(element) {
      const thisCart = this;

      thisCart.dom = {};

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    }

    initActions() {
      const thisCart = this;

      /* toggle active class on thisCart.dom.wrapper */
      thisCart.dom.toggleTrigger.addEventListener('click', function () {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      })

      thisCart.dom.productList.addEventListener('updated', function () {
        thisCart.update();
      })

      thisCart.dom.productList.addEventListener('remove', function(event) {
        thisCart.remove(event.detail.cartProduct);
      })

      thisCart.dom.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisCart.sendOrder();
      })
    }

    add(menuProduct) {
      const thisCart = this;

      /* generate HTML based on template */
      const generatedHTML = templates.cartProduct(menuProduct);
      /* create element using utils.createElementFromHTML */
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      /* add element to menu */
      thisCart.dom.productList.appendChild(generatedDOM);
      console.log('adding product', menuProduct);

      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      console.log('thisCart.products', thisCart.products);
      thisCart.update();
    }

    update() {
      const thisCart = this;

      thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
      thisCart.totalPrice = 0;
      for (let thisCartProduct of thisCart.products) {
        thisCart.totalNumber += thisCartProduct.amount;
        thisCart.subtotalPrice += thisCartProduct.price;
      }
      if (thisCart.totalNumber > 0) {
        thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      } else {
        thisCart.totalPrice = 0;
        thisCart.deliveryFee = 0;
      }

      console.log('totalPrice', thisCart.totalPrice);
      for (let totalPriceElem of thisCart.dom.totalPrice) {
        totalPriceElem.innerHTML = thisCart.totalPrice;
      } 
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
      thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
      
    }

    remove(cartProduct) {
      const thisCart = this;

      const indexOfProduct = thisCart.products.indexOf(cartProduct);
      if (indexOfProduct !== -1) {
        thisCart.products.splice(indexOfProduct, 1);
      }

      cartProduct.dom.wrapper.remove();

      thisCart.update();
    }

    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;

      thisCart.payload = {};
      thisCart.payload.address = thisCart.dom.address.value;
      thisCart.payload.phone = thisCart.dom.phone.value;
      thisCart.payload.totalPrice = thisCart.totalPrice;
      thisCart.payload.subtotalPrice = thisCart.subtotalPrice;
      thisCart.payload.totalNumber = thisCart.totalNumber;
      thisCart.payload.deliveryFee = thisCart.deliveryFee;
      thisCart.payload.products = [];

      for (let prod of thisCart.products) {
        thisCart.payload.products.push(prod.getData());
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thisCart.payload),
      };

      fetch(url, options);
      
      console.log('thisCart.payload:',thisCart.payload);
    }
}
  
export default Cart;