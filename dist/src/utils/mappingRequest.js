"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mappingRequest(req, data) {
    for (const key of Object.keys(data)) {
        const findFilterByKey = req.parsed.filter.find((item) => item.field === key);
        if (findFilterByKey) {
            req.parsed.filter = req.parsed.filter.map((item) => {
                if (item.field === key) {
                    item = Object.assign(Object.assign({}, item), { value: data[key] });
                }
                return item;
            });
        }
        else {
            req.parsed.filter.push({ field: key, operator: 'eq', value: data[key] });
        }
        if (req.parsed.search.$and) {
            const findSearchAnd = req.parsed.search.$and.find((item) => item && item[key]);
            if (findSearchAnd) {
                req.parsed.search.$and = req.parsed.search.$and.map((item) => {
                    if (item && item[key]) {
                        item[key].eq = data[key];
                    }
                    return item;
                });
            }
            else {
                const searchAnd = {};
                searchAnd[key] = { eq: data[key] };
                req.parsed.search.$and.push(searchAnd);
            }
        }
    }
    return req;
}
exports.mappingRequest = mappingRequest;
//# sourceMappingURL=mappingRequest.js.map