export {t_form};

declare global {
  type t_form = {
    file: File;
    name: string;
    description: string;
    price: number;
  };
}
