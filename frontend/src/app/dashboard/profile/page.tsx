'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现更新用户信息
    setSuccess('个人信息已更新');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    // TODO: 实现修改密码
    setSuccess('密码已修改');
    setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
        <p className="text-gray-600 mt-1">管理您的账户信息</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            个人信息
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            安全设置
          </button>
        </nav>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user?.name || '用户'}</h3>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                  角色：{user?.role === 'ADMIN' ? '管理员' : user?.role === 'ANALYST' ? '分析师' : '普通用户'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="姓名"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                label="邮箱"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">保存更改</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>修改密码</CardTitle>
            </CardHeader>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <Input
                label="当前密码"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
              <Input
                label="新密码"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
              />
              <Input
                label="确认新密码"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
              <div className="flex justify-end">
                <Button type="submit">修改密码</Button>
              </div>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>退出登录</CardTitle>
            </CardHeader>
            <p className="text-gray-600 mb-4">退出当前账户</p>
            <Button variant="outline" onClick={logout}>
              退出登录
            </Button>
          </Card>
        </div>
      )}

      {/* Account Info */}
      <Card className="bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">账户信息</h3>
            <p className="text-sm text-gray-500 mt-1">账户创建时间：{new Date().toLocaleDateString('zh-CN')}</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {user?.role === 'ADMIN' ? '管理员' : '正式账户'}
          </span>
        </div>
      </Card>
    </div>
  );
}
