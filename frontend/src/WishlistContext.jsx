import React, { createContext, useState, useEffect, useContext } from 'react';
import api from './api/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlistItems, setWishlistItems] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            fetchWishlist(user.id);
        } else {
            setWishlistItems([]);
        }
    }, [user]);

    const fetchWishlist = async (userId) => {
        try {
            const response = await api.get(`/api/wishlist/${userId}`);
            setWishlistItems(response.data);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const addToWishlist = async (productId) => {
        if (!user) return alert("Please login to add items to your wishlist.");
        try {
            await api.post(`/api/wishlist/${user.id}/add/${productId}`);
            fetchWishlist(user.id); // Refresh wishlist
        } catch (error) {
            console.error("Error adding to wishlist:", error);
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user) return;
        try {
            await api.delete(`/api/wishlist/${user.id}/remove/${productId}`);
            fetchWishlist(user.id); // Refresh wishlist
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!user) {
            alert("Please login to manage your wishlist.");
            return;
        }

        const isWishlisted = wishlistItems.some(item => item.id === productId);
        if (isWishlisted) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const isItemInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            addToWishlist,
            removeFromWishlist,
            toggleWishlist,
            isItemInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
