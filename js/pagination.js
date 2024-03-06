'use strict';

'use strict';

const paginate = (movies, currentPage, moviesPerPage) =>
  movies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage);

export default { paginate };