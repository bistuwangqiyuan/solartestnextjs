import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '首页 - 光伏测试系统',
  description: '欢迎使用光伏测试系统，专业的光伏组件性能测试与数据分析平台。支持实时监控、I-V特性曲线分析、MPPT追踪、数据采集和性能报告生成。',
  openGraph: {
    title: '光伏测试系统 - 专业光伏组件性能测试平台',
    description: '专业的光伏组件测试与数据分析平台，支持实时监控、数据采集、性能分析和测试管理',
    url: 'https://pv-testing-system.netlify.app',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Hero Section */}
        <section className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            光伏测试系统
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
            专业的光伏组件性能测试与数据分析平台
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
            支持实时监控、数据采集、I-V特性曲线分析、MPPT追踪、性能报告生成。
            采用Modbus TCP/RTU协议，提供完整的太阳能电池板测试解决方案。
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-6 pt-8">
          <article className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur">
            <h2 className="text-xl font-semibold mb-2">实时监控</h2>
            <p className="text-gray-600 dark:text-gray-400">
              实时监测光伏组件的电压、电流、功率等关键参数
            </p>
          </article>
          <article className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur">
            <h2 className="text-xl font-semibold mb-2">数据分析</h2>
            <p className="text-gray-600 dark:text-gray-400">
              I-V特性曲线、P-V曲线、效率分析、MPPT追踪
            </p>
          </article>
          <article className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur">
            <h2 className="text-xl font-semibold mb-2">测试管理</h2>
            <p className="text-gray-600 dark:text-gray-400">
              实验配置、历史数据管理、报告生成与导出
            </p>
          </article>
        </section>

        {/* Key Features List */}
        <section className="pt-8">
          <h2 className="text-2xl font-bold mb-6">核心功能</h2>
          <ul className="grid md:grid-cols-2 gap-3 text-left max-w-2xl mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Modbus TCP/RTU协议支持</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>I-V特性曲线实时绘制</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>最大功率点追踪(MPPT)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>多通道数据采集</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>性能效率自动计算</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>历史数据管理与导出</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>实验报告自动生成</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>告警与异常监控</span>
            </li>
          </ul>
        </section>

        {/* CTA Buttons */}
        <section className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            进入系统
          </Link>
          <Link
            href="/help"
            className="px-8 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
          >
            了解更多
          </Link>
        </section>

        {/* SEO Content */}
        <section className="pt-12 text-left max-w-3xl mx-auto space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            关于光伏测试系统
          </h2>
          <p>
            光伏测试系统是一套专门为光伏组件性能测试与数据分析设计的专业化软件平台。
            系统采用现代化的Web技术架构，支持通过Modbus TCP/RTU协议与测试设备进行通信，
            实现对太阳能电池板的全面性能测试和实时监控。
          </p>
          <p>
            系统的核心功能包括：实时数据采集、I-V特性曲线绘制、P-V曲线分析、
            最大功率点追踪(MPPT)、效率计算、性能对比分析、历史数据管理、
            实验报告生成等。适用于光伏组件制造商、研发机构、检测中心、
            光伏电站运维等多种应用场景。
          </p>
          <p>
            通过本系统，用户可以快速准确地评估光伏组件的性能参数，
            包括开路电压(Voc)、短路电流(Isc)、最大功率点电压(Vmp)、
            最大功率点电流(Imp)、填充因子(FF)、转换效率等关键指标，
            为光伏产品的质量控制和性能优化提供可靠的数据支持。
          </p>
        </section>
      </div>
    </main>
  );
}