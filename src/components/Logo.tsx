/**
 * Brand logo that swaps artwork between night and day themes.
 * Both variants render; CSS (html.light) decides which one is visible,
 * so there is never a hydration flash or mismatch.
 */
export function Logo({
  className = "h-6 w-auto",
  alt = "My Small Things by Mishel",
  loading,
}: {
  className?: string;
  alt?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <span className="inline-flex">
      <img
        src="/images/logo-alpha.webp"
        alt={alt}
        loading={loading}
        decoding="async"
        className={`logo-dark ${className}`}
      />
      <img
        src="/images/logo-light.webp"
        alt=""
        aria-hidden="true"
        loading={loading}
        decoding="async"
        className={`logo-light ${className}`}
      />
    </span>
  );
}
