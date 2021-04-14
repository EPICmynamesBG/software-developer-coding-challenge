'use strict';

const assert = require('assert');

const utils = require('../../../api/helpers/utils');

describe('utils', () => {
  describe('encrypt', () => {
    it('should error on nil values', () => {
      assert.throws(() => {
        utils.encrypt(null);
      });
      assert.throws(() => {
        utils.encrypt(undefined);
      });
    });

    it('should encrypt a string', () => {
      const input = 'hello world';
      const encrypted = utils.encrypt(input);
      assert.notStrictEqual(input, encrypted);
      assert.strictEqual(typeof encrypted, 'string');

      const reversed = utils.decrypt(encrypted);
      assert.strictEqual(input, reversed);
    });

    it('should stringify then encrypt a non-string', () => {
      const input = { hello: 'world' };
      const encrypted = utils.encrypt(input);
      assert.notStrictEqual(input, encrypted);
      assert.strictEqual(typeof encrypted, 'string');

      const reversed = utils.decrypt(encrypted, true);
      assert.deepStrictEqual(input, reversed);
    });
  });

  describe('decrypt', () => {
    it('should error on non-string or empty string values', () => {
      assert.throws(() => {
        utils.decrypt(null);
      });
      assert.throws(() => {
        utils.decrypt(undefined);
      });
      assert.throws(() => {
        utils.decrypt({});
      });
      assert.throws(() => {
        utils.decrypt('');
      });
    });

    it('should decrypt an encrypted string', () => {
      // before
      const input = 'hello world';
      const encrypted = utils.encrypt(input);

      const reversed = utils.decrypt(encrypted);
      assert.strictEqual(input, reversed);
      assert.strictEqual(typeof reversed, 'string');
    });

    context('object decryption', () => {
      const input = { hello: 'world' };
      let encrypted;

      before(() => {
        encrypted = utils.encrypt(input);
      });

      it('should return a string by default', () => {
        const reversed = utils.decrypt(encrypted);
        assert.strictEqual(JSON.stringify(input), reversed);
        assert.strictEqual(typeof reversed, 'string');
      });

      it('should return an object when isObject is specified', () => {
        const reversed = utils.decrypt(encrypted, true);
        assert.deepStrictEqual(input, reversed);
        assert.strictEqual(typeof reversed, 'object');
      });
    });
  });

  describe('camelCaseKeys', () => {
    it('should recursively camel case object keys', () => {
      const input = {
        prop_1: 'a',
        prop_arr: [{ arr_prop: 1 }],
        prop_obj: {
          prop_2: 'b'
        }
      };
      const expected = {
        prop1: 'a',
        propArr: [{ arrProp: 1 }],
        propObj: {
          prop2: 'b'
        }
      };

      const output = utils.camelCaseKeys(input);
      assert.deepStrictEqual(output, expected);
    });
  });
});
