export function getPage({page, limit}:{page:number, limit:number}) {
   const _page = page ? Number(page) : 1;   // default to page 1
  const _limit = limit ? Number(limit) : 5; //number of items in a page

  const offset = (_page - 1) * _limit;  //how many items to skip when going to the next page
  return {
    page: _page,
    limit: _limit,
    offset,
  };
}
