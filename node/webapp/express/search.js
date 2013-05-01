var request = require('superagent');

module.exports = function search(query, cb) {
    request
    .get('http://search.twitter.com/search.json')
    .query({ q: query })
    .end(function (res) {
        if (res.body && Array.isArray(res.body.results)) {
            return cb(null, res.body.results);
        }
        cb(new Error('Bad twitter response'));
    });
};
