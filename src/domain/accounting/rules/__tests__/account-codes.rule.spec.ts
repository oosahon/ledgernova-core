import ledgerCodeRules from '../account-codes.rule';

describe('Accounting Rules: getLedgerCode()', () => {
  it('should generate the first child ledger code when no sibling is provided', () => {
    const nextCode = ledgerCodeRules.generateCode('11000');
    expect(nextCode).toBe('11100');
  });

  it('should increment the highest available decimal place without overflowing parent prefix', () => {
    const nextCode = ledgerCodeRules.generateCode('11000', '11100');
    expect(nextCode).toBe('11200');
  });

  it('should mathematically drop to the next decimal place when incrementing overflows parent prefix', () => {
    const nextCode = ledgerCodeRules.generateCode('11000', '11900');
    expect(nextCode).toBe('11910');
  });

  it('should drop to an even smaller decimal place for denser hierarchies', () => {
    const nextCode = ledgerCodeRules.generateCode('11000', '11990');
    expect(nextCode).toBe('11991');
  });

  it('should handle level zero (top level) parent correctly', () => {
    const code1 = ledgerCodeRules.generateCode('10000', '11000');
    expect(code1).toBe('12000');

    const code2 = ledgerCodeRules.generateCode('10000', '19000');
    expect(code2).toBe('19100');
  });

  it('should throw an AppError with the correct error structure when namespace is fully constrained/exhausted', () => {
    expect(() => {
      ledgerCodeRules.generateCode('11000', '11999');
    }).toThrow(
      expect.objectContaining({
        message: 'No available ledger codes under this parent.',
        cause: {
          cause: {
            parentCode: '11000',
            precedingSiblingCode: '11999',
          },
        },
      })
    );
  });
});
