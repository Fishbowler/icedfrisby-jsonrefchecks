const jsonpath = require('jsonpath');
const chai = require('chai');

const factory = superclass => class ExpectJSONRefDataExists extends superclass {
  expectJSONRefDataExists(candidatePattern, referencePattern) {
    const self = this;
    this.current.expects.push(function() {
      const body = self.current.response.body;
      var bodyJSON = (typeof body === "object") ? body : JSON.parse(body);
      var candidates = jsonpath.query(bodyJSON, candidatePattern);
      var references = jsonpath.query(bodyJSON, referencePattern);
      var matches = candidates.filter((candidate) => {
        return (references.includes(candidate));
      });
      chai.expect(matches.length).to.equal(candidates.length);
    });
    return this;
  }
}

module.exports = factory;