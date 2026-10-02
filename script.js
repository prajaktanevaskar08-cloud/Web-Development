/* =========================================
   SHOP EASE
   FULL-STACK CAPSTONE FRONTEND
========================================= */


/* =========================================
   API
========================================= */

const API_URL =
    "https://fakestoreapi.com/products";


/* =========================================
   APPLICATION STATE
========================================= */

const state = {

    products: [],

    filteredProducts: [],

    cart: [],

    currentRoute: "home",

    searchTerm: "",

    category: "all"

};


/* =========================================
   DOM ELEMENTS
========================================= */

const productGrid =
    document.getElementById("product-grid");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("error-message");

const searchInput =
    document.getElementById("search-input");

const categoryFilter =
    document.getElementById("category-filter");

const cartButton =
    document.getElementById("cart-button");

const cartSidebar =
    document.getElementById("cart-sidebar");

const closeCart =
    document.getElementById("close-cart");

const cartItems =
    document.getElementById("cart-items");

const cartCount =
    document.getElementById("cart-count");

const cartTotal =
    document.getElementById("cart-total");

const checkoutButton =
    document.getElementById("checkout-button");


/* =========================================
   PAGE ELEMENTS
========================================= */

const pages = {

    home:
        document.getElementById("home-page"),

    products:
        document.getElementById("products-page"),

    about:
        document.getElementById("about-page")

};


/* =========================================
   CLIENT-SIDE ROUTING
========================================= */

function navigate(route) {

    if (!pages[route]) {

        route = "home";

    }


    state.currentRoute = route;


    Object.values(pages).forEach(page => {

        page.hidden = true;

    });


    pages[route].hidden = false;


    window.location.hash = route;


    if (route === "products") {

        renderProducts();

    }

}


/* =========================================
   ROUTER
========================================= */

function handleRoute() {

    const route =
        window.location.hash.replace("#", "");

    navigate(route || "home");

}


window.addEventListener(
    "hashchange",
    handleRoute
);


/* =========================================
   NAVIGATION CLICK
========================================= */

document.addEventListener(
    "click",
    event => {

        const routeLink =
            event.target.closest("[data-route]");

        if (!routeLink) {

            return;

        }


        event.preventDefault();

        const route =
            routeLink.dataset.route;

        navigate(route);

    }
);


/* =========================================
   FETCH PRODUCTS
========================================= */

async function fetchProducts() {

    try {

        showLoading();

        hideError();


        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }


        const data =
            await response.json();


        state.products = data;

        state.filteredProducts = data;


        populateCategories();

        renderProducts();


    } catch (error) {

        console.error(
            "Product API Error:",
            error
        );

        showError(
            "Unable to load products. Please check your internet connection and try again."
        );

    } finally {

        hideLoading();

    }

}


/* =========================================
   POPULATE CATEGORIES
========================================= */

function populateCategories() {

    const categories =
        [
            ...new Set(
                state.products.map(
                    product => product.category
                )
            )
        ];


    categoryFilter.innerHTML = `
        <option value="all">
            All Categories
        </option>
    `;


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent =
            category;

        categoryFilter.appendChild(option);

    });

}


/* =========================================
   FILTER PRODUCTS
========================================= */

function filterProducts() {

    state.searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    state.category =
        categoryFilter.value;


    state.filteredProducts =
        state.products.filter(product => {

            const matchesSearch =
                product.title
                    .toLowerCase()
                    .includes(
                        state.searchTerm
                    );


            const matchesCategory =
                state.category === "all" ||
                product.category ===
                    state.category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    renderProducts();

}


/* =========================================
   SEARCH EVENT
========================================= */

searchInput.addEventListener(
    "input",
    filterProducts
);


/* =========================================
   CATEGORY EVENT
========================================= */

categoryFilter.addEventListener(
    "change",
    filterProducts
);


/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts() {

    productGrid.innerHTML = "";


    if (
        state.filteredProducts.length === 0
    ) {

        productGrid.innerHTML = `
            <p>
                No products found.
            </p>
        `;

        return;

    }


    state.filteredProducts.forEach(
        product => {

            const card =
                createProductCard(product);

            productGrid.appendChild(card);

        }
    );

}


/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createProductCard(product) {

    const article =
        document.createElement("article");


    article.className =
        "product-card";


    article.innerHTML = `

        <img
            src="${product.image}"
            alt="${product.title}"
            class="product-image"
            loading="lazy"
        >

        <div class="product-content">

            <span class="product-category">
                ${product.category}
            </span>

            <h2 class="product-title">
                ${product.title}
            </h2>

            <p class="product-description">
                ${product.description.substring(0, 100)}...
            </p>

            <div class="product-bottom">

                <span class="product-price">
                    ₹${product.price.toFixed(2)}
                </span>

                <button
                    class="add-button"
                    data-product-id="${product.id}">

                    Add to Cart

                </button>

            </div>

        </div>
    `;


    return article;

}


/* =========================================
   ADD TO CART
========================================= */

productGrid.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".add-button"
            );


        if (!button) {

            return;

        }


        const productId =
            Number(
                button.dataset.productId
            );


        addToCart(productId);

    }
);


/* =========================================
   CART FUNCTION
========================================= */

function addToCart(productId) {

    const product =
        state.products.find(
            item => item.id === productId
        );


    if (!product) {

        return;

    }


    state.cart.push(product);


    updateCart();

}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    cartItems.innerHTML = "";


    if (state.cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

    }


    state.cart.forEach(
        (product, index) => {

            const item =
                document.createElement("div");


            item.className =
                "cart-item";


            item.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.title}"
                >

                <div class="cart-item-info">

                    <strong>
                        ${product.title}
                    </strong>

                    <p>
                        ₹${product.price.toFixed(2)}
                    </p>

                    <button
                        class="remove-button"
                        data-index="${index}">

                        Remove

                    </button>

                </div>
            `;


            cartItems.appendChild(item);

        }
    );


    const total =
        state.cart.reduce(
            (sum, product) =>
                sum + product.price,
            0
        );


    cartTotal.textContent =
        total.toFixed(2);


    cartCount.textContent =
        state.cart.length;

}


/* =========================================
   REMOVE FROM CART
========================================= */

cartItems.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".remove-button"
            );


        if (!button) {

            return;

        }


        const index =
            Number(
                button.dataset.index
            );


        state.cart.splice(index, 1);


        updateCart();

    }
);


/* =========================================
   OPEN CART
========================================= */

cartButton.addEventListener(
    "click",
    () => {

        cartSidebar.hidden = false;

    }
);


/* =========================================
   CLOSE CART
========================================= */

closeCart.addEventListener(
    "click",
    () => {

        cartSidebar.hidden = true;

    }
);


/* =========================================
   CHECKOUT
========================================= */

checkoutButton.addEventListener(
    "click",
    () => {

        if (state.cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        alert(
            "Checkout functionality can be connected to a payment gateway in the next version."
        );

    }
);


/* =========================================
   LOADING
========================================= */

function showLoading() {

    loading.hidden = false;

}


function hideLoading() {

    loading.hidden = true;

}


/* =========================================
   ERROR
========================================= */

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.hidden = false;

}


function hideError() {

    errorMessage.hidden = true;

}


/* =========================================
   APPLICATION START
========================================= */

fetchProducts();

handleRoute();

updateCart();