$(document).ready(function() {

    $.ajaxSetup({cache:false});

    var height = $(document).height() - ($('#header').height() + $('#nav').height()) - 34 + 'px';
    $('#wrapper').css('height', height)


    $.getJSON('data.json', function(response) {
        $.each(response.slider, function(key, value) {
            $('#wrapper').append(` <div class="swiper-slide" style="background-image: url(${value.image});background-size: cover;background-position: center;"></div>`)
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

    

})