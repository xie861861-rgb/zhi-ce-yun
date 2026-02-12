"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`订阅成功: ${email}`);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">智</span>
                </div>
                <span className="text-xl font-bold text-blue-900">智策云</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">功能特性</a>
              <a href="#stats" className="text-gray-600 hover:text-blue-600 transition-colors">数据指标</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">定价方案</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">联系我们</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                登录
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                免费试用
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                AI 驱动 · 智能决策
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
                为中小企业提供
                <span className="text-blue-600">智能决策</span>
                服务
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                基于人工智能技术，帮助企业快速完成资质评估、风险分析，
                让决策更科学、更高效。已服务超过 10,000 家企业。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2">
                  开始 AI 预审
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="border-2 border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  观看演示
                </button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                      {i}K
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-900">10,000+</span> 企业信赖
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl p-8 shadow-2xl shadow-blue-200">
                <div className="bg-white/90 backdrop-blur rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">AI 智能预审</div>
                      <div className="text-sm text-green-600">正在分析您的资质...</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">企业规模匹配</span>
                      <span className="font-semibold text-blue-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">资质符合度</span>
                      <span className="font-semibold text-blue-600">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    预计 10 分钟内生成完整报告
                  </div>
                </div>
              </div>
              {/* 装饰元素 */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 数据指标 Section */}
      <section id="stats" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
              数据驱动，效果可见
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们用数据证明价值，帮助企业实现降本增效
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "92%", label: "匹配率", desc: "智能匹配成功率" },
              { value: "10", label: "分钟出报告", desc: "快速生成分析结果" },
              { value: "85%", label: "效率提升", desc: "决策效率大幅提升" },
              { value: "10000+", label: "服务企业", desc: "覆盖各行各业" },
            ].map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 text-center hover:shadow-lg hover:shadow-blue-100 transition-shadow">
                <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-xl font-semibold text-blue-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能特性 Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
              核心功能
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              全方位智能决策支持，让企业发展更顺畅
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "AI 智能预审",
                desc: "基于深度学习算法，快速评估企业资质，精准匹配最适合的政策和方案。"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "数据分析报告",
                desc: "多维度数据分析，可视化呈现，帮助企业管理者快速了解现状并做出决策。"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "数据安全保障",
                desc: "企业级数据加密技术，严格的权限管理，确保您的商业机密安全无虞。"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "高效响应",
                desc: "毫秒级响应速度，支持实时数据更新，让决策不等待。"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "团队协作",
                desc: "支持多人同时使用，灵活分配权限，提升团队协作效率。"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                ),
                title: "定制服务",
                desc: "根据企业需求提供定制化解决方案，满足不同行业的特殊要求。"
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-100 transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 订阅 Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* 装饰背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  订阅行业资讯
                </h2>
                <p className="text-blue-200 text-lg mb-8">
                  获取最新的政策动态、行业趋势和智策云产品更新信息
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-blue-200">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    每周精选资讯
                  </div>
                  <div className="flex items-center gap-2 text-blue-200">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    行业报告分享
                  </div>
                  <div className="flex items-center gap-2 text-blue-200">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    专属优惠活动
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 md:p-8">
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱地址
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入您的邮箱"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    立即订阅
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    订阅即表示同意我们的
                    <a href="#" className="text-blue-600 hover:underline">隐私政策</a>
                    和
                    <a href="#" className="text-blue-600 hover:underline">服务条款</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 定价 Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
              灵活定价
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              根据企业规模选择最适合的方案
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "初创版",
                price: "¥0",
                period: "/月",
                desc: "适合小微企业试用",
                features: ["5 次 AI 预审", "基础数据分析", "邮件支持", "1 个团队成员"],
                highlight: false
              },
              {
                name: "专业版",
                price: "¥299",
                period: "/月",
                desc: "适合成长型企业",
                features: ["无限次 AI 预审", "完整数据分析报告", "优先技术支持", "10 个团队成员", "API 接入"],
                highlight: true
              },
              {
                name: "企业版",
                price: "定制",
                period: "",
                desc: "适合大型企业",
                features: ["专属解决方案", "一对一客户经理", "7×24 小时支持", "无限团队成员", "私有化部署", "定制开发"],
                highlight: false
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  plan.highlight
                    ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-200 scale-105"
                    : "bg-white border border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="text-center">
                  <h3 className={`text-xl font-semibold mb-2 ${plan.highlight ? "text-white" : "text-blue-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>
                    {plan.desc}
                  </p>
                  <div className="mb-8">
                    <span className={`text-5xl font-bold ${plan.highlight ? "text-white" : "text-blue-900"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${plan.highlight ? "text-blue-100" : "text-gray-500"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg
                          className={`w-5 h-5 ${plan.highlight ? "text-blue-200" : "text-blue-500"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={plan.highlight ? "text-white" : "text-gray-600"}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      plan.highlight
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    立即开始
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 底部 Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">智</span>
                </div>
                <span className="text-xl font-bold text-white">智策云</span>
              </div>
              <p className="text-sm leading-relaxed">
                致力于为中小企业提供智能化决策解决方案，
                让每个企业都能享受 AI 带来的效率提升。
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">产品服务</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">AI 智能预审</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">数据分析报告</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API 接入服务</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">定制解决方案</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">关于我们</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">公司介绍</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">新闻动态</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">加入我们</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">联系我们</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@zhiceyun.com
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  400-888-8888
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2024 智策云 版权所有
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">隐私政策</a>
              <a href="#" className="hover:text-blue-400 transition-colors">服务条款</a>
              <a href="#" className="hover:text-blue-400 transition-colors">京ICP备12345678号</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
