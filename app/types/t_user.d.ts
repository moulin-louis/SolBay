export {t_user};

declare global {
  type t_user = {
    address: string;
    name: string;
    email: string;
    created_at: string;
    verified: boolean;
    listings: t_listing[];
  };
}
