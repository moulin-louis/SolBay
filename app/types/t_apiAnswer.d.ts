export {t_apiAnswer};

declare global {
  type t_apiAnswer<T> = {
    status: number;
    data: T;
  };
}
