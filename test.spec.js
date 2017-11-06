const { mix } = require('mixwith')
const frisby = mix(require('icedfrisby')).with(require('./expectJSONRefDataExists'))
const expect = require('chai').expect
const sinon = require('sinon')

describe('icedfrisby-jsonrefchecks', function () {
    it('works to validate simple json against itself', function(){
        frisby.create(this.test.title)
            .get('https://httpbin.org/anything?icedfrisby=awesome')
            .expectStatus(200)
            .expectJSONRefDataExists('args.icedfrisby','args.icedfrisby')
        .toss()
    })
    it('works to validate more complex json against itself', function(){
        frisby.create(this.test.title)
            .get('https://jsonplaceholder.typicode.com/albums')
            .expectStatus(200)
            .expectJSONRefDataExists('$..userId','$..userId')
        .toss()
    })
    it('honours options to throw when there are no candidates', function(){
        //Credit to https://github.com/paulmelnikow/icedfrisby-nock for this genius implementation
        const test = frisby.create(this.test.title)
            .get('https://httpbin.org/anything?icedfrisby=awesome')
            .expectStatus(200)
            .expectJSONRefDataExists('nonsense','args.icedfrisby',{failOnZeroCandidates: true})
      
        test._finish = function (done) {
            test.constructor.prototype._finish.call(this, function(err){
                expect(err.message).to.contain('Query returned zero candidates')
                done()
            })
            expect.fail('This should never be called')
        }
        
        test.toss()
        
        test.toss()
    })
    it('outputs debug info on candidates and references when configured', function(){
        let spy = sinon.spy(console, 'log');
        frisby.create(this.test.title)
            .get('https://httpbin.org/anything?icedfrisby=awesome')
            .expectStatus(200)
            .expectJSONRefDataExists('args.icedfrisby','args.icedfrisby', {debug: true})
            .after(function(){
                expect(spy.calledWith('Candidates: 1')).to.be.true;
                expect(spy.calledWith('References: 1')).to.be.true;
            })
        .toss()
    })
    it('gives useful output on error', function(){
        //Credit to https://github.com/paulmelnikow/icedfrisby-nock for this genius implementation
        const test = frisby.create(this.test.title)
            .get('https://httpbin.org/anything?icedfrisby=awesome')
            .expectStatus(200)
            .expectJSONRefDataExists('headers','args.icedfrisby')

        test._finish = function (done) {
            test.constructor.prototype._finish.call(this, function(err){
                expect(err.message).to.contain('The pattern "headers" had 1 items, but "args.icedfrisby" only contained 0 of them')
                done()
            })
            expect.fail('This should never be called')
        }
        
        test.toss()
    })
})
