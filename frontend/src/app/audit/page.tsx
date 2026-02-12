'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface FileUpload {
  name: string;
  file: File | null;
  uploading: boolean;
  progress: number;
}

export default function AuditPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    unifiedSocialCreditCode: '',
  });
  const [files, setFiles] = useState<FileUpload[]>([
    { name: '营业执照', file: null, uploading: false, progress: 0 },
    { name: '财务报表', file: null, uploading: false, progress: 0 },
    { name: '征信报告', file: null, uploading: false, progress: 0 },
  ]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, file, progress: 0 } : f
      ));
    }
  };

  const handleUpload = async (index: number) => {
    const file = files[index].file;
    if (!file) return;

    setFiles(prev => prev.map((f, i) => i === index ? { ...f, uploading: true } : f));

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, uploading: false, progress: 100 } : f
    ));
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    const result = {
      creditScore: Math.floor(Math.random() * 200) + 600,
      riskLevel: ['VERY_LOW', 'LOW', 'MEDIUM'][Math.floor(Math.random() * 3)],
      matchingRate: Math.floor(Math.random() * 30) + 70,
      recommendations: [
        '企业财务状况良好，建议关注现金流管理',
        '可考虑申请科技创新贷款支持',
        '建议定期进行信用维护',
      ],
    };
    setAnalysisResult(result);
    setAnalyzing(false);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'VERY_LOW': return 'bg-green-100 text-green-700 border-green-200';
      case 'LOW': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'VERY_HIGH': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'VERY_LOW': '极低风险',
      'LOW': '低风险',
      'MEDIUM': '中等风险',
      'HIGH': '高风险',
      'VERY_HIGH': '极高风险',
    };
    return labels[level] || level;
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
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {['企业信息', '上传文件', 'AI分析'].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-medium
                    ${step > index + 1 ? 'bg-green-500 text-white' : step === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {step > index + 1 ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${step === index + 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                    {label}
                  </span>
                  {index < 2 && (
                    <div className={`w-12 h-0.5 mx-4 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Company Info */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>企业基本信息</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                <Input
                  label="企业名称 *"
                  placeholder="请输入企业名称"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  label="统一社会信用代码"
                  placeholder="请输入统一社会信用代码（选填）"
                  value={companyInfo.unifiedSocialCreditCode}
                  onChange={(e) => setCompanyInfo(prev => ({ ...prev, unifiedSocialCreditCode: e.target.value }))}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={() => setStep(2)}
                    disabled={!companyInfo.name}
                  >
                    下一步
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: File Upload */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>上传企业三件套</CardTitle>
              </CardHeader>
              <p className="text-gray-600 mb-6">请上传营业执照、财务报表和征信报告，支持 PDF、Excel、Word 格式</p>
              
              <div className="space-y-4">
                {files.map((fileItem, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.414 5.293l5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{fileItem.name}</p>
                          <p className="text-sm text-gray-500">
                            {fileItem.file ? fileItem.file.name : '未选择文件'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          ref={el => { fileInputRefs.current[index] = el }}
                          type="file"
                          accept=".pdf,.xlsx,.xls,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleFileSelect(index, e)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[index]?.click()}
                        >
                          选择文件
                        </Button>
                        {fileItem.file && !fileItem.progress && (
                          <Button
                            size="sm"
                            onClick={() => handleUpload(index)}
                            loading={fileItem.uploading}
                          >
                            上传
                          </Button>
                        )}
                        {fileItem.progress === 100 && (
                          <span className="text-green-600 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            已上传
                          </span>
                        )}
                      </div>
                    </div>
                    {fileItem.uploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: '60%' }}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  上一步
                </Button>
                <Button onClick={() => setStep(3)}>
                  下一步
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Analysis */}
          {step === 3 && !analysisResult && (
            <Card className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI 智能分析</h2>
              <p className="text-gray-600 mb-8">基于您上传的企业资料，AI 将进行全面的信用评估和风险分析</p>
              <Button size="lg" onClick={handleAnalyze} loading={analyzing}>
                {analyzing ? 'AI 分析中...' : '开始 AI 分析'}
              </Button>
              <p className="text-sm text-gray-500 mt-4">预计耗时约 1-2 分钟</p>
            </Card>
          )}

          {/* Analysis Result */}
          {analysisResult && (
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <div className="text-center py-8">
                  <div className="text-6xl font-bold mb-2">{analysisResult.creditScore}</div>
                  <div className="text-blue-100">企业信用评分</div>
                  <div className={`inline-flex px-4 py-2 rounded-full mt-4 border-2 ${getRiskLevelColor(analysisResult.riskLevel)}`}>
                    {getRiskLevelLabel(analysisResult.riskLevel)}
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <div className="text-4xl font-bold text-blue-600">{analysisResult.matchingRate}%</div>
                  <div className="text-gray-600 mt-1">政策匹配度</div>
                </Card>
                <Card className="text-center">
                  <div className="text-4xl font-bold text-green-600">92%</div>
                  <div className="text-gray-600 mt-1">通过率预估</div>
                </Card>
                <Card className="text-center">
                  <div className="text-4xl font-bold text-purple-600">A+</div>
                  <div className="text-gray-600 mt-1">建议评级</div>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>AI 建议</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  {analysisResult.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => {
                  setStep(1);
                  setAnalysisResult(null);
                  setFiles(files.map(f => ({ ...f, file: null, progress: 0 })));
                }}>
                  重新分析
                </Button>
                <Link href="/dashboard/reports" className="flex-1">
                  <Button className="w-full">
                    查看完整报告
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
