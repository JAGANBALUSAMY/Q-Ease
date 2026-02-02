/**
 * Pagination Helper
 * Provides consistent pagination across all list endpoints
 */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parse pagination parameters from request query
 * @param {Object} query - Request query object
 * @returns {Object} - Pagination parameters
 */
const getPaginationParams = (query) => {
    const page = parseInt(query.page) || DEFAULT_PAGE;
    const limit = Math.min(parseInt(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip
    };
};

/**
 * Create pagination metadata for response
 * @param {number} total - Total count of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} - Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage
    };
};

/**
 * Paginate Prisma query
 * @param {Object} query - Prisma query object
 * @param {Object} paginationParams - Pagination parameters
 * @returns {Object} - Query with pagination
 */
const paginateQuery = (query, paginationParams) => {
    return {
        ...query,
        skip: paginationParams.skip,
        take: paginationParams.limit
    };
};

module.exports = {
    getPaginationParams,
    getPaginationMeta,
    paginateQuery,
    DEFAULT_PAGE,
    DEFAULT_LIMIT,
    MAX_LIMIT
};
