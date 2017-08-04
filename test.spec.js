const { mix } = require('mixwith')
const frisby = mix(require('icedfrisby')).with(require('./expectJSONRefDataExists'))
const expect = require('chai').expect
const sinon = require('sinon')

describe('icedfrisby-jsonrefchecks', function () {
    it('works to validate simple json against itself', function(){
        frisby.create('matching against itself - simple')
            .get('https://httpbin.org/anything?icedfrisby=awesome')
            .expectStatus(200)
            .expectJSONRefDataExists('args.icedfrisby','args.icedfrisby')
        .toss()
    })
    it('works to validate more complex json against itself', function(){
        frisby.create('matching against itself - complex')
            .get('https://jsonplaceholder.typicode.com/albums')
            .expectStatus(200)
            .expectJSONRefDataExists('$..userId','$..userId')
        .toss()
    })
    it('honours options to throw when there are no candidates', function(){
        //Credit to https://github.com/paulmelnikow/icedfrisby-nock for this genius implementation
        const test = frisby.create('no candidates selected')
            .get('https://httpbin.org/anything?icedfrisby=awesome')
            .expectStatus(200)
            .expectJSONRefDataExists('nonsense','args.icedfrisby',{failOnZeroCandidates: true})
      
        // Intercept the raised exception to prevent Mocha from receiving it.
        test._invokeExpects = function (done) {
            try {
                test.prototype._invokeExpects.call(test, done)
            } catch (e) {
                done()
                return
            }
            // If we catch the exeption, as expected, we should never get here.
            expect.fail('The failed expectation should have raised an exception')
        }
        
        test.toss()
    })
    it('outputs debug info on candidates and references when configured', function(){
        let spy = sinon.spy(console, 'log');
        frisby.create('writing debug info')
            .get('https://httpbin.org/anything?icedfrisby=awesome')
            .expectStatus(200)
            .expectJSONRefDataExists('args.icedfrisby','args.icedfrisby', {debug: true})
            .after(function(){
                expect(spy.calledWith('Candidates: 1')).to.be.true;
                expect(spy.calledWith('References: 1')).to.be.true;
            })
        .toss()
    })

})