'use strict';

const {assert}   = require('chai');
const dataDriven = require('data-driven');

const Errors = require('src/Errors/');

const {correctPath, correctUrl, FramesMonitor} = require('./Helpers/');

const {incorrectConfigData, incorrectUrlData, incorrectConfig} = require('./constructor.data');

function typeOf(item) {
    return Object.prototype.toString.call(item);
}

describe('FramesMonitor::constructor', () => {

    dataDriven(
        incorrectConfigData.map(item => ({type: typeOf(item), config: item})),
        () => {
            it('config param has invalid ({type}) type', ctx => {
                assert.throws(() => {
                    new FramesMonitor(ctx.config, undefined);
                }, TypeError, 'Config param should be a plain object, bastard.');
            });
        }
    );

    dataDriven(
        incorrectUrlData.map(item => ({type: typeOf(item), url: item})),
        () => {
            it('url param has invalid ({type}) type', ctx => {
                assert.throws(() => {
                    new FramesMonitor({}, ctx.url);
                }, TypeError, 'You should provide a correct url, bastard.');
            });
        }
    );

    dataDriven(incorrectConfig, () => {
        it('{description}', ctx => {
            assert.throws(() => {
                new FramesMonitor(ctx.config, correctUrl);
            }, Errors.ConfigError, ctx.errorMsg);
        });
    });

    it('config.ffprobePath points to incorrect path', () => {
        assert.throws(() => {
            new FramesMonitor({
                ffprobePath : `/incorrect/path/${correctUrl}`,
                timeoutInSec: 1
            }, correctUrl);
        }, Errors.ExecutablePathError);
    });

    it('all params are good', () => {
        assert.doesNotThrow(() => {
            new FramesMonitor({
                ffprobePath : correctPath,
                timeoutInSec: 1
            }, correctUrl);
        });
    });

});
