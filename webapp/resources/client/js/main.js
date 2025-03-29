(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);

    //dragon
    document.addEventListener('DOMContentLoaded', function () {
        const navbarBrand = document.querySelector('.navbar-brand');
        const dragon = document.querySelector('#dragon');
        const fixedTop = document.querySelector('.fixed-top');

        // Biến cờ để kiểm tra trạng thái trượt về
        let isReturning = false;

        // Chỉ xóa class, để trạng thái ban đầu từ CSS
        dragon.classList.remove('animating', 'sliding');

        function handleScroll() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowWidth = window.innerWidth;
            const isAnimating = dragon.classList.contains('animating');
            const isSliding = dragon.classList.contains('sliding');
            const currentLeft = window.getComputedStyle(dragon).left;

            if (windowWidth < 992) {
                // Màn hình nhỏ: reset tất cả
                fixedTop.style.top = '0px';
                fixedTop.classList.remove('shadow');
                navbarBrand.style.marginLeft = '0px';
                dragon.style.left = '0px';
                dragon.style.transform = 'rotateY(0deg)';
                dragon.style.transition = 'transform 0.5s ease-in-out, left 0.5s ease-in-out';
                dragon.classList.remove('animating', 'sliding');
                isReturning = false; // Reset cờ
            } else {
                // Màn hình lớn
                if (scrollTop > 55 && !isReturning) { // Chỉ xử lý cuộn xuống nếu không đang trượt về
                    fixedTop.style.top = '-55px';
                    fixedTop.classList.add('shadow');
                    navbarBrand.style.marginLeft = '-200px';

                    if (currentLeft !== '-700px' || dragon.style.transform !== 'rotateY(180deg)') {
                        if (isAnimating && !isSliding) {
                            dragon.style.transition = 'none';
                            dragon.style.left = currentLeft;
                            dragon.removeEventListener('transitionend', null);

                            dragon.style.transition = 'transform 0.5s ease-in-out';
                            dragon.style.transform = 'rotateY(180deg)';

                            dragon.addEventListener('transitionend', function handleRotateEnd(e) {
                                if (e.propertyName === 'transform' && window.scrollY > 55) {
                                    dragon.classList.add('sliding');
                                    dragon.style.left = '-700px';
                                    dragon.style.transition = 'left 1s ease-in-out';

                                    dragon.addEventListener('transitionend', function handleSlideEnd(e) {
                                        if (e.propertyName === 'left') {
                                            dragon.classList.remove('animating', 'sliding');
                                            dragon.removeEventListener('transitionend', handleSlideEnd);
                                        }
                                    }, { once: true });
                                }
                                dragon.removeEventListener('transitionend', handleRotateEnd);
                            }, { once: true });
                        } else if (!isAnimating) {
                            dragon.classList.add('animating');
                            dragon.style.transition = 'transform 1s ease-in-out';
                            dragon.style.transform = 'rotateY(180deg)';

                            dragon.addEventListener('transitionend', function handleRotateEnd(e) {
                                if (e.propertyName === 'transform' && window.scrollY > 55) {
                                    dragon.classList.add('sliding');
                                    dragon.style.left = '-700px';
                                    dragon.style.transition = 'left 1s ease-in-out';

                                    dragon.addEventListener('transitionend', function handleSlideEnd(e) {
                                        if (e.propertyName === 'left') {
                                            dragon.classList.remove('animating', 'sliding');
                                            dragon.removeEventListener('transitionend', handleSlideEnd);
                                        }
                                    }, { once: true });
                                }
                                dragon.removeEventListener('transitionend', handleRotateEnd);
                            }, { once: true });
                        }
                    }
                } else if (scrollTop <= 55) {
                    fixedTop.style.top = '0px';
                    fixedTop.classList.remove('shadow');
                    navbarBrand.style.marginLeft = '0px';

                    if (isAnimating) {
                        if (!isSliding) {
                            // Đang xoay: Xoay về 0deg
                            isReturning = true; // Đánh dấu đang trở về
                            dragon.style.transform = 'rotateY(0deg)';
                            dragon.style.transition = 'transform 0.5s ease-in-out';
                            dragon.addEventListener('transitionend', function handleReverseRotate(e) {
                                if (e.propertyName === 'transform') {
                                    dragon.classList.remove('animating', 'sliding');
                                    isReturning = false; // Reset cờ khi hoàn thành
                                    dragon.removeEventListener('transitionend', handleReverseRotate);
                                }
                            }, { once: true });
                        } else {
                            // Đang trượt: Dừng trượt, xoay về 0deg, rồi trượt về 0px
                            isReturning = true; // Đánh dấu đang trở về
                            dragon.style.transition = 'none';
                            dragon.style.left = currentLeft;
                            dragon.removeEventListener('transitionend', null);

                            requestAnimationFrame(() => {
                                dragon.style.transition = 'transform 0.5s ease-in-out';
                                dragon.style.transform = 'rotateY(0deg)';
                                dragon.addEventListener('transitionend', function handleReverseRotate(e) {
                                    if (e.propertyName === 'transform') {
                                        dragon.style.left = '0px';
                                        dragon.style.transition = 'left 0.15s ease-in-out';
                                        dragon.addEventListener('transitionend', function handleSlideBack(e) {
                                            if (e.propertyName === 'left') {
                                                dragon.classList.remove('animating', 'sliding');
                                                isReturning = false; // Reset cờ khi hoàn thành
                                                dragon.removeEventListener('transitionend', handleSlideBack);
                                            }
                                        }, { once: true });
                                        dragon.removeEventListener('transitionend', handleReverseRotate);
                                    }
                                }, { once: true });
                            });
                        }
                    } else if (currentLeft === '-700px') {
                        // Đã trượt xong: Xoay về 0deg trước, rồi trượt về 0px
                        isReturning = true; // Đánh dấu đang trở về
                        dragon.classList.add('animating');
                        dragon.style.transform = 'rotateY(0deg)';
                        dragon.style.transition = 'transform 0.5s ease-in-out';

                        dragon.addEventListener('transitionend', function handleReverseRotate(e) {
                            if (e.propertyName === 'transform') {
                                dragon.style.left = '0px';
                                dragon.style.transition = 'left 0.5s ease-in-out';
                                dragon.addEventListener('transitionend', function handleSlideBack(e) {
                                    if (e.propertyName === 'left') {
                                        dragon.classList.remove('animating', 'sliding');
                                        isReturning = false; // Reset cờ khi hoàn thành
                                        dragon.removeEventListener('transitionend', handleSlideBack);
                                    }
                                }, { once: true });
                                dragon.removeEventListener('transitionend', handleReverseRotate);
                            }
                        }, { once: true });
                    }
                }
            }
        }

        function handleResize() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowWidth = window.innerWidth;
            const currentLeft = window.getComputedStyle(dragon).left;

            if (windowWidth < 992) {
                fixedTop.style.top = '0px';
                fixedTop.classList.remove('shadow');
                navbarBrand.style.marginLeft = '0px';
                dragon.style.left = '0px';
                dragon.style.transform = 'rotateY(0deg)';
                dragon.style.transition = 'transform 0.5s ease-in-out, left 0.5s ease-in-out';
                dragon.classList.remove('animating', 'sliding');
                isReturning = false; // Reset cờ
            } else {
                if (scrollTop > 55 && !isReturning) {
                    fixedTop.style.top = '-55px';
                    fixedTop.classList.add('shadow');
                    navbarBrand.style.marginLeft = '-200px';
                } else {
                    fixedTop.style.top = '0px';
                    fixedTop.classList.remove('shadow');
                    navbarBrand.style.marginLeft = '0px';
                    if (currentLeft === '-700px' && !dragon.classList.contains('animating')) {
                        isReturning = true; // Đánh dấu đang trở về
                        dragon.style.transform = 'rotateY(0deg)';
                        dragon.style.transition = 'transform 0.5s ease-in-out';
                        dragon.addEventListener('transitionend', function handleReverseRotate(e) {
                            if (e.propertyName === 'transform') {
                                dragon.style.left = '0px';
                                dragon.style.transition = 'left 0.5s ease-in-out';
                                isReturning = false; // Reset cờ khi hoàn thành
                                dragon.removeEventListener('transitionend', handleReverseRotate);
                            }
                        }, { once: true });
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
    });


    // Back to top button
    (function () {
        const backToTopButton = document.getElementById('back-to-top');

        // Hiển thị/ẩn nút khi cuộn
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        // Cuộn về đầu khi nhấn nút
        backToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    })();
    // Xử lý khi thay đổi kích thước màn hình

    //error
    // $(window).scroll(function () {
    //     // Thêm transition cho các phần tử
    //     const $window = $(window);
    //     const $navbarBrand = $('.navbar-brand');
    //     const $dragon = $('#dragon');
    //     const $fixedTop = $('.fixed-top');

    //     if ($(window).width() < 992) {
    //         // Màn hình nhỏ
    //         if ($(this).scrollTop() > 55) {
    //             $('.fixed-top').addClass('shadow');
    //             $('#navbarBrand h1').css('margin-left', '0px'); // Reset margin-left về 0
    //         } else {
    //             $('.fixed-top').removeClass('shadow');
    //             $('#navbarBrand h1').css('margin-left', '0px');
    //         }
    //     } else {
    //         // Màn hình lớn
    //         if ($(this).scrollTop() > 55) {
    //             $('.fixed-top').addClass('shadow').css('top', '-55px');
    //             $('#dragon').css('top', '-200px');
    //             $('#navbarBrand h1').css('margin-left', '-200px');
    //         } else {
    //             $('.fixed-top').removeClass('shadow').css('top', '0');
    //             $('#dragon').css('top', '0');
    //             $('#navbarBrand h1').css('margin-left', '0px');
    //         }
    //     }
    // });






    // // Product Quantity
    // // $('.quantity button').on('click', function () {
    // //     var button = $(this);
    // //     var oldValue = button.parent().parent().find('input').val();
    // //     if (button.hasClass('btn-plus')) {
    // //         var newVal = parseFloat(oldValue) + 1;
    // //     } else {
    // //         if (oldValue > 0) {
    // //             var newVal = parseFloat(oldValue) - 1;
    // //         } else {
    // //             newVal = 0;
    // //         }
    // //     }
    // //     button.parent().parent().find('input').val(newVal);
    // // });
    // $('.quantity button').on('click', function () {
    //     let change = 0;

    //     var button = $(this);
    //     var oldValue = button.parent().parent().find('input').val();
    //     if (button.hasClass('btn-plus')) {
    //         var newVal = parseFloat(oldValue) + 1;
    //         change = 1;
    //     } else {
    //         if (oldValue > 1) {
    //             var newVal = parseFloat(oldValue) - 1;
    //             change = -1;
    //         } else {
    //             newVal = 1;
    //         }
    //     }
    //     const input = button.parent().parent().find('input');
    //     input.val(newVal);

    //     //set form index
    //     const index = input.attr("data-cart-detail-index")
    //     const el = document.getElementById(`cartDetails${index}.quantity`);
    //     $(el).val(newVal);



    //     //get price
    //     const price = input.attr("data-cart-detail-price");
    //     const id = input.attr("data-cart-detail-id");

    //     const priceElement = $(`p[data-cart-detail-id='${id}']`);
    //     if (priceElement) {
    //         const newPrice = +price * newVal;
    //         priceElement.text(formatCurrency(newPrice.toFixed(2)) + " đ");
    //     }

    //     //update total cart price
    //     const totalPriceElement = $(`p[data-cart-total-price]`);

    //     if (totalPriceElement && totalPriceElement.length) {
    //         const currentTotal = totalPriceElement.first().attr("data-cart-total-price");
    //         let newTotal = +currentTotal;
    //         if (change === 0) {
    //             newTotal = +currentTotal;
    //         } else {
    //             newTotal = change * (+price) + (+currentTotal);
    //         }

    //         //reset change
    //         change = 0;

    //         //update
    //         totalPriceElement?.each(function (index, element) {
    //             //update text
    //             $(totalPriceElement[index]).text(formatCurrency(newTotal.toFixed(2)) + " đ");

    //             //update data-attribute
    //             $(totalPriceElement[index]).attr("data-cart-total-price", newTotal);
    //         });
    //     }
    // });

    // function formatCurrency(value) {
    //     // Use the 'vi-VN' locale to format the number according to Vietnamese currency format
    //     // and 'VND' as the currency type for Vietnamese đồng
    //     const formatter = new Intl.NumberFormat('vi-VN', {
    //         style: 'decimal',
    //         minimumFractionDigits: 0, // No decimal part for whole numbers
    //     });

    //     let formatted = formatter.format(value);
    //     // Replace dots with commas for thousands separator
    //     formatted = formatted.replace(/\./g, ',');
    //     return formatted;
    // }

    // //handle filter products
    // // $('#btnFilter').click(function (event) {
    // //     event.preventDefault();

    // //     let factoryArr = [];
    // //     let targetArr = [];
    // //     let priceArr = [];
    // //     //factory filter
    // //     $("#factoryFilter .form-check-input:checked").each(function () {
    // //         factoryArr.push($(this).val());
    // //     });

    // //     //target filter
    // //     $("#targetFilter .form-check-input:checked").each(function () {
    // //         targetArr.push($(this).val());
    // //     });

    // //     //price filter
    // //     $("#priceFilter .form-check-input:checked").each(function () {
    // //         priceArr.push($(this).val());
    // //     });

    // //     //sort order
    // //     let sortValue = $('input[name="radio-sort"]:checked').val();

    // //     const currentUrl = new URL(window.location.href);
    // //     const searchParams = currentUrl.searchParams;

    // //     // Add or update query parameters
    // //     searchParams.set('page', '1');
    // //     searchParams.set('sort', sortValue);

    // //     //reset filter
    // //     searchParams.delete("factory");
    // //     searchParams.delete("target");
    // //     searchParams.delete("price");


    // //     if (factoryArr.length > 0) {
    // //         searchParams.set('factory', factoryArr.join(','));
    // //     }
    // //     if (targetArr.length > 0) {
    // //         searchParams.set('target', targetArr.join(','));
    // //     }
    // //     if (priceArr.length > 0) {
    // //         searchParams.set('price', priceArr.join(','));
    // //     }

    // //     // Update the URL and reload the page
    // //     window.location.href = currentUrl.toString();
    // // });

    // //handle auto checkbox after page loading
    // // Parse the URL parameters
    // const params = new URLSearchParams(window.location.search);

    // // Set checkboxes for 'factory'
    // if (params.has('factory')) {
    //     const factories = params.get('factory').split(',');
    //     factories.forEach(factory => {
    //         $(`#factoryFilter .form-check-input[value="${factory}"]`).prop('checked', true);
    //     });
    // }

    // // Set checkboxes for 'target'
    // if (params.has('target')) {
    //     const targets = params.get('target').split(',');
    //     targets.forEach(target => {
    //         $(`#targetFilter .form-check-input[value="${target}"]`).prop('checked', true);
    //     });
    // }

    // // Set checkboxes for 'price'
    // if (params.has('price')) {
    //     const prices = params.get('price').split(',');
    //     prices.forEach(price => {
    //         $(`#priceFilter .form-check-input[value="${price}"]`).prop('checked', true);
    //     });
    // }

    // // Set radio buttons for 'sort'
    // if (params.has('sort')) {
    //     const sort = params.get('sort');
    //     $(`input[type="radio"][name="radio-sort"][value="${sort}"]`).prop('checked', true);
    // }


    //////////////////////////
    //handle add to cart with ajax
    // $('.btnAddToCartHomepage').click(function (event) {
    //     event.preventDefault();

    //     if (!isLogin()) {
    //         $.toast({
    //             heading: 'Lỗi thao tác',
    //             text: 'Bạn cần đăng nhập tài khoản',
    //             position: 'top-right',
    //             icon: 'error'
    //         })
    //         return;
    //     }

    //     const productId = $(this).attr('data-product-id');
    //     const token = $("meta[name='_csrf']").attr("content");
    //     const header = $("meta[name='_csrf_header']").attr("content");

    //     $.ajax({
    //         url: `${window.location.origin}/api/add-product-to-cart`,
    //         beforeSend: function (xhr) {
    //             xhr.setRequestHeader(header, token);
    //         },
    //         type: "POST",
    //         data: JSON.stringify({ quantity: 1, productId: productId }),
    //         contentType: "application/json",

    //         success: function (response) {
    //             const sum = +response;
    //             //update cart
    //             $("#sumCart").text(sum)
    //             //show message
    //             $.toast({
    //                 heading: 'Giỏ hàng',
    //                 text: 'Thêm sản phẩm vào giỏ hàng thành công',
    //                 position: 'top-right',

    //             })

    //         },
    //         error: function (response) {
    //             alert("có lỗi xảy ra, check code đi ba :v")
    //             console.log("error: ", response);
    //         }

    //     });
    // });

    // $('.btnAddToCartDetail').click(function (event) {
    //     event.preventDefault();
    //     if (!isLogin()) {
    //         $.toast({
    //             heading: 'Lỗi thao tác',
    //             text: 'Bạn cần đăng nhập tài khoản',
    //             position: 'top-right',
    //             icon: 'error'
    //         })
    //         return;
    //     }

    //     const productId = $(this).attr('data-product-id');
    //     const token = $("meta[name='_csrf']").attr("content");
    //     const header = $("meta[name='_csrf_header']").attr("content");
    //     const quantity = $("#cartDetails0\\.quantity").val();
    //     $.ajax({
    //         url: `${window.location.origin}/api/add-product-to-cart`,
    //         beforeSend: function (xhr) {
    //             xhr.setRequestHeader(header, token);
    //         },
    //         type: "POST",
    //         data: JSON.stringify({ quantity: quantity, productId: productId }),
    //         contentType: "application/json",

    //         success: function (response) {
    //             const sum = +response;
    //             //update cart
    //             $("#sumCart").text(sum)
    //             //show message
    //             $.toast({
    //                 heading: 'Giỏ hàng',
    //                 text: 'Thêm sản phẩm vào giỏ hàng thành công',
    //                 position: 'top-right',

    //             })

    //         },
    //         error: function (response) {
    //             alert("có lỗi xảy ra, check code đi ba :v")
    //             console.log("error: ", response);
    //         }

    //     });
    // });

    // function isLogin() {
    //     const navElement = $("#navbarCollapse");
    //     const childLogin = navElement.find('a.a-login');
    //     if (childLogin.length > 0) {
    //         return false;
    //     }
    //     return true;
    // }

})(jQuery);


// Kiểm tra trạng thái đăng nhập từ localStorage
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let currentEmail = localStorage.getItem('userEmail') || '';

// content is not loggin
const loginContent = `
        <button class="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                    data-bs-toggle="modal" data-bs-target="#searchModal">
                <i class="fas fa-search text-primary"></i>
        </button>
      <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#login" id="loginBtn">
          Đăng nhập
      </button>
  `;

// Nội dung khi đã đăng nhập
const loggedInContent = `
        <button class="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                        data-bs-toggle="modal" data-bs-target="#searchModal">
                        <i class="fas fa-search text-primary"></i>
        </button>
         <a  href="cart.history.html" class="position-relative me-4 my-auto">
                      <i class="fa fa-shopping-bag fa-2x"></i>
                      <span id="cartCount"
                          class="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                          style="top: -5px; left: 15px; height: 20px; min-width: 20px;">
                          
                      </span>
        </a>
    <div class="dropdown my-auto">
    <a href="#" class="dropdown-toggle" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-user fa-2x"></i>
    </a>

    <ul class="dropdown-menu dropdown-menu-end p-4" aria-labelledby="dropdownMenuLink">
        <li class="d-flex align-items-center flex-column" style="min-width: 300px;">
            <img id="userAvatar" style="width: 150px; height: 150px; border-radius: 50%; overflow: hidden;" src="../../../../resources/images/president/anonymousavatar.jpg" alt="User Avatar">
            <div id="userName" class="text-center my-3">User</div>
        </li>

        <li><a class="dropdown-item" href="#">Quản lý tài khoản</a></li>
        <li><a class="dropdown-item" href="order.history.html">Lịch sử mua hàng</a></li>
        <li>
            <hr class="dropdown-divider">
        </li>
        <li>
            <form method="post" action="">
                <input type="hidden" name="_method" value="post">
                <button type="button" class="btn btn-danger" onclick="logout()">Đăng xuất</button>
            </form>
        </li>
    </ul>
    </div>
  `;

//func render avatar by email
function getAvatarSrc(email) {
    return email === 'nu1412sos@gmail.com' ? '../../../../resources/images/president/levannguyen.jpg' : '../../../../resources/images/president/anonymousavatar.jpg';
}

//func get email show name
function getDisplayName(email) {
    return email === 'nu1412sos@gmail.com' ? 'Lê Văn Nguyên' : email.split('@')[0];
}

function renderContent() {
    const authSection = document.getElementById('authSection');
    if (authSection) {
        authSection.innerHTML = isLoggedIn ? loggedInContent : loginContent;

        if (isLoggedIn) {
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');
            if (userAvatar) userAvatar.src = getAvatarSrc(currentEmail);
            if (userName) userName.textContent = getDisplayName(currentEmail);
        }
    }
}

// process event submit form login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            isLoggedIn = true;
            currentEmail = email;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);

            renderContent();
            const loginModal = document.getElementById('login');
            if (loginModal) {
                bootstrap.Modal.getInstance(loginModal).hide();
            }
        } else {
            alert('Vui lòng nhập email và mật khẩu!');
        }
    });
}

//func logout
function logout() {
    isLoggedIn = false;
    currentEmail = '';
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userEmail');
    renderContent();
}

// show content start load page
renderContent();

//search
(function () {
    function initSearch() {
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');

        if (!searchButton || !searchInput) {
            console.log('Không tìm thấy #searchButton hoặc #searchInput, bỏ qua chức năng tìm kiếm');
            return;
        }

        searchButton.addEventListener('click', function () {
            const searchValue = searchInput.value.toLowerCase();
            const activeTab = document.querySelector('.tab-pane.active');
            if (!activeTab) return;

            const products = Array.from(activeTab.querySelectorAll('.fruite-item'));
            const productContainer = activeTab.querySelector('.row');
            if (!productContainer) return;

            products.forEach(function (product) {
                product.style.display = '';
            });

            if (searchValue.trim() === '') {
                products.sort((a, b) => {
                    return parseInt(a.querySelector('button').getAttribute('data-product-id')) -
                        parseInt(b.querySelector('button').getAttribute('data-product-id'));
                });
            } else {
                const matchedProducts = products.filter(function (product) {
                    const productName = product.querySelector('h4').textContent.toLowerCase();
                    const productSpecs = product.querySelector('p').textContent.toLowerCase();
                    return productName.includes(searchValue) || productSpecs.includes(searchValue);
                });

                const unmatchedProducts = products.filter(function (product) {
                    const productName = product.querySelector('h4').textContent.toLowerCase();
                    const productSpecs = product.querySelector('p').textContent.toLowerCase();
                    return !(productName.includes(searchValue) || productSpecs.includes(searchValue));
                });

                productContainer.innerHTML = '';
                matchedProducts.forEach(function (product) {
                    productContainer.appendChild(product.parentElement);
                });
                unmatchedProducts.forEach(function (product) {
                    product.style.display = 'none';
                    productContainer.appendChild(product.parentElement);
                });
            }
        });

        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initSearch();
    } else {
        document.addEventListener('DOMContentLoaded', initSearch);
    }
})();

// search vs model
$(document).ready(function () {
    // Tìm kiếm thời gian thực trong modal
    $('#modalSearchInput').on('input', function () {
        const searchValue = $(this).val().toLowerCase();
        const searchResultsContainer = $('#searchResults');
        const noResultsMessage = $('#no-results-message');
        const activeTab = $('.tab-pane.active');

        if (!activeTab.length) return;

        const products = activeTab.find('.fruite-item').clone();

        // Xóa kết quả cũ
        searchResultsContainer.empty();

        if (searchValue.trim() === '') {
            noResultsMessage.hide();
            return;
        }

        // Lọc sản phẩm
        const matchedProducts = products.filter(function () {
            const productName = $(this).find('h4').text().toLowerCase();
            const productSpecs = $(this).find('p').text().toLowerCase();
            return productName.includes(searchValue) || productSpecs.includes(searchValue);
        });

        // Hiển thị kết quả
        matchedProducts.each(function () {
            const productClone = $(this).clone().removeClass('hidden visible').addClass('visible');
            const col = $('<div class="col-md-6 col-lg-4 col-xl-3"></div>').append(productClone);
            searchResultsContainer.append(col);
        });

        // Hiển thị thông báo nếu không có kết quả
        noResultsMessage.css('display', matchedProducts.length === 0 ? 'block' : 'none');
    });

    // Xóa ô tìm kiếm khi đóng modal
    $('#searchModal').on('hidden.bs.modal', function () {
        $('#modalSearchInput').val('');
        $('#searchResults').empty();
        $('#no-results-message').hide();
    });
});

//admin and hero
$(document).ready(function () {
    const heroCarousel = $('#heroCarousel');
    const adminCarousel = $('#adminCarousel');

    if (heroCarousel.length) {
        heroCarousel.carousel({
            interval: 3000,
            pause: 'hover'
        });
    }

    if (adminCarousel.length) {
        adminCarousel.carousel({
            interval: 4000,
            pause: 'hover'
        });
    }
});

//adtocart
document.addEventListener('DOMContentLoaded', function () {
    // Lấy tất cả các nút "Add to Cart"
    const addToCartButtons = document.querySelectorAll('.btnAddToCartHomepage');
    const toast = document.getElementById('handleAddToCart');

    // Kiểm tra xem toast có tồn tại không
    if (!toast) {
        console.log('Không tìm thấy phần tử #handleAddToCart trong DOM');
        return;
    }

    // Thêm sự kiện click cho từng nút
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();

            // Lấy thông tin sản phẩm
            const productElement = this.closest('.fruite-item');
            if (!productElement) return;

            const productId = this.getAttribute('data-product-id');
            const productName = productElement.querySelector('h4 a').textContent;
            const productPrice = productElement.querySelector('.text-dark.fw-bold')
                .textContent.replace(' đ', '').replace(/,/g, '');
            const productImage = productElement.querySelector('.fruite-img img').getAttribute('src');

            // Tạo object sản phẩm
            const product = {
                id: productId,
                name: productName,
                price: parseInt(productPrice),
                image: productImage,
                quantity: 1
            };

            // Kiểm tra đăng nhập bằng localStorage
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                showToast('Lỗi thao tác', 'Bạn cần đăng nhập tài khoản', 'error');
                return;
            }

            // Thêm sản phẩm vào giỏ hàng
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));

            // Hiển thị thông báo thành công
            showToast('Giỏ hàng', 'Thêm sản phẩm vào giỏ hàng thành công', 'success');

            // Cập nhật số lượng trên giao diện
            updateCartCount();
        });
    });

    // Hàm hiển thị thông báo
    function showToast(heading, text, type = 'success') {
        console.log('showToast called:', { heading, text, type });

        // Xóa class cũ
        toast.classList.remove('error', 'success');
        // Thêm class theo loại thông báo
        toast.classList.add(type);

        // Cập nhật nội dung
        toast.innerHTML = `<strong>${heading}</strong><br>${text}`;

        // Hiển thị thông báo
        toast.style.display = 'block';
        toast.style.opacity = '1';

        // Ẩn sau 5 giây
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.style.display = 'none';
                toast.style.opacity = '1';
            }, 500);
        }, 5000);
    }

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng trên giao diện
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }

    // Cập nhật số lượng khi trang được tải
    updateCartCount();
});

//cart
document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    if (!cartItemsContainer || !cartTotalElement) {
        console.log('Không tìm thấy các phần tử giỏ hàng, bỏ qua chức năng giỏ hàng');
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Hàm hiển thị giỏ hàng
    function renderCart() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px;">
                        Giỏ hàng của bạn hiện đang trống.
                    </td>
                </tr>
            `;
            updateTotal();
            return;
        }

        cart.forEach((item, index) => {
            const total = item.price * item.quantity;
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="img-fluid me-5 rounded-circle" 
                             style="width: 80px; height: 80px;" alt="${item.name}">
                    </div>
                </th>
                <td>
                    <p class="mb-0 mt-4">${item.name.replace(/\n\s+/g, ' ').trim()}</p>
                </td>
                <td>
                    <p class="mb-0 mt-4">${item.price.toLocaleString('vi-VN')} đ</p>
                </td>
                <td>
                    <div class="input-group quantity mt-4" style="width: 150px;">
                        <button class="btn-decrease" data-index="${index}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="btn-increase" data-index="${index}">+</button>
                    </div>
                </td>
                <td>
                    <p class="mb-0 mt-4 total-price" data-index="${index}">
                        ${total.toLocaleString('vi-VN')} đ
                    </p>
                </td>
                <td>
                    <button class="btn-delete" data-index="${index}">Xóa</button>
                </td>
            `;
            cartItemsContainer.appendChild(row);
        });

        // Thêm sự kiện cho các nút
        addEventListeners();
        updateTotal();
    }

    // Hàm cập nhật tổng tiền
    function updateTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalElement.textContent = `${total.toLocaleString('vi-VN')} đ`;
    }

    // Hàm thêm sự kiện cho các nút
    function addEventListeners() {
        // Nút tăng số lượng
        document.querySelectorAll('.btn-increase').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateRow(index);
                updateTotal();
            });
        });

        // Nút giảm số lượng
        document.querySelectorAll('.btn-decrease').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateRow(index);
                    updateTotal();
                }
            });
        });

        // Nút xóa
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    // Hàm cập nhật một hàng sau khi thay đổi số lượng
    function updateRow(index) {
        const item = cart[index];
        const total = item.price * item.quantity;
        const row = cartItemsContainer.children[index];
        row.querySelector('.quantity-input').value = item.quantity;
        row.querySelector('.total-price').textContent = `${total.toLocaleString('vi-VN')} đ`;
    }

    // Render giỏ hàng lần đầu
    renderCart();
});

//detail product
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.product-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const product = {
                id: this.getAttribute('data-product-id'),
                name: this.getAttribute('data-name'),
                image: this.getAttribute('data-image'),
                price: this.getAttribute('data-price'),
                specs: this.getAttribute('data-specs')
            };
            // Mã hóa dữ liệu thành query string
            const queryString = new URLSearchParams(product).toString();
            window.location.href = `product.detail.html?${queryString}`;
        });
    });
});

//logic get detail product
document.addEventListener('DOMContentLoaded', function () {
    // Lấy thông tin từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const product = {
        id: urlParams.get('id'),
        name: urlParams.get('name'),
        image: urlParams.get('image'),
        price: parseInt(urlParams.get('price')),
        specs: urlParams.get('specs')
    };

    // Nếu không có dữ liệu, hiển thị mặc định
    if (!product.id) {
        product.id = "unknown";
        product.name = "Sản phẩm không xác định";
        product.image = "../../../../resources/images/product/default.png";
        product.price = 0;
        product.specs = "Không có thông tin";
    }

    // Cập nhật giao diện
    const productImage = document.getElementById('productImage');
    const productName = document.getElementById('productName');
    const productBrand = document.getElementById('productBrand');
    const productPrice = document.getElementById('productPrice');
    const productSpecs = document.getElementById('productSpecs');
    const quantity = document.getElementById('quantity');
    const totalPrice = document.getElementById('totalPrice');
    const productId = document.getElementById('productId');
    const productDescription = document.getElementById('productDescription');

    if (productImage) productImage.src = product.image;
    if (productName) productName.textContent = product.name;
    if (productBrand) productBrand.textContent = "Dell";
    if (productPrice) productPrice.textContent = `${product.price.toLocaleString('vi-VN')} đ`;
    if (productSpecs) productSpecs.textContent = product.specs;
    if (quantity) quantity.value = 1;
    if (totalPrice) totalPrice.textContent = (product.price * 1).toLocaleString('vi-VN');
    if (productId) productId.value = product.id;
    if (productDescription) productDescription.textContent = `Thông tin sản phẩm ${product.name}. Thiết kế tinh tế, hiệu năng mạnh mẽ.`;

    // Xử lý nút "Thêm vào giỏ hàng"
    const addToCartButton = document.querySelector('.btnAddToCartDetail');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedProduct = {
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                quantity: parseInt(quantity.value)
            };
            const existingProduct = cart.find(item => item.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += updatedProduct.quantity;
            } else {
                cart.push(updatedProduct);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`Đã thêm ${product.name} vào giỏ hàng với số lượng ${quantity.value}!`);
        });
    }
});

//logic color
// Xử lý lựa chọn màu sắc và cập nhật giá
const colorButtons = document.querySelectorAll('.color-btn');
let basePrice = 0;
let selectedPriceIncrease = 0;

if (colorButtons.length) {
    colorButtons.forEach(button => {
        button.addEventListener('click', function () {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedPriceIncrease = parseInt(this.dataset.priceIncrease);
            updateTotalPrice();
        });
    });
}

// Xử lý số lượng
const quantityInput = document.getElementById('quantity');
const minusBtn = document.querySelector('.btn-minus');
const plusBtn = document.querySelector('.btn-plus');

if (quantityInput && minusBtn && plusBtn) {
    minusBtn.addEventListener('click', () => {
        if (quantityInput.value > 1) {
            quantityInput.value--;
            updateTotalPrice();
        }
    });

    plusBtn.addEventListener('click', () => {
        quantityInput.value++;
        updateTotalPrice();
    });

    quantityInput.addEventListener('change', () => {
        if (quantityInput.value < 1) quantityInput.value = 1;
        updateTotalPrice();
    });
}

// Cập nhật tổng giá
function updateTotalPrice() {
    if (!quantityInput) return;

    const quantity = parseInt(quantityInput.value);
    const total = (basePrice + selectedPriceIncrease) * quantity;
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalPriceElement) {
        totalPriceElement.textContent = total.toLocaleString('vi-VN');
    }
}

// Khởi tạo giá ban đầu
window.onload = function () {
    const productPrice = document.getElementById('productPrice');
    if (productPrice) {
        basePrice = parseInt(productPrice.textContent.replace(/[^0-9]/g, '')) || 0;
        updateTotalPrice();
    }
}