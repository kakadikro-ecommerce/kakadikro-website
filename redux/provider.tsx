"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { hydrateCart } from "@/redux/slice/cartSlice";
import { hydrateUser } from "@/redux/slice/userSlice";
import { store } from "@/redux/store";

interface ReduxProviderProps {
  children: React.ReactNode;
}

function PersistedStateSync() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const currentUser = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    const storedCart = window.localStorage.getItem("kd-cart");
    const storedUser = window.localStorage.getItem("kd-user");

    if (storedCart) {
      dispatch(hydrateCart(JSON.parse(storedCart)));
    }

    if (storedUser) {
      dispatch(hydrateUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  useEffect(() => {
    window.localStorage.setItem("kd-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem("kd-user", JSON.stringify(currentUser));
      return;
    }

    window.localStorage.removeItem("kd-user");
  }, [currentUser]);

  return null;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistedStateSync />
      {children}
    </Provider>
  );
}
