export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: {
      error?: { description?: string; reason?: string; code?: string };
    }) => void
  ) => void;
};

type RazorpayConstructor = new (
  options: RazorpayCheckoutOptions & {
    handler: (response: RazorpaySuccessResponse) => void;
    modal?: {
      ondismiss?: () => void;
    };
  }
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export const loadRazorpayScript = (): Promise<boolean> => {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${SCRIPT_URL}"]`
  );

  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener("error", () => resolve(false));
      if (window.Razorpay) {
        resolve(true);
      }
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = (
  options: RazorpayCheckoutOptions
): Promise<RazorpaySuccessResponse> => {
  return new Promise((resolve, reject) => {
    void loadRazorpayScript().then((loaded) => {
      if (!loaded || !window.Razorpay) {
        reject(
          new Error(
            "Unable to load the payment gateway. Please check your connection and try again."
          )
        );
        return;
      }

      let settled = false;

      const rzp = new window.Razorpay({
        ...options,
        handler: (response) => {
          settled = true;
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            if (settled) {
              return;
            }
            settled = true;
            reject(
              new Error(
                "Payment was cancelled. You can retry payment from your order."
              )
            );
          },
        },
      });

      rzp.on("payment.failed", (response) => {
        if (settled) {
          return;
        }
        settled = true;
        reject(
          new Error(
            response.error?.description ||
              "Payment failed. Please try again."
          )
        );
      });

      rzp.open();
    });
  });
};
