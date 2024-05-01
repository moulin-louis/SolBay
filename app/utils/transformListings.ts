export default (listings: t_listing[]) => {
  return listings.map((listing) => {
    const result: t_listingFilter = {
      ...listing,
      filtered: false,
    };
    return result;
  });
};
