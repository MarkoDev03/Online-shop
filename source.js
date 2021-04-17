var productWrapper = document.getElementById('product-wrapper');
productWrapper.style.height = window.innerHeight - 20 +  'px';

var cart = [];
var buttonsDOM = [];
//get products from json file
class DataProvider{

    //get products function
    async getProducts() {
        try {
            let data = await fetch('products.json');
            let items = await data.json();
            let product = items.products;
            product = product.map(item =>{
                let id = item.id;
                let name = item.name;
                let image = item.image;
                let price = item.price;
                return {id, name, image, price};
            })
            console.warn(product);
            return product;
        }
        catch(error) {
            console.error(error);
        }
    }
}

//class for user interface 
class UserInterface{

    //display products on page
    displayProducts(products) {
        let itemHTML = '';
        products.forEach(item => {
            itemHTML += ` <article class="product">
            <div class="product-header">
              <div>
                <span class="fas fa-indent white"></span>
                <span>category</span>
              </div>
              <div data-id="${item.id}">
                <span>add to cart</span><span class="fas fa-cart-plus white"></span>
              </div>
            </div>
    
            <img src="${item.image}" alt="" class="product-image" />
            <div class="text-wrapper">
              <div class="text">
                <h3>${item.name}</h3>
                <p class="price">$ ${item.price}</p>
              </div>
              <div class="info">
                <div>
                  <span class="fas fa-check-double"></span><span>Available</span>
                </div>
                <div class="tp-margin">
                    <span class="fas fa-money-bill-alt"></span><span>Payment</span>
                </div>
              </div>
            </div>
    
            <div class="description">This is description for product</div>
          </article>`
        });
        productWrapper.innerHTML += itemHTML;
    }

    //get all add to cart buttons and trigger on click
    getAddTocartButton() {
       var buttons = [...document.querySelectorAll('.fa-cart-plus')];
       buttonsDOM = buttons;
       buttons.forEach(button =>{
           let id = button.dataset.id;
           let inCart = cart.find(item => item.id === id);
           if(inCart) {
               button.disabled = true;
               button.innerHTML = `<span>in cart</span>`;
           }else {
               button.addEventListener('click',event =>{
                   button.disabled = true;
                   button.innerHTML = `<span>in cart</span>`;
               
                   let cartItem = {...Storage.getProduct(id),amount:1};
                   cart = [...cart,cartItem];
                   Storage.saveCart(cart);
                   this.setCartValues(cart);
                   this.addCartItem(cartItem);
               })
           }
       })
    }

    //set values to cart
    setCartValues(cart) {
        let totalPrice = 0;
        let totalAmount = 0;
        cart.forEach(item =>{
            totalPrice = item.price * item.amount;
            totalAmount = item.amount;
        })
        
    }

}

//site storage
class Storage{
      
    //save products to localstorage
    static savePorducts(products) {
        localStorage.setItem("products",JSON.stringify(products));
    }

    //get product from localstorage
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }

    //save cart to localstorage
    static saveCart(cart) {
        localStorage.setItem("cart",JSON.stringify(cart));
    }

    //get cart from localstorage
    static getCart() {
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    }
}

document.addEventListener('DOMContentLoaded',() =>{
    var dataProvider = new DataProvider();
    var userInterface = new UserInterface();

    dataProvider.getProducts().then(item => userInterface.displayProducts(item))
})



//show swiper 
fetch('products.json').then(response => response.json()).then(data => slideShow(data));

var container = document.getElementById('container');
var wrapper = document.getElementById('wrapper');

container.style.height = window.innerHeight - 80 + 'px';

function slideShow(data) {
    var slideshows = data.swiper;

    slideshows.forEach(slides =>{
         wrapper.innerHTML += `<div class="${slides.class}" style="background-image:url(${slides.image});background-size:cover;">
         <div class="ambient-name">
         <h1>Ambient name</h1>
         <p>This is description for this ambient, you can visit</p>
         <button class="button-collection">VISIT</button>
         </div>
         </div>`;      
    })

    var swiper = new Swiper('.swiper-container',{
        navigation:{
            nextEl:'.swiper-button-next',
            prevEl:'.swiper-button-prev',
        },
        loop:true,
        pagination: {
            el: '.swiper-pagination',
          }, 
          effect: 'fade',
         autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
   });
 
}

