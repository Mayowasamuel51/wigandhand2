"use client"
import { useState, useEffect, createContext } from "react";
import { Toaster, toast } from 'sonner';

export const CartContext = createContext({})

export const CartProvider = ({children}) => {
    const [cartItem, setCartItem] = useState(() => {
        if (localStorage.getItem("CartItem")) {
            return JSON.parse(localStorage.getItem("CartItem")) || [];
        }
    });
    const addToCart = (data) => {
        toast.success(`Successfully added to cart`);
    }

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem("CartItem")) || [];
        setCartItem(items);
    }, [])

    return (
        <CartContext.Provider value={{cartItem, addToCart}}>
            <Toaster position="top-center" />
            <div className="relative">
                <>
                    {children}
                </>
            </div>
        </CartContext.Provider>
    )
    
    

}