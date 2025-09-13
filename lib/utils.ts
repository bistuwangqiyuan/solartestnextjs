import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化日期
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

// 格式化数字
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

// 计算功率
export function calculatePower(voltage: number, current: number): number {
  return voltage * current;
}

// 计算效率
export function calculateEfficiency(
  outputPower: number,
  inputPower: number
): number {
  if (inputPower === 0) return 0;
  return (outputPower / inputPower) * 100;
}

// 将测试数据导出为CSV
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // 处理包含逗号或换行的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// 生成唯一ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 解析Excel日期
export function parseExcelDate(excelDate: number): Date {
  // Excel日期是从1900年1月1日开始的天数
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date;
}

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 获取错误消息
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// 延迟函数
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 重试函数
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await delay(delayMs);
    return retry(fn, retries - 1, delayMs * 2);
  }
}