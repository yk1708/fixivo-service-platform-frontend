import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  TrendingUp, RefreshCw, AlertCircle, Clock, CheckCircle2,
  XCircle, ClipboardList, AlertTriangle, ArrowUpRight, BarChart3, PieChart
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_FIXIVO_APP_API_URL || 'https://fixivo-service-platform-backend.onrender.com';

export default function ProviderAnalytics() {
  const { accessToken } = useSelector(s => s.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('all'); // 'all' | 'services' | 'emergencies'

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/provider/data-analysis`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error((await res.json()).message || 'Failed to fetch analytics data');
      }
      const result = await res.json();
      if (result.success) {
        setData(result);
      } else {
        throw new Error(result.message || 'Analytics fetch failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 text-center">
        <div className="w-12 h-12 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Generating your performance insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <AlertCircle size={32} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Unable to load analytics</h3>
          <p className="text-sm text-slate-500 mt-1">{error}</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  const { serviceRequestsStats = {}, emergencyRequestsStats = {} } = data || {};

  const sReq = serviceRequestsStats.totalRequestedService || 0;
  const sAcc = serviceRequestsStats.totalAcceptedService || 0;
  const sComp = serviceRequestsStats.totalCompletedService || 0;
  const sRej = serviceRequestsStats.totalRejectedService || 0;
  const sPend = serviceRequestsStats.totalPendingService || 0;

  const eReq = emergencyRequestsStats.totalRequestedEmergency || 0;
  const eAcc = emergencyRequestsStats.totalAcceptedEmergency || 0;
  const eComp = emergencyRequestsStats.totalCompletedEmergency || 0;
  const eRej = emergencyRequestsStats.totalRejectedEmergency || 0;
  const ePend = emergencyRequestsStats.totalPendingEmergency || 0;

  // Combined calculations
  const totalRequests = sReq + eReq;
  const totalCompleted = sComp + eComp;
  const totalAccepted = sAcc + eAcc;
  const totalPending = sPend + ePend;
  const totalRejected = sRej + eRej;

  const serviceCompletionRate = sAcc > 0 ? Math.round((sComp / sAcc) * 100) : 0;
  const serviceAcceptanceRate = sReq > 0 ? Math.round((sAcc / sReq) * 100) : 0;

  const emergencyCompletionRate = eAcc > 0 ? Math.round((eComp / eAcc) * 100) : 0;
  const emergencyAcceptanceRate = eReq > 0 ? Math.round((eAcc / eReq) * 100) : 0;

  const combinedCompletionRate = totalAccepted > 0 ? Math.round((totalCompleted / totalAccepted) * 100) : 0;
  const combinedAcceptanceRate = totalRequests > 0 ? Math.round((totalAccepted / totalRequests) * 100) : 0;

  // Max value for scaling SVG chart bars
  const maxVal = Math.max(sReq, sAcc, sComp, sRej, sPend, eReq, eAcc, eComp, eRej, ePend, 5);

  // SVG Bar Chart dimensions
  const chartHeight = 220;
  const chartWidth = 500;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const graphHeight = chartHeight - paddingTop - paddingBottom;
  const graphWidth = chartWidth - paddingLeft - paddingRight;

  // 5 Status Categories
  const categories = [
    { label: 'Requested', sVal: sReq, eVal: eReq, colorS: '#3B82F6', colorE: '#F59E0B' },
    { label: 'Pending', sVal: sPend, eVal: ePend, colorS: '#60A5FA', colorE: '#FBBF24' },
    { label: 'Accepted', sVal: sAcc, eVal: eAcc, colorS: '#10B981', colorE: '#EC4899' },
    { label: 'Completed', sVal: sComp, eVal: eComp, colorS: '#6366F1', colorE: '#8B5CF6' },
    { label: 'Rejected', sVal: sRej, eVal: eRej, colorS: '#EF4444', colorE: '#F43F5E' },
  ];

  // Circular Progress Ring calculations (radius = 35, circumference = 220)
  const radius = 35;
  const circumference = 2 * Math.PI * radius; // 219.91

  const getStrokeDashoffset = (percentage) => {
    return circumference - (percentage / 100) * circumference;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Analytics Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time performance metrics and service trends.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeView === 'all' ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            All Requests
          </button>
          <button
            onClick={() => setActiveView('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeView === 'services' ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveView('emergencies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeView === 'emergencies' ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            Emergencies
          </button>
          <button
            onClick={fetchAnalytics}
            title="Refresh Data"
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {activeView === 'all' ? totalRequests : activeView === 'services' ? sReq : eReq}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">Total Requests</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ClipboardList size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-slate-400 text-xs">
            <span className="font-semibold text-slate-600">
              {activeView === 'all'
                ? `${sReq} regular · ${eReq} emergency`
                : activeView === 'services' ? 'Standard services only' : 'Urgent emergencies only'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {activeView === 'all' ? totalCompleted : activeView === 'services' ? sComp : eComp}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">Completed Jobs</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-1.5 text-slate-400 text-xs">
            <span className="font-semibold text-slate-600">
              {activeView === 'all'
                ? `${sComp} regular · ${eComp} emergency`
                : activeView === 'services' ? `${sComp} completed` : `${eComp} completed`}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {activeView === 'all' ? combinedAcceptanceRate : activeView === 'services' ? serviceAcceptanceRate : emergencyAcceptanceRate}%
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">Acceptance Rate</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 text-slate-400 text-xs">
            <span className="font-semibold text-slate-600">
              {activeView === 'all'
                ? `${totalAccepted} of ${totalRequests} accepted`
                : activeView === 'services' ? `${sAcc} of ${sReq} accepted` : `${eAcc} of ${eReq} accepted`}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {activeView === 'all' ? combinedCompletionRate : activeView === 'services' ? serviceCompletionRate : emergencyCompletionRate}%
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-1.5 uppercase tracking-wider">Completion Rate</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50 text-slate-400 text-xs">
            <span className="font-semibold text-slate-600">
              {activeView === 'all'
                ? `${totalCompleted} of ${totalAccepted} accepted jobs`
                : activeView === 'services' ? `${sComp} of ${sAcc} jobs` : `${eComp} of ${eAcc} jobs`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* SVG Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Requests Distribution by Status</h3>
              <p className="text-xs text-slate-400">Comparing service vs emergency categories.</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span className="text-slate-500">Service</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span className="text-slate-500">Emergency</span>
              </div>
            </div>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="relative w-full h-[220px] flex items-center justify-center">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full font-sans text-[10px] select-none"
            >
              {/* Horizontal Gridlines & Y-Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const value = Math.round(maxVal * ratio);
                const y = paddingTop + graphHeight * (1 - ratio);
                return (
                  <g key={idx} className="opacity-40">
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#64748B"
                      className="font-semibold"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              {/* Bars and X-Axis labels */}
              {categories.map((cat, idx) => {
                const sectionWidth = graphWidth / categories.length;
                const sectionX = paddingLeft + idx * sectionWidth;

                // Coordinates for two side-by-side bars
                const barWidth = 14;
                const gap = 4;
                const centerX = sectionX + sectionWidth / 2;

                const sBarX = centerX - barWidth - gap / 2;
                const eBarX = centerX + gap / 2;

                const sBarHeight = (cat.sVal / maxVal) * graphHeight;
                const eBarHeight = (cat.eVal / maxVal) * graphHeight;

                const sBarY = paddingTop + graphHeight - sBarHeight;
                const eBarY = paddingTop + graphHeight - eBarHeight;

                // Only render colors depending on view filters
                const renderS = activeView === 'all' || activeView === 'services';
                const renderE = activeView === 'all' || activeView === 'emergencies';

                return (
                  <g key={idx}>
                    {/* Service Bar */}
                    {renderS && sBarHeight > 0 && (
                      <g className="group cursor-pointer">
                        <rect
                          x={sBarX}
                          y={sBarY}
                          width={barWidth}
                          height={sBarHeight}
                          fill={cat.colorS}
                          rx={3}
                          className="transition-all duration-300 hover:opacity-85"
                        />
                        <text
                          x={sBarX + barWidth / 2}
                          y={sBarY - 4}
                          textAnchor="middle"
                          fill="#1E3A8A"
                          className="font-bold text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {cat.sVal}
                        </text>
                      </g>
                    )}

                    {/* Emergency Bar */}
                    {renderE && eBarHeight > 0 && (
                      <g className="group cursor-pointer">
                        <rect
                          x={eBarX}
                          y={eBarY}
                          width={barWidth}
                          height={eBarHeight}
                          fill={cat.colorE}
                          rx={3}
                          className="transition-all duration-300 hover:opacity-85"
                        />
                        <text
                          x={eBarX + barWidth / 2}
                          y={eBarY - 4}
                          textAnchor="middle"
                          fill="#D97706"
                          className="font-bold text-[9px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {cat.eVal}
                        </text>
                      </g>
                    )}

                    {/* X-Axis Category Label */}
                    <text
                      x={centerX}
                      y={chartHeight - 15}
                      textAnchor="middle"
                      fill="#64748B"
                      className="font-bold text-[10px]"
                    >
                      {cat.label}
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Base Line */}
              <line
                x1={paddingLeft}
                y1={chartHeight - paddingBottom}
                x2={chartWidth - paddingRight}
                y2={chartHeight - paddingBottom}
                stroke="#CBD5E1"
                strokeWidth={1.5}
              />
            </svg>
          </div>
        </div>

        {/* Completion Rates Circular Progress Indicators */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Fulfillment Performance</h3>
            <p className="text-xs text-slate-400">Completion rate of accepted jobs.</p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-around py-4 gap-6">

            {/* Service Circle */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="transparent"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={getStrokeDashoffset(serviceCompletionRate)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold text-slate-800">{serviceCompletionRate}%</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Service Completion</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{sComp} of {sAcc} accepted requests completed</p>
              </div>
            </div>

            {/* Emergency Circle */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="8"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="transparent"
                    stroke="#EC4899"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={getStrokeDashoffset(emergencyCompletionRate)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold text-slate-800">{emergencyCompletionRate}%</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">Emergency Completion</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{eComp} of {eAcc} accepted requests completed</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Detailed Table / Metrics Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Granular Metrics Matrix</h3>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">Metrics Breakdowns</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Requested</th>
                <th className="px-6 py-3">Pending</th>
                <th className="px-6 py-3">Accepted</th>
                <th className="px-6 py-3">Completed</th>
                <th className="px-6 py-3">Rejected</th>
                <th className="px-6 py-3">Acceptance Rate</th>
                <th className="px-6 py-3">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-bold text-slate-800">Standard Service</span>
                </td>
                <td className="px-6 py-4">{sReq}</td>
                <td className="px-6 py-4 text-slate-400">{sPend}</td>
                <td className="px-6 py-4 text-emerald-600">{sAcc}</td>
                <td className="px-6 py-4 text-indigo-600">{sComp}</td>
                <td className="px-6 py-4 text-red-500">{sRej}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{serviceAcceptanceRate}%</td>
                <td className="px-6 py-4 font-bold text-slate-700">{serviceCompletionRate}%</td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-bold text-slate-800">Emergency Requests</span>
                </td>
                <td className="px-6 py-4">{eReq}</td>
                <td className="px-6 py-4 text-slate-400">{ePend}</td>
                <td className="px-6 py-4 text-emerald-600">{eAcc}</td>
                <td className="px-6 py-4 text-indigo-600">{eComp}</td>
                <td className="px-6 py-4 text-red-500">{eRej}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{emergencyAcceptanceRate}%</td>
                <td className="px-6 py-4 font-bold text-slate-700">{emergencyCompletionRate}%</td>
              </tr>
              <tr className="bg-slate-50/30 font-bold border-t border-slate-200">
                <td className="px-6 py-4 text-slate-900">Total / Average</td>
                <td className="px-6 py-4 text-slate-900">{totalRequests}</td>
                <td className="px-6 py-4 text-slate-500">{totalPending}</td>
                <td className="px-6 py-4 text-emerald-700">{totalAccepted}</td>
                <td className="px-6 py-4 text-indigo-700">{totalCompleted}</td>
                <td className="px-6 py-4 text-red-600">{totalRejected}</td>
                <td className="px-6 py-4 text-blue-700">{combinedAcceptanceRate}%</td>
                <td className="px-6 py-4 text-blue-700">{combinedCompletionRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
