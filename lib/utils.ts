import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options,
  })
}

export function formatNumber(num: number, decimals: number = 2) {
  return num.toFixed(decimals)
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}小时 ${minutes}分钟 ${remainingSeconds}秒`
  } else if (minutes > 0) {
    return `${minutes}分钟 ${remainingSeconds}秒`
  } else {
    return `${remainingSeconds}秒`
  }
}

export function calculatePower(voltage: number, current: number, powerFactor: number = 1) {
  return voltage * current * powerFactor
}

export function generateExperimentId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `EXP-${timestamp}-${random}`.toUpperCase()
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function downloadFile(data: any, filename: string, type: string = 'application/json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function parseModbusValue(
  rawValue: number,
  dataType: string,
  scale: number = 1
): number {
  let value = rawValue

  switch (dataType) {
    case 'int16':
      value = rawValue > 32767 ? rawValue - 65536 : rawValue
      break
    case 'uint16':
      value = rawValue
      break
    case 'int32':
    case 'uint32':
    case 'float32':
      // These would need special handling with multiple register values
      value = rawValue
      break
  }

  return value * scale
}

export function validateExperimentParameters(
  type: string,
  params: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  switch (type) {
    case 'LOW_VOLTAGE_HIGH_CURRENT':
      if (!params.voltage || params.voltage < 1 || params.voltage > 50) {
        errors.push('电压必须在1-50V之间')
      }
      if (!params.current || params.current < 0 || params.current > 1000) {
        errors.push('电流必须在0-1000A之间')
      }
      if (!params.duration || params.duration < 1) {
        errors.push('测试时长必须大于1秒')
      }
      break

    case 'DUAL_POWER_SWITCH':
      if (!params.switchThreshold || params.switchThreshold < 0) {
        errors.push('切换阈值必须大于0')
      }
      if (!params.switchDelay || params.switchDelay < 0) {
        errors.push('切换延时必须大于0ms')
      }
      if (!params.switchCount || params.switchCount < 1) {
        errors.push('切换次数必须大于0')
      }
      break
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

export function getExperimentStatusColor(status: string) {
  const colors = {
    PENDING: 'text-gray-400',
    RUNNING: 'text-blue-400',
    COMPLETED: 'text-green-400',
    FAILED: 'text-red-400',
    CANCELLED: 'text-yellow-400',
  }
  return colors[status as keyof typeof colors] || 'text-gray-400'
}

export function getExperimentStatusBgColor(status: string) {
  const colors = {
    PENDING: 'bg-gray-400/10',
    RUNNING: 'bg-blue-400/10',
    COMPLETED: 'bg-green-400/10',
    FAILED: 'bg-red-400/10',
    CANCELLED: 'bg-yellow-400/10',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-400/10'
}

export function interpolateData(data: number[], targetLength: number): number[] {
  if (data.length === targetLength) return data
  if (data.length === 0) return new Array(targetLength).fill(0)

  const result: number[] = []
  const step = (data.length - 1) / (targetLength - 1)

  for (let i = 0; i < targetLength; i++) {
    const index = i * step
    const lowerIndex = Math.floor(index)
    const upperIndex = Math.ceil(index)
    const weight = index - lowerIndex

    if (lowerIndex === upperIndex) {
      result.push(data[lowerIndex])
    } else {
      result.push(data[lowerIndex] * (1 - weight) + data[upperIndex] * weight)
    }
  }

  return result
}