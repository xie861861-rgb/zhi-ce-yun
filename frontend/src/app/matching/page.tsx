'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface Asset {
  id: string;
  name: string;
  type: string;
  amount: number;
  rate: string;
  term: string;
  description: string;
  tags: string[];
}

export default function MatchingPage() {
  const [filters, setFilters] = useState({
    amount: '',
    term: '',
    type: '',
  });
  const [results, setResults] = useState<Asset[]>([
    {
      id: '1',
      name: '科技企业贷款',
      type: 'LOAN',
      amount: 5000000,
      rate: '4.35%',
      term: '3年',
      description: '专为科技型企业设计的融资产品，审批快速，额度灵活',
      tags: ['科技企业', '快速审批', '高额度'],
    },
    {
      id: '2',
      name: '小微企业信用贷',
      type: 'LOAN',
      amount: 2000000,
      rate: '5.44%',
      term: '1-3年',
      description: '无需抵押，纯信用贷款，适合小微企业日常经营周转',
      tags: ['信用贷款', '无需抵押', '随借随还'],
    },
    {
      id: '3',
      name: '知识产权质押融资',
      type: 'LOAN',
      amount: 10000000,
      rate: '4.65%',
      term: '1-5年',
      description: '以企业知识产权作为质押物，获取融资支持',
      tags: ['知识产权', '专利质押', '高额度'],
    },
    {
      id: '4',
      name: '供应链金融',
      type: 'FACTORING',
      amount: 3000000,
      rate: '3.98%',
      term: '6个月',
      description: '基于核心企业信用的应收账款融资服务',
      tags: ['供应链', '账期灵活', '低利率'],
    },
    {
      id: '5',
      name: '创业担保贷款',
      type: 'LOAN',
      amount: 3000000,
      rate: '2.0%',
      term: '2-3年',
      description: '政府贴息创业贷款，助您轻松创业',
      tags: ['政府贴息', '创业支持', '低利率'],
    },
  ]);
  const [matching, setMatching] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const handleMatch = () => {
    setMatching(true);
    // Simulate matching
    setTimeout(() => {
      setMatchScore(Math.floor(Math.random() * 30) + 70);
      setMatching(false);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(1)}千万`;
    } else if (amount >= 10000) {
      return `${(amount / 10000).toFixed(0)}万`;
    }
    return amount.toLocaleString();
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'LOAN': '贷款',
      'FACTORING': '保理',
      'BOND': '债券',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">智</span>
              </div>
              <span className="text-xl font-bold text-blue-900">智策云</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">登录</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">智能资产匹配</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              基于企业画像和融资需求，智能匹配最适合的金融产品
            </p>
          </div>

          {/* Match Score Banner */}
          {matchScore !== null && (
            <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">智能匹配度</h2>
                  <p className="text-blue-100">为您推荐最适合的产品组合</p>
                </div>
                <div className="text-6xl font-bold">{matchScore}%</div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Filters */}
            <Card className="lg:col-span-1 h-fit sticky top-24">
              <CardHeader>
                <CardTitle>融资需求</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                <Input
                  label="融资规模"
                  placeholder="请输入融资金额"
                  value={filters.amount}
                  onChange={(e) => setFilters(prev => ({ ...prev, amount: e.target.value }))}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">期限要求</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.term}
                    onChange={(e) => setFilters(prev => ({ ...prev, term: e.target.value }))}
                  >
                    <option value="">不限</option>
                    <option value="6m">6个月以内</option>
                    <option value="1y">1年以内</option>
                    <option value="1-3y">1-3年</option>
                    <option value="3y+">3年以上</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">产品类型</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="">全部</option>
                    <option value="LOAN">贷款</option>
                    <option value="FACTORING">保理融资</option>
                    <option value="BOND">债券</option>
                  </select>
                </div>
                <Button className="w-full" onClick={handleMatch} loading={matching}>
                  {matching ? '智能匹配中...' : '开始匹配'}
                </Button>
              </div>
            </Card>

            {/* Results */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {matchScore !== null ? '推荐产品' : '热门产品'}
                </h2>
                <span className="text-sm text-gray-500">{results.length} 个结果</span>
              </div>

              <div className="space-y-4">
                {results.map((asset) => (
                  <Card key={asset.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                            {getTypeLabel(asset.type)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{asset.description}</p>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-600">额度：{formatCurrency(asset.amount)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-600">期限：{asset.term}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-600">利率：{asset.rate}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {asset.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-6">
                        <Button>立即申请</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              {results.length > 0 && (
                <div className="text-center">
                  <Button variant="outline">加载更多</Button>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">智能匹配</h3>
              <p className="text-gray-600">基于企业数据，AI 智能推荐最适合的金融产品</p>
            </Card>
            <Card className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">高效审批</h3>
              <p className="text-gray-600">在线申请，快速审批，最快 24 小时放款</p>
            </Card>
            <Card className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">专属服务</h3>
              <p className="text-gray-600">一对一客户经理服务，全程跟踪协助</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
