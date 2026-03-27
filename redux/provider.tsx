"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchCart, resetCart } from "@/redux/slice/cartSlice";
import { resetOrderState } from "@/redux/slice/orderSlice";
import { hydrateUser } from "@/redux/slice/userSlice";
import { store } from "@/redux/store";

interface ReduxProviderProps {
  children: React.ReactNode;
}

function PersistedStateSync() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem("kd-user");

      if (storedUser) {
        dispatch(hydrateUser(JSON.parse(storedUser)));
      }
    } catch {
      console.error("Failed to parse user from storage");
    }

  }, [dispatch]);

  useEffect(() => {
    if (currentUser?.token) {
      void dispatch(fetchCart());
      return;
    }

    dispatch(resetCart());
    dispatch(resetOrderState());
  }, [currentUser?.token, dispatch]);

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
