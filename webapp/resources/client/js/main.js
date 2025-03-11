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


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })

        //add active class to header
        const navElement = $("#navbarCollapse");
        const currentUrl = window.location.pathname;
        navElement.find('a.nav-link').each(function () {
            const link = $(this); // Get the current link in the loop
            const href = link.attr('href'); // Get the href attribute of the link

            if (href === currentUrl) {
                link.addClass('active'); // Add 'active' class if the href matches the current URL
            } else {
                link.removeClass('active'); // Remove 'active' class if the href does not match
            }
        });
    });



    // Product Quantity
    // $('.quantity button').on('click', function () {
    //     var button = $(this);
    //     var oldValue = button.parent().parent().find('input').val();
    //     if (button.hasClass('btn-plus')) {
    //         var newVal = parseFloat(oldValue) + 1;
    //     } else {
    //         if (oldValue > 0) {
    //             var newVal = parseFloat(oldValue) - 1;
    //         } else {
    //             newVal = 0;
    //         }
    //     }
    //     button.parent().parent().find('input').val(newVal);
    // });
    $('.quantity button').on('click', function () {
        let change = 0;

        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
            change = 1;
        } else {
            if (oldValue > 1) {
                var newVal = parseFloat(oldValue) - 1;
                change = -1;
            } else {
                newVal = 1;
            }
        }
        const input = button.parent().parent().find('input');
        input.val(newVal);

        //set form index
        const index = input.attr("data-cart-detail-index")
        const el = document.getElementById(`cartDetails${index}.quantity`);
        $(el).val(newVal);



        //get price
        const price = input.attr("data-cart-detail-price");
        const id = input.attr("data-cart-detail-id");

        const priceElement = $(`p[data-cart-detail-id='${id}']`);
        if (priceElement) {
            const newPrice = +price * newVal;
            priceElement.text(formatCurrency(newPrice.toFixed(2)) + " đ");
        }

        //update total cart price
        const totalPriceElement = $(`p[data-cart-total-price]`);

        if (totalPriceElement && totalPriceElement.length) {
            const currentTotal = totalPriceElement.first().attr("data-cart-total-price");
            let newTotal = +currentTotal;
            if (change === 0) {
                newTotal = +currentTotal;
            } else {
                newTotal = change * (+price) + (+currentTotal);
            }

            //reset change
            change = 0;

            //update
            totalPriceElement?.each(function (index, element) {
                //update text
                $(totalPriceElement[index]).text(formatCurrency(newTotal.toFixed(2)) + " đ");

                //update data-attribute
                $(totalPriceElement[index]).attr("data-cart-total-price", newTotal);
            });
        }
    });

    function formatCurrency(value) {
        // Use the 'vi-VN' locale to format the number according to Vietnamese currency format
        // and 'VND' as the currency type for Vietnamese đồng
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            minimumFractionDigits: 0, // No decimal part for whole numbers
        });

        let formatted = formatter.format(value);
        // Replace dots with commas for thousands separator
        formatted = formatted.replace(/\./g, ',');
        return formatted;
    }

    //handle filter products
    $('#btnFilter').click(function (event) {
        event.preventDefault();

        let factoryArr = [];
        let targetArr = [];
        let priceArr = [];
        //factory filter
        $("#factoryFilter .form-check-input:checked").each(function () {
            factoryArr.push($(this).val());
        });

        //target filter
        $("#targetFilter .form-check-input:checked").each(function () {
            targetArr.push($(this).val());
        });

        //price filter
        $("#priceFilter .form-check-input:checked").each(function () {
            priceArr.push($(this).val());
        });

        //sort order
        let sortValue = $('input[name="radio-sort"]:checked').val();

        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;

        // Add or update query parameters
        searchParams.set('page', '1');
        searchParams.set('sort', sortValue);

        //reset filter
        searchParams.delete("factory");
        searchParams.delete("target");
        searchParams.delete("price");


        if (factoryArr.length > 0) {
            searchParams.set('factory', factoryArr.join(','));
        }
        if (targetArr.length > 0) {
            searchParams.set('target', targetArr.join(','));
        }
        if (priceArr.length > 0) {
            searchParams.set('price', priceArr.join(','));
        }

        // Update the URL and reload the page
        window.location.href = currentUrl.toString();
    });

    //handle auto checkbox after page loading
    // Parse the URL parameters
    const params = new URLSearchParams(window.location.search);

    // Set checkboxes for 'factory'
    if (params.has('factory')) {
        const factories = params.get('factory').split(',');
        factories.forEach(factory => {
            $(`#factoryFilter .form-check-input[value="${factory}"]`).prop('checked', true);
        });
    }

    // Set checkboxes for 'target'
    if (params.has('target')) {
        const targets = params.get('target').split(',');
        targets.forEach(target => {
            $(`#targetFilter .form-check-input[value="${target}"]`).prop('checked', true);
        });
    }

    // Set checkboxes for 'price'
    if (params.has('price')) {
        const prices = params.get('price').split(',');
        prices.forEach(price => {
            $(`#priceFilter .form-check-input[value="${price}"]`).prop('checked', true);
        });
    }

    // Set radio buttons for 'sort'
    if (params.has('sort')) {
        const sort = params.get('sort');
        $(`input[type="radio"][name="radio-sort"][value="${sort}"]`).prop('checked', true);
    }


    //////////////////////////
    //handle add to cart with ajax
    $('.btnAddToCartHomepage').click(function (event) {
        event.preventDefault();

        if (!isLogin()) {
            $.toast({
                heading: 'Lỗi thao tác',
                text: 'Bạn cần đăng nhập tài khoản',
                position: 'top-right',
                icon: 'error'
            })
            return;
        }

        const productId = $(this).attr('data-product-id');
        const token = $("meta[name='_csrf']").attr("content");
        const header = $("meta[name='_csrf_header']").attr("content");

        $.ajax({
            url: `${window.location.origin}/api/add-product-to-cart`,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            type: "POST",
            data: JSON.stringify({ quantity: 1, productId: productId }),
            contentType: "application/json",

            success: function (response) {
                const sum = +response;
                //update cart
                $("#sumCart").text(sum)
                //show message
                $.toast({
                    heading: 'Giỏ hàng',
                    text: 'Thêm sản phẩm vào giỏ hàng thành công',
                    position: 'top-right',

                })

            },
            error: function (response) {
                alert("có lỗi xảy ra, check code đi ba :v")
                console.log("error: ", response);
            }

        });
    });

    $('.btnAddToCartDetail').click(function (event) {
        event.preventDefault();
        if (!isLogin()) {
            $.toast({
                heading: 'Lỗi thao tác',
                text: 'Bạn cần đăng nhập tài khoản',
                position: 'top-right',
                icon: 'error'
            })
            return;
        }

        const productId = $(this).attr('data-product-id');
        const token = $("meta[name='_csrf']").attr("content");
        const header = $("meta[name='_csrf_header']").attr("content");
        const quantity = $("#cartDetails0\\.quantity").val();
        $.ajax({
            url: `${window.location.origin}/api/add-product-to-cart`,
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            type: "POST",
            data: JSON.stringify({ quantity: quantity, productId: productId }),
            contentType: "application/json",

            success: function (response) {
                const sum = +response;
                //update cart
                $("#sumCart").text(sum)
                //show message
                $.toast({
                    heading: 'Giỏ hàng',
                    text: 'Thêm sản phẩm vào giỏ hàng thành công',
                    position: 'top-right',

                })

            },
            error: function (response) {
                alert("có lỗi xảy ra, check code đi ba :v")
                console.log("error: ", response);
            }

        });
    });

    function isLogin() {
        const navElement = $("#navbarCollapse");
        const childLogin = navElement.find('a.a-login');
        if (childLogin.length > 0) {
            return false;
        }
        return true;
    }

})(jQuery);



document.querySelector(".back-to-top").addEventListener("click", function (event) {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// Kiểm tra trạng thái đăng nhập từ localStorage
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// Nội dung khi chưa đăng nhập
const loginContent = `
        <button class="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                    data-bs-toggle="modal" data-bs-target="#searchModal">
                <i class="fas fa-search text-primary"></i>
        </button>
      <button type="button" class="btn btn-primary btn-lg" data-bs-toggle="modal" data-bs-target="#login" id="loginBtn">
          Đăng nhập
      </button>
  `;

// Nội dung khi đã đăng nhập (tạm thời để đơn giản, bạn có thể thay bằng nội dung khác)
const loggedInContent = `
                 

                    <button class="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                        data-bs-toggle="modal" data-bs-target="#searchModal">
                        <i class="fas fa-search text-primary"></i>
                    </button>
                  <a href="http://localhost:8080/cart" class="position-relative me-4 my-auto">
                      <i class="fa fa-shopping-bag fa-2x"></i>
                      <span
                          class="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                          style="top: -5px; left: 15px; height: 20px; min-width: 20px;" id="sunCart">
                          2
                      </span>
                  </a>
                  <div class="dropdown my-auto">
                      <a href="http://localhost:8080/#" class="dropdown" role="button" id="dropdownMenuLink"
                          data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fas fa-user fa-2x"></i>
                      </a>

                      <ul class="dropdown-menu dropdown-menu-end p-4" aria-labelledby="dropdownMenuLink">
                          <li class="d-flex align-items-center flex-column" style="min-width: 300px;">
                              <img style="width: 150px; height: 150px; border-radius: 50%; overflow: hidden;">
                              <div class="text-center my-3">
                                  SOS Nu
                              </div>
                          </li>

                          <li><a class="dropdown-item" href="http://localhost:8080/#">Quản lý tài khoản</a></li>

                          <li><a class="dropdown-item" href="http://localhost:8080/order-history">Lịch sử mua
                                  hàng</a></li>
                          <li>
                              <hr class="dropdown-divider">
                          </li>
                          <li>
                              <form method="post" action="">
                                  <input method="post" type="hidden" >
                                  <button class="btn btn-danger" onclick="logout()">Đăng xuất</button>
                              </form>
                          </li>
                      </ul>
                  </div>
  `;

function renderContent() {
    document.getElementById('authSection').innerHTML = isLoggedIn ? loggedInContent : loginContent;
}

// Xử lý sự kiện submit form đăng nhập
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn form gửi thật (vì không có server)

    // Giả lập kiểm tra đăng nhập thành công (thay bằng logic thực nếu có)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) { // Kiểm tra đơn giản
        isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username); // Lưu username nếu cần
        renderContent(); // Cập nhật giao diện
        bootstrap.Modal.getInstance(document.getElementById('login')).hide(); // Đóng modal
    } else {
        alert('Vui lòng nhập email và mật khẩu!');
    }
});

// Hàm đăng xuất
function logout() {
    isLoggedIn = false;
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('username');
    renderContent();
}

// Hiển thị nội dung ban đầu khi tải trang
renderContent();


//search
document.getElementById('searchButton').addEventListener('click', function () {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const activeTab = document.querySelector('.tab-pane.active');
    const products = Array.from(activeTab.querySelectorAll('.fruite-item')); // Chuyển thành mảng
    const productContainer = activeTab.querySelector('.row'); // Container chứa các sản phẩm

    // Khôi phục trạng thái hiển thị
    products.forEach(function (product) {
        product.style.display = '';
    });

    if (searchValue.trim() === '') {
        // Sắp xếp lại theo thứ tự ban đầu nếu ô tìm kiếm rỗng
        products.sort((a, b) => {
            return parseInt(a.querySelector('button').getAttribute('data-product-id')) -
                parseInt(b.querySelector('button').getAttribute('data-product-id'));
        });
    } else {
        // Lọc và sắp xếp sản phẩm khớp lên đầu
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

        // Xóa tất cả sản phẩm khỏi container
        productContainer.innerHTML = '';

        // Thêm lại sản phẩm khớp lên đầu
        matchedProducts.forEach(function (product) {
            productContainer.appendChild(product.parentElement); // Thêm lại vào container
        });

        // Thêm lại sản phẩm không khớp (ẩn đi)
        unmatchedProducts.forEach(function (product) {
            product.style.display = 'none';
            productContainer.appendChild(product.parentElement);
        });
    }
});

document.getElementById('searchInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
});


//dieu chinh trong tab dang tuy chon
document.getElementById('searchButton').addEventListener('click', function () {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();

    // Lấy tab hiện tại (có lớp 'active')
    const activeTab = document.querySelector('.tab-pane.active');
    // Lấy các sản phẩm trong tab hiện tại
    const products = activeTab.querySelectorAll('.fruite-item');

    products.forEach(function (product) {
        const productName = product.querySelector('h4').textContent.toLowerCase();
        const productSpecs = product.querySelector('p').textContent.toLowerCase();

        if (productName.includes(searchValue) || productSpecs.includes(searchValue)) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
    });
});

document.getElementById('searchInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
});



// search vs model
$(document).ready(function () {
    // Tìm kiếm thời gian thực trong modal
    $('#modalSearchInput').on('input', function () {
        const searchValue = $(this).val().toLowerCase();
        const searchResultsContainer = $('#searchResults');
        const noResultsMessage = $('#no-results-message');
        const activeTab = $('.tab-pane.active');
        const products = activeTab.find('.fruite-item').clone(); // Sao chép sản phẩm từ tab hiện tại

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