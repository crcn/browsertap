import expect from 'expect.js';
import BaseModel from './model';
import { timeout } from 'common/test/utils';
import sift from 'sift';

describe(__filename + '#', function() {
  it('can be created', function() {
    new BaseModel();
  });
});
