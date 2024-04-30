export {t_listingFilter};

declare global {
  type t_listingFilter = t_listing & {
    filtered: boolean;
  };
}
