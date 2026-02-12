'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import api from '@/lib/api';

interface ServiceOrder {
  id: string;
  type: string;
  status: string;
  description: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'CONSULTATION',
    description: '',
    companyName: '',
    contactName: '',
    contactPhone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.getServiceOrders({
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
      setOrders(response.data);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createServiceOrder(formData);
      setShowModal(false);
      setFormData({
        type: 'CONSULTATION',
        description: '',
        companyName: '',
        contactName: '',
        contactPhone: '',
      });
      fetchOrders();
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('创建失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateServiceOrderStatus(id, status);
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': '待处理',
      'IN_PROGRESS': '处理中',
      'COMPLETED': '已完成',
      'CANCELLED': '已取消',
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'CONSULTATION': '咨询',
      'FINANCING': '融资',
      'ASSET_MANAGEMENT': '资产管理',
      'OTHER': '其他',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">服务工单</h1>
          <p className="text-gray-600 mt-1">管理您的服务申请</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          创建工单
        </Button>
      </div>

      {/* Order List */}
      <Card padding="none">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-gray-500 mb-4">暂无工单</p>
            <Button onClick={() => setShowModal(true)}>创建第一个工单</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">服务类型</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">企业名称</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">联系人</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">创建时间</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{getTypeLabel(order.type)}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{order.companyName}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{order.contactName}</div>
                      <div className="text-sm text-gray-500">{order.contactPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                        >
                          取消
                        </Button>
                      )}
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
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">创建服务工单</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">服务类型 *</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="CONSULTATION">咨询</option>
                  <option value="FINANCING">融资</option>
                  <option value="ASSET_MANAGEMENT">资产管理</option>
                  <option value="OTHER">其他</option>
                </select>
              </div>
              <Input
                label="企业名称 *"
                placeholder="请输入企业名称"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">问题描述 *</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="请详细描述您的问题或需求"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <Input
                label="联系人 *"
                placeholder="请输入联系人姓名"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                required
              />
              <Input
                label="联系电话 *"
                placeholder="请输入联系电话"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                required
              />
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
                  提交
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
