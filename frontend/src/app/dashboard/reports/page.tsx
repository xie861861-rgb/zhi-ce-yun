'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import api from '@/lib/api';

interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  content?: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });

  useEffect(() => {
    fetchReports();
  }, [pagination.page]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.getReports({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      setReports(response.data);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除此报告吗？')) return;
    try {
      await api.deleteReport(id);
      fetchReports();
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('删除失败，请稍后重试');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': '待处理',
      'PROCESSING': '处理中',
      'COMPLETED': '已完成',
      'FAILED': '失败',
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'CREDIT': '信用评估',
      'NFS': '净融资空间',
      'ASSET_CONFIG': '资产配置',
      'RISK_ANALYSIS': '风险分析',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CREDIT': return 'bg-blue-100 text-blue-700';
      case 'NFS': return 'bg-purple-100 text-purple-700';
      case 'ASSET_CONFIG': return 'bg-green-100 text-green-700';
      case 'RISK_ANALYSIS': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">报告管理</h1>
          <p className="text-gray-600 mt-1">查看和管理所有分析报告</p>
        </div>
        <Link href="/audit">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            生成报告
          </Button>
        </Link>
      </div>

      {/* Report List */}
      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 mb-4">暂无报告</p>
            <Link href="/audit">
              <Button>生成第一个报告</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">报告标题</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">报告类型</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">生成时间</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{report.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getTypeColor(report.type)}`}>
                        {getTypeLabel(report.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/reports/${report.id}`}>
                          <Button variant="ghost" size="sm">查看</Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(report.id)}
                        >
                          删除
                        </Button>
                      </div>
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
    </div>
  );
}
