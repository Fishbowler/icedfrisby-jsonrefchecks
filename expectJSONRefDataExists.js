const jsonpath = require('jsonpath');
const chai = require('chai');

const defaultConfig = {
  "debug": false,                 //Would print number of candidates and references
  "failOnZeroCandidates": false   //Would fail when candidates.length == 0
}

const factory = superclass => class ExpectJSONRefDataExists extends superclass {
  expectJSONRefDataExists(candidatePattern, referencePattern, config) {
    const self = this;
    let thisConfig = config ? Object.assign({}, defaultConfig, config) : defaultConfig;
    this.current.expects.push(function() {
      const body = self.current.response.body;
      var bodyJSON = (typeof body === "object") ? body : JSON.parse(body);
      var candidates = jsonpath.query(bodyJSON, candidatePattern);
      var references = jsonpath.query(bodyJSON, referencePattern);
      if(thisConfig.debug){
        console.log('Candidates: ' + candidates.length);
        console.log('References: ' + references.length);
      }
      if(thisConfig.failOnZeroCandidates && candidates.length == 0){
        chai.expect.fail("0 candidates","Some candidates","Query returned zero candidates")
      } else {
        var matches = candidates.filter((candidate) => {
          return (references.includes(candidate));
        });
        chai.expect(matches.length).to.equal(candidates.length);
      }
    });
    return this;
  }
}

module.exports = factory;