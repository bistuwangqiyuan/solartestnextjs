import {
  formatDate,
  formatNumber,
  calculatePower,
  calculateEfficiency,
  generateId,
  isValidEmail,
  parseExcelDate,
} from '@/lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-13T14:30:00');
      expect(formatDate(date)).toBe('2025-01-13 14:30:00');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2025-01-13');
    });

    it('should handle string dates', () => {
      const dateStr = '2025-01-13T14:30:00';
      expect(formatDate(dateStr)).toBe('2025-01-13 14:30:00');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with specified decimals', () => {
      expect(formatNumber(3.14159)).toBe('3.14');
      expect(formatNumber(3.14159, 3)).toBe('3.142');
      expect(formatNumber(10, 0)).toBe('10');
    });
  });

  describe('calculatePower', () => {
    it('should calculate power correctly', () => {
      expect(calculatePower(38.5, 8.2)).toBeCloseTo(315.7);
      expect(calculatePower(0, 10)).toBe(0);
      expect(calculatePower(10, 0)).toBe(0);
    });
  });

  describe('calculateEfficiency', () => {
    it('should calculate efficiency correctly', () => {
      expect(calculateEfficiency(300, 400)).toBe(75);
      expect(calculateEfficiency(0, 400)).toBe(0);
    });

    it('should handle zero input power', () => {
      expect(calculateEfficiency(100, 0)).toBe(0);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });
  });

  describe('isValidEmail', () => {
    it('should validate email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid.email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
    });
  });

  describe('parseExcelDate', () => {
    it('should parse Excel date numbers correctly', () => {
      // Excel date 44927 is 2023-01-01
      const date = parseExcelDate(44927);
      expect(date.getFullYear()).toBe(2023);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getDate()).toBe(1);
    });
  });
});