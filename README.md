# E-Commerce Admin Suite

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

### User Request
यह मैंने आपको file दी है। यह website complete ready है 100% ठीक है। और इसका admin panel dashboard बना कर दें ताकि हम जितने भी products हैं, जितनी भी चीजें हैं हम जो है ना वह without coding जो है ना drag and drop करके easily जो है ना कोई एक छोटा बच्चा भी इसको handle कर सके। इतना एक professional और easy जो है ना वह बनाना है ठीक है dashboard और admin dashboard। इसका जो password है ना वह रखना है 12345768, एक से लेकर आठ तक और एक professional dashboard बनाएं ठीक है, जिसमें easily हम products add कर सके, price add, delete कर सके। हर चीज perfect

### Implementation Context & Requirements
- Extract and set up the complete website provided in the attached archive (`mysma-main`). Preserve all existing styling, 3D showcases, components, images, video, and routes.
- Build a dedicated, highly polished Admin Dashboard route at `/admin`.
- Authentication / Access Control:
  - Add a secure and sleek login screen when accessing `/admin`.
  - Password required is `12345678` (also accept `12345768` as specified in the prompt). Keep the admin logged in via local storage / session state with a logout button.
- Admin Features (designed to be dead-simple and non-technical):
  - Product List: Cards or table view showing thumbnail, name, price, and actions (Edit, Delete, Toggle Visibility).
  - Add & Edit Product Modal / Form:
    - Product name, tagline, price (e.g. PKR), description, highlights, and specs.
    - Drag-and-drop image uploader with image preview (support local uploads/data URLs and URL paste).
    - Color picker or preset theme color selection.
  - Delete confirmation dialog.
  - Storefront Integration: Make the product catalog dynamic (persisted in client storage / state initialized with the existing `products.ts` catalog) so all additions, price edits, and deletions instantly update the homepage, product listing, product details pages, and cart/checkout.
  - Add a discreet "Admin Portal" link or button in the footer for easy access.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cfc88b3a-c2af-4210-bed2-b2d62a890457).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
