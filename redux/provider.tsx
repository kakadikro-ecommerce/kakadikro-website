"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";

import { getStoredUser, getAccessToken, setStoredUser } from "@/lib/auth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchCart, resetCart } from "@/redux/slice/cartSlice";
import { resetOrderState } from "@/redux/slice/orderSlice";
import {
  hydrateUser,
  logoutUser,
  setAuthChecking,
  setUser,
} from "@/redux/slice/userSlice";
import { getUserProfile } from "@/redux/api/userApi";
import { store } from "@/redux/store";

interface ReduxProviderProps {
  children: React.ReactNode;
}

function PersistedStateSync() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.user.accessToken);
  const currentUser = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedAccessToken = getAccessToken();

    dispatch(
      hydrateUser({
        currentUser: storedUser,
        accessToken: storedAccessToken,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const bootstrapAuth = async () => {
      dispatch(setAuthChecking(true));

      try {
        if (accessToken && !getStoredUser()) {
          const profileResponse = await getUserProfile();
          const profileUser = profileResponse?.data ?? profileResponse?.user;

          if (profileUser) {
            const normalizedUser = {
              _id: profileUser._id || profileUser.id,
              id: profileUser.id || profileUser._id,
              name: profileUser.name,
              email: profileUser.email,
              role: profileUser.role,
              isActive: profileUser.isActive,
            };

            setStoredUser(normalizedUser);
            dispatch(setUser(normalizedUser));
          }
        }
      } catch {
        dispatch(logoutUser());
      } finally {
        dispatch(setAuthChecking(false));
      }
    };

    void bootstrapAuth();
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (accessToken) {
      void dispatch(fetchCart());
      return;
    }

    dispatch(resetCart());
    dispatch(resetOrderState());
  }, [accessToken, dispatch]);

  useEffect(() => {
    if (currentUser) {
      setStoredUser(currentUser);
      return;
    }

    setStoredUser(null);
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
