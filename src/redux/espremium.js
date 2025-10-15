// espremiumSlice.js
import { createSlice } from "@reduxjs/toolkit";

const espremiumSlice = createSlice({
  name: "projet",
  initialState: {
    userInfo: null,
    products: [],
    favorites: [],
    approbatProducts: [],
    cart: [],
    productDetails: {},
  },
  reducers: {
    keepProducts(state, action) {
      state.approbatProducts = action.payload;
    },
    addToFav(state, action) {
      state.favorites.push(action.payload);
    },
    removeToFav(state, action) {
      state.favorites = state.favorites.filter(
        (el) => el.id !== action.payload.id
      );
    },
    restoreFav(state, action) {
      state.favorites = action.payload;
    },
    sendProductInfo(state, action) {
      state.productDetails = action.payload;
    },
    connexion(state, action) {
      state.userInfo = action.payload;
    },
    deconnexion(state) {
      state.userInfo = null;
      state.favorites = [];
      state.productDetails = {};
      state.approbatProducts = [];
      state.cart = [];
    },
    productsToShow(state, action) {
      state.products = action.payload;
    },
    addToCart(state, action) {
      console.log("ACTION,", action.payload);
      if (!action.payload.type) {
        const existingItem = state.cart.find(
          (item) => item.id === action.payload.id
        );

        if (existingItem) {
          existingItem.quantite = existingItem.quantite + 1;
        } else {
          // Ensure new items have quantite=1
          const updatedProducts = state.cart.concat(action.payload);
          return { ...state, cart: updatedProducts };
        }
      } else {
        const existingItem = state.cart.find(
          (item) =>
            item.id === action.payload.id && item.type === action.payload.type
        );

        if (existingItem) {
          existingItem.quantite = existingItem.quantite + 1;
        } else {
          // Ensure new items have quantite=1
          const updatedProducts = state.cart.concat(action.payload);
          return { ...state, cart: updatedProducts };
        }
      }
    },
    decreaseQuantity(state, action) {
      if (!action.payload.type) {
        const item = state.cart.find(
          (item) => item.id === action.payload.produit.id
        );

        if (item && item.quantite > 1) {
          item.quantite -= 1;
        }
      } else {
        const item = state.cart.find(
          (item) =>
            item.id === action.payload.produit.id &&
            item.type === action.payload.type
        );

        if (item && item.quantite > 1) {
          item.quantite -= 1;
        }
      }
    },
    increaseQuantity(state, action) {
      if (!action.payload.type) {
        const item = state.cart.find(
          (item) => item.id === action.payload.produit.id
        );

        if (item) {
          item.quantite += 1;
        }
      } else {
        const item = state.cart.find(
          (item) =>
            item.id === action.payload.produit.id &&
            item.type === action.payload.type
        );

        if (item) {
          item.quantite += 1;
        }
      }
    },
    updateQuantity(state, action) {
      const { updatedQuantite, produit } = action.payload;
      const item = state.cart.find(
        (item) => item.id === produit.id && item.type === produit.type
      );

      if (item) {
        item.quantite = updatedQuantite;
      }
    },
    removeToCart(state, action) {
      if (!action.payload.type) {
        const { produit } = action.payload;
        state.cart = state.cart.filter((item) => !(item.id === produit.id));
      } else {
        const { produit, type } = action.payload;
        state.cart = state.cart.filter(
          (item) => !(item.id === produit.id && item.type === type)
        );
      }
    },
    resetAll(state) {
      state.cart = [];
    },
  },
});

export const {
  addToFav,
  keepProducts,
  removeToFav,
  restoreFav,
  connexion,
  deconnexion,
  sendProductInfo,
  addToCart,
  removeToCart,
  resetAll,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
} = espremiumSlice.actions;

export const espremiumReducer = espremiumSlice.reducer;
