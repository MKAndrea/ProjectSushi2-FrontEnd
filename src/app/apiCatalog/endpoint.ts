//Endpoint per gli url da richiamare nelle api come prefix
export enum Endpoint {
    PRODUCT = "/product",
    CIBO = "/category/Cibo",
    BEVANDE = "/category/Bevande",
    DOLCI = "/category/Dolci",
    ORDERS = "/Orders",
    CART = "/cart",
    ORDERS_CART = "/Orders/cart",
    ADD_PRODUCT = "/product?username=admin&password=adminpass",
    DELETE_UPDATE = "username=admin&password=adminpass"
}