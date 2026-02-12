'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import api from '@/lib/api';

interface Company {
  id: string;
  name: string;
  unifiedSocialCreditCode?: string;
  legalRepresentative?: string;
  industry?: string;
  creditScore?: number;
  riskLevel?: string;
  createdAt: string;
  _count?: {
    reports: number;
  };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unifiedSocialCreditCode: '',
    legalRepresentative: '',
    industry: '',
    registrationCapital: '',
    address: '',
    businessScope: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [pagination.page]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.getCompanies({
        page: pagination.page,
        pageSize: pagination.pageSize,
        name: searchName,
      });
      setCompanies(response.data);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCompanies();
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createCompany({
        ...formData,
        registrationCapital: formData.registrationCapital ? parseFloat(formData.registrationCapital) : undefined,
      });
      setShowModal(false);
      setFormData({
        name: '',
        unifiedSocialCreditCode: '',
        legalRepresentative: '',
        industry: '',
        registrationCapital: '',
        address: '',
        businessScope: '',
      });
      fetchCompanies();
    } catch (error) {
      console.error('Failed to create company:', error);
      alert('创建失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case 'VERY_LOW': return 'bg-green-100 text-green-700';
      case 'LOW': return 'bg-blue-100 text-blue-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'HIGH': return 'bg-orange-100 text-orange-700';
      case 'VERY_HIGH': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskLevelLabel = (level?: string) => {
    const labels: Record<string, string> = {
      'VERY_LOW': '极低',
      'LOW': '低',
      'MEDIUM': '中',
      'HIGH': '高',
      'VERY_HIGH': '极高',
    };
    return labels[level || ''] || '未评估';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">企业管理</h1>
          <p className="text-gray-600 mt-1">管理您的企业列表</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          添加企业
        </Button>
      </div>

      {/* Search */}
      <Card>
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="搜索企业名称..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            搜索
          </Button>
        </form>
      </Card>

      {/* Company List */}
      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-500 mb-4">暂无企业</p>
            <Button onClick={() => setShowModal(true)}>添加第一个企业</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">企业名称</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">统一社会信用代码</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">行业</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">信用评分</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">风险等级</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">报告数量</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{company.name}</div>
                      {company.legalRepresentative && (
                        <div className="text-sm text-gray-500">法人：{company.legalRepresentative}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {company.unifiedSocialCreditCode || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {company.industry || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {company.creditScore ? (
                        <span className="font-semibold text-blue-600">{company.creditScore}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {company.riskLevel ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(company.riskLevel)}`}>
                          {getRiskLevelLabel(company.riskLevel)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {company._count?.reports || 0} 份
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/companies/${company.id}`}>
                        <Button variant="ghost" size="sm">查看详情</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.pageSize && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              共 <span className="font-medium">{pagination.total}</span> 条记录
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page * pagination.pageSize >= pagination.total}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">添加企业</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
              <Input
                label="企业名称 *"
                placeholder="请输入企业名称"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="统一社会信用代码"
                placeholder="请输入统一社会信用代码"
                value={formData.unifiedSocialCreditCode}
                onChange={(e) => setFormData(prev => ({ ...prev, unifiedSocialCreditCode: e.target.value }))}
              />
              <Input
                label="法定代表人"
                placeholder="请输入法定代表人"
                value={formData.legalRepresentative}
                onChange={(e) => setFormData(prev => ({ ...prev, legalRepresentative: e.target.value }))}
              />
              <Input
                label="注册资本 (万元)"
                placeholder="请输入注册资本"
                type="number"
                value={formData.registrationCapital}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationCapital: e.target.value }))}
              />
              <Input
                label="所属行业"
                placeholder="请输入所属行业"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              />
              <Input
                label="注册地址"
                placeholder="请输入注册地址"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">经营范围</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="请输入经营范围"
                  value={formData.businessScope}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessScope: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  取消
                </Button>
                <Button type="submit" className="flex-1" loading={submitting}>
                  创建
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
