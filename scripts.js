$(document).ready(function() {

    $.ajaxSetup({cache:false});
    var cart = [];

    var height = $(document).height() - ($('#header').height() + $('#nav').height()) - 60 + 'px';
    $('#wrapper').css('height', height)


    $.getJSON('data.json', function(response) {
        $.each(response.slider, function(key, value) {
            $('#wrapper').append(`<div class="swiper-slide" style="background-image: url(${value.image});background-size: cover;background-position: center;"></div>`)
        })
        
    var swiper = new Swiper('.swiper-container',{
        loop:true,
        navigation:{
            nextEl:'.swiper-button-next',
            prevEl:'.swiper-button-prev'
        },
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
        keyboard:true,
        pagination:{
            el:'.swiper-pagination',
            clickable:true
        },
        spaceBetween:20,
    });
    })

    if (window.XMLHttpRequest) {
        var xml = new XMLHttpRequest();
    } else {
        var xml = new window.ActiveXObject("Microsoft.XMLHTTP");
    }

    xml.onreadystatechange = function() {
        if (xml.readyState === 4 && xml.status === 200) {
            $('#headline').text(xml.responseText);
        } else if (xml.readyState < 4 && xml.status === 404 || xml.status === 403) {

            $.getScript('Headline.txt', function(data) {
                $('#headline').text(data);
            })
            .done(function(data) {
                $('#headline').text(data);
            })
            .error(function(exception) {
               console.error(exception);
            })
    
        }
    }

    xml.open("GET", "Headline.txt", true);
    xml.send();

    $.get({
        url:"data.json",
        dataType:'json',
        contentType:'application/json',
        async:true,
        isModified:false,
        timeout:5000,
        username:'marko.perovic',
        password:'*******',
        type:'GET'
    })
    .done(function(response) {
        $.each(response.links, function(key, link) {
            $('#nav').append(`<a href="${link.href}" class="nav-link text-light text-decoration-none">${link.text}</a>`);
        })
    })
    .fail(function(exception) {
        console.warn(exception);
    })
    .always(function() {
        console.log();
    })

    $.ajax('products.json',{
        type:'GET'
    })
    .done(function(response) {
        $.each(response, function(key, product) {
            $('#products').append(`<article class="pb-2 d-flex justify-content-center align-items-center flex-column article"><img src="${product.image}" alt=""><h4 class="text-muted">${product.title}</h4><h4>$ ${product.price}</h4><button class="btn btn-warning add" onclick="$.fn.adddToCart('${product.id}','${product.title}','${product.price}','${product.image}')" id="${product.id}">ADD TO CART</button></article>`)
        })
    })
    .fail(function(error) {
        console.log(error);
    })

    $('#show-cart').click(function() {
        $.fn.showCart()
    })

    $.fn.showCart = function() {
        $('#cart').addClass('show-cart');
        $('#cart').removeClass('hide-cart');
        $('#overlay').css('display','flex');
        $('#overlay').removeClass('hide-overlay');
        $('#cart').css('display','flex');
    }

    $.fn.hideCart = function() {
        $('#cart').removeClass('show-cart');
        $('#cart').addClass('hide-cart');
        $('#overlay').addClass('hide-overlay');
        setTimeout(() => {
        $('#overlay').css('display','none');
        $('#cart').css('display','none');
       }, 300);
    }

    $('#close-cart').click(function() {
        $.fn.hideCart()
    })

    $.fn.adddToCart = function(id, title, price, image) {
            cart.push({
                id:id,
                title:title,
                price:price,
                image:image
            })

            $('#'+id).text("IN CART");
            $('#'+id).removeClass("btn-warning");
            $('#'+id).addClass("btn-danger");
            $('#'+id).attr("disabled", true);
          
            $.fn.totalPrice(price)
            $.fn.displayCartProducts(id)
          sessionStorage.setItem(id,1)

     }

     $.fn.displayCartProducts = function(id) {
        $('#cart-items').html('');
         var inCart = cart.find(item =>item.id === id);

         if (inCart) {
             $.each(cart, function(key, product) {
                $('#cart-items').append(`<article class="d-flex justify-content-around align-items-center flex-row w-100 cart-article"><div class="d-flex justify-content-center align-items-start"><img src="${product.image}" alt="" class="cart-image img-thumbnail"><div class="d-flex justify-content-center align-items-start flex-column info"><p class="text-muted name">${product.title}</p><p class="text-dark name">$ ${product.price}</p></div></div><button class="btn btn-dark remove-btn" onclick="$.fn.removeFromCart('${product.id}','${product.price}')">REMOVE</button><div class="d-flex justify-content-center align-items-center flex-column buttons"><button class="btn btn-success amount-plus btn-sm" onclick="$.fn.increaseAmount('${product.id}','${product.price}')">+</button><p class="text-muted amount" id="${product.id}amount">1</p><button class="btn btn-danger amount-minus btn-sm" onclick="$.fn.decreaseAmount('${product.id}','${product.price}')">-</button></div></article>`)
             })
         }
     }

     $.fn.removeFromCart = function(id, price) {
         cart = cart.filter(item => {
             return item.id !== id;
         })
        
         $('#'+id).text("ADD TO CART");
         $('#'+id).addClass("btn-warning");
         $('#'+id).removeClass("btn-danger");
         $('#'+id).attr("disabled", false)
         $.fn.totalPrice(-price * parseInt($('#'+ id + "amount").text()));

         $('#cart-items').html('');
         $.each(cart, function(key, value) {
             console.log(value.id)
             $.fn.displayCartProducts(value.id);        
             $('#'+ value.id + "amount").text(parseInt(sessionStorage.getItem(value.id)))
        })
     }

     $.fn.increaseAmount = function(id,price) {
         var amount = +$('#'+ id + "amount").text();
         $('#'+ id + "amount").text(amount + 1)
         $.fn.totalPrice(price)
         sessionStorage.setItem(id,+$('#'+ id + "amount").text());
     }

     $.fn.decreaseAmount = function(id,price) {
        var amount = +$('#'+ id + "amount").text();
        
        if (amount === 1) {
            $.fn.removeFromCart(id, price);
        } else {     
            $('#'+ id + "amount").text(amount -1)
            $.fn.totalPrice(-price)
            sessionStorage.setItem(id,+$('#'+ id + "amount").text());
        }
    }

    $('#clear-cart').click(function() {
        $.each(cart, function(key, value) {
            $.fn.removeFromCart(value.id, value.price);
        })
        $('#value').text(0)
        $.fn.hideCart();
    })

    $.fn.totalPrice = function(price) {
        var currentPrice = +$('#value').text();
        $('#value').text(currentPrice + parseInt(price))
    }

    $('#asc').click(function() {
        $('#products').html('');

        $.ajax('products.json',{
            type:'GET'
        })
        .done(function(response) {
            response = response.sort((a,b) => {return a.price- b.price} )
            $.each(response, function(key, product) {
                $('#products').append(`<article class="pb-2 d-flex justify-content-center align-items-center flex-column article"><img src="${product.image}" alt=""><h4 class="text-muted">${product.title}</h4><h4>$ ${product.price}</h4><button class="btn btn-warning add" onclick="$.fn.adddToCart('${product.id}','${product.title}','${product.price}','${product.image}')" id="${product.id}">ADD TO CART</button></article>`)
            })
        })
        .fail(function(error) {
            console.log(error);
        })
    
    })

    $('#sort').click(function() {
        if (document.getElementById('list').style.display === 'flex') {
            $('#list').css('display','none')
        } else {
            $('#list').css('display','flex')                 
        }
    })

    $.getJSON('data.json',function(data) {
        $.each(data.sort, function(key, data) {   
            $('#list').append(`<button class="list-group-item btn-warning" onclick="${data.function}">${data.text}</button>`)
        })
    })

    $.fn.ascPrice = function() {
        $('#products').html('');

        $.ajax('products.json',{
            type:'GET'
        })
        .done(function(response) {
            response = response.sort((a, b) => {
                return a.price - b.price;
            })
            $.each(response, function(key, product) {
                $('#products').append(`<article class="pb-2 d-flex justify-content-center align-items-center flex-column article"><img src="${product.image}" alt=""><h4 class="text-muted">${product.title}</h4><h4>$ ${product.price}</h4><button class="btn btn-warning add" onclick="$.fn.adddToCart('${product.id}','${product.title}','${product.price}','${product.image}')" id="${product.id}">ADD TO CART</button></article>`)
            })
        })
        .fail(function(error) {
            console.log(error);
        })
        $('#list').css('display','none')
    }

    $.fn.descPrice = function() {
        $('#products').html('');

        $.ajax('products.json',{
            type:'GET'
        })
        .done(function(response) {
            response = response.sort((a, b) => {
                return b.price - a.price;
            })
            $.each(response, function(key, product) {
                $('#products').append(`<article class="pb-2 d-flex justify-content-center align-items-center flex-column article"><img src="${product.image}" alt=""><h4 class="text-muted">${product.title}</h4><h4>$ ${product.price}</h4><button class="btn btn-warning add" onclick="$.fn.adddToCart('${product.id}','${product.title}','${product.price}','${product.image}')" id="${product.id}">ADD TO CART</button></article>`)
            })
        })
        .fail(function(error) {
            console.log(error);
        })
        $('#list').css('display','none')
    }

    $.fn.ascName = function() {
        $('#products').html('');

        $.ajax('products.json',{
            type:'GET'
        })
        .done(function(response) {
            response = response.sort((a, b) => {
                if(a.title < b.title) {
                     return -1; 
                }
            })

            $.each(response, function(key, product) {
                $('#products').append(`<article class="pb-2 d-flex justify-content-center align-items-center flex-column article"><img src="${product.image}" alt=""><h4 class="text-muted">${product.title}</h4><h4>$ ${product.price}</h4><button class="btn btn-warning add" onclick="$.fn.adddToCart('${product.id}','${product.title}','${product.price}','${product.image}')" id="${product.id}">ADD TO CART</button></article>`)
            })
        })
        .fail(function(error) {
            console.log(error);
        })
        $('#list').css('display','none')
    }

    $.fn.descName = function() {
        $('#products').html('');

        $.ajax('products.json',{
            type:'GET'
        })
        .done(function(response) {
            response = response.sort((a, b) => {
                if (a.title > b.title) {
                    return -1;
                }
            })

            $.each(response, function(key, product) {
                $('#products').append(`<article class="pb-2 d-flex justify-content-center align-items-center flex-column article"><img src="${product.image}" alt=""><h4 class="text-muted">${product.title}</h4><h4>$ ${product.price}</h4><button class="btn btn-warning add" onclick="$.fn.adddToCart('${product.id}','${product.title}','${product.price}','${product.image}')" id="${product.id}">ADD TO CART</button></article>`)
            })
        })
        .fail(function(error) {
            console.log(error);
        })
        $('#list').css('display','none')
    }

    $('#contact').css('height',$(window).height() + 'px')
})