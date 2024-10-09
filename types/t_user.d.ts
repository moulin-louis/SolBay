export {t_user};

declare global {
  type t_user = {
    //fill by the server
    verified: boolean;
    listings: t_listing[];
    created_at: string;
    id: string; //uuid
    //fill by the user
    address: string;
    name: string;
    email: string;
  };
}
