'use strict';

class Cart
{
    constructor(cartClass) {
        this.class = cartClass;

        this.amount = 0; //Общая стоимость товаров
        this.cartItems = []; //Массив для хранения товаров
        this.getItems();
    }

    render($appendContainer) { // cart
        // отрисовываем корзину
        let $cartDiv = $('<div />', {
            class: this.class // cart__preview
        });

        let $arrow = $('<div />', {
            class: 'arrow cart__preview_arrow'
        });

        let $products = $('<div />', {
            class: 'products'
        });

        $cartDiv.appendTo($appendContainer);
        $arrow.appendTo($cartDiv);
        $products.appendTo($cartDiv);

        let $total = $('<div />', {
            class: 'cart__total',
            html: `<h4>TOTAL</h4><h4>&#36;${this.amount.toFixed(2)}</h4>`
        });

        let $checkoutBtn = $('<a />', {
            class: 'cart__checkout',
            href: 'checkout.html',
            text: 'Checkout'
        });

        let $cartBtn = $('<a />', {
            class: 'cart__go-to-cart',
            href: 'shopping-cart.html',
            text: 'Go to cart'
        });

        $total.appendTo(`.${this.class}`);
        $checkoutBtn.appendTo(`.${this.class}`);
        $cartBtn.appendTo(`.${this.class}`);

    }

    getItems()
    {
        $.ajax({
            type: 'GET',
            url: '../json/cart.json',
            dataType: 'json',
            context: this,
            success: function (data) {
                this.amount = data.amount;

                for (let i in data.cart){
                    this.cartItems.push(data.cart[i]);
                    let $cartData = $('<div />', {
                        class: 'product'
                    });
                    $cartData.append(`<img class="product__img" src="${data.cart[i].img_cart}" alt="${data.cart[i]
                        .product_name}">`);
                    $cartData.append(`<div class="product__text"><h5 class="product__text_h5">${data.cart[i]
                        .product_name}</h5><img class="product__text_img" src="../img/stars.png" alt="rate">
                        <p class="product__text_p">${data.cart[i].count} x &#36;${data.cart[i].price}</p></div>`);
                    $cartData.append(`<span class="product__remove" data-id="${data.cart[i].id_product}">
                        <i class="product__remove-fa fa fa-times-circle"></i></span>`);

                    $cartData.appendTo('.products');
                }

                this.refresh();

            },
            error: function (error) {
                console.log('Что-то пошло не так', error);
            }
        });
    }

    add(id) {
        if (this.amount === 0) {
            this.render($('.cart'));
        }
        $.ajax({
            type: 'GET',
            url: '../json/catalogData.json',
            dataType: 'json',
            context: this,
            success: function (data) {
                for (let i in data) {
                    if (data[i].id_product === id) {
                        data[i].count = 1;
                        this.cartItems.push(data[i]);
                        this.amount += data[i].price;
                        //
                        let $cartData = $('<div />', {
                            class: 'product'
                        });
                        $cartData.append(`<img class="product__img" src="${data[i].img_cart}" alt="${data[i].product_name}">`);
                        $cartData.append(`<div class="product__text"><h5 class="product__text_h5">${data[i].product_name}</h5>
                    <img class="product__text_img" src="../img/stars.png" alt="rate"><p class="product__text_p">${data[i].count} x &#36;${data[i].price}</p></div>`);
                        $cartData.append(`<span class="product__remove" data-id="${data[i].id_product}"><i class="product__remove-fa fa fa-times-circle"></i></span>`);

                        $cartData.appendTo('.products');

                        break;
                    }
                }
                this.refresh();

            },
            error: function (errorObj) {
                console.error(errorObj.status, errorObj.statusText);
            }
        });
    }

    remove(id) {
        for (let i in this.cartItems) {
            if (this.cartItems[i].id_product === id){
                this.amount -= this.cartItems[i].price;
                this.cartItems.splice(i, 1);
                break;
            }
        }
        this.refresh();
    }

    refresh() {
        $('.cart__total').empty();
        $('.cart__total').html(`<h4>TOTAL</h4><h4>&#36;${this.amount.toFixed(2)}</h4>`);
        if (this.amount === 0) {
            $(".cart__preview").remove()
            $('.cart__count').css('display', 'none');
        } else {
            $('.cart__count_number').text(this.cartItems.length);
            $('.cart__count').css('display', 'block');
        }

    }
}

//Создаем корзину
let cart = new Cart('cart__preview');
cart.render($('.cart'));

//Добавление товара в корзину
$('.add-to-cart').on('click', function () {
    let id = parseInt($(this).attr('data-id'));
    cart.add(id);
});

// Удаление товара из корзины
$('.cart').on('click', 'span', function () {
    let id = parseInt($(this).attr('data-id'));
    $(this).closest('.product').remove();
    cart.remove(id);
});