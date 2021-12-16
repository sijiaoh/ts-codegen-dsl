import {dsl} from './dsl';

describe('dsl', () => {
  it('should work', () => {
    const plusOne = dsl.function(
      'plusOne',
      [['num', 'number']],
      'number',
      num => {
        dsl.return(`${num.name}++`);
      }
    );
    const num = dsl.let('num', 'number', 0);
    num.sub(plusOne.getCallString(num));
    dsl.call('console.log', num);

    expect(dsl.code).toMatchInlineSnapshot(`
      "function plusOne(num: number): number {
        return num++;
      }
      let num: number = 0;
      num = plusOne(num);
      console.log(num);
      "
    `);
  });
});
