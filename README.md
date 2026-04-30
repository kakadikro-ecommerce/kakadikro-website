# Kaka Dikro Website

Kaka Dikro is a Next.js storefront for Gujarati masala and spice products. The app includes product browsing, product details, cart management, checkout, user authentication, profile management, order tracking, product reviews, contact form submission, SEO metadata, and responsive marketing/content sections.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Redux Toolkit and React Redux
- Axios for backend API calls
- React Hook Form with Zod validation
- Embla Carousel
- Lucide React icons
- React Toastify alerts

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local `.env` file with the required public configuration:

```env
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_YOUTUBE_URL=
```

`NEXT_PUBLIC_BASE_URL` should point to the backend API base URL used by Axios. `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_APP_URL` is used for SEO metadata. The social URL variables are used in the footer.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
```

Starts the local Next.js development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run lint
```

Runs ESLint for the project.

## Main Features

- Home page with carousel, product preview, about preview, process section, reviews, and FAQs.
- Product listing page with search, category filtering, pagination, and product cards.
- Product detail pages by slug with product variants, images, details, and reviews.
- Cart drawer with add, update, remove, and clear-cart flows.
- Checkout with shipping address validation and cash-on-delivery order creation.
- User registration, login, logout, profile update, and password change flows.
- Order history, order tracking, editable shipping address for eligible orders, and cancellation for pending or confirmed orders.
- Product reviews with verified-purchase eligibility checks.
- Contact form with validation and backend submission.
- SEO helpers for page metadata, Open Graph, Twitter cards, canonical URLs, and robots settings.

## Project Structure

```text
app/
  App Router pages, layouts, loading states, SEO helpers, and page clients.

api/
  Legacy or placeholder service files.

components/
  Reusable UI, layout, auth, cart, checkout, product, profile, review, order tracking, and about components.

hooks/
  Typed Redux hooks.

lib/
  Axios instance, auth storage helpers, image helpers, and Zod validation schemas.

redux/
  Redux store, provider, slices, and API helper functions.

types/
  Shared TypeScript types for products, users, orders, contacts, and app data.

utils/
  Shared constants and helper utilities.

public/
  Static assets, logos, favicons, and page imagery.
```

## Routes

- `/` - Home page
- `/products` - Product catalog
- `/products/[slug]` - Product details
- `/about` - About page
- `/contactUs` - Contact page
- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile and order history
- `/checkout` - Checkout page
- `/trackOrder` - Track order page

## Backend API Usage

The app uses `lib/axios.ts` to create a shared Axios client with:

- `NEXT_PUBLIC_BASE_URL` as the base URL
- JSON request headers
- credential support
- bearer token injection from local auth storage
- automatic frontend logout handling on `401` responses

Current user-facing API helpers live in `redux/api/` and call endpoints such as:

- `/v1/user/products`
- `/v1/user/products/:slug`
- `/v1/user/cart`
- `/v1/user/orders`
- `/v1/user/orders/tracking/:id`
- `/v1/user/auth/login`
- `/v1/user/auth/register`
- `/v1/user/profile`
- `/v1/user/contacts`
- `/v1/user/products/reviews`

`vercel.json` also defines a rewrite from `/api/:path*` to the configured remote backend host.

## State Management

Redux Toolkit is configured in `redux/store.ts` with these slices:

- `products`
- `reviews`
- `cart`
- `order`
- `user`
- `contact`

Use `useAppDispatch` and `useAppSelector` from `hooks/` instead of raw Redux hooks.

## Validation

Form validation is handled with Zod schemas in `lib/validations/`:

- `auth.ts` for login and registration
- `profile.ts` for profile and password forms
- `order.ts` for shipping addresses
- `review.ts` for product reviews
- `contact.validation.ts` for contact form submissions

## Assets

Static images are stored under `public/assets/`, including hero images, product/about/contact/order imagery, logos, and favicon files. `next.config.ts` allows remote images over `http` and `https`, and redirects old `/product/:slug` URLs to `/products/:slug`.

## Deployment

The project is ready for Vercel deployment. Before deploying, configure the same environment variables in the Vercel project settings and confirm that the backend API URL is reachable from the deployed frontend.
