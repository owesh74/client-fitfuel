import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const OutletMenu = () => {
  const { id } = useParams();
  const [outlet, setOutlet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('itemName');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchOutletMenu = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/outlets/${id}`);
        setOutlet(res.data);
      } catch (err) {
        toast.error('Failed to fetch menu.');
      } finally {
        setLoading(false);
      }
    };
    fetchOutletMenu();
  }, [id]);

  // Filter and sort menu items
  const filteredAndSortedMenu = outlet?.menu ? outlet.menu
    .filter(item => 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }) : [];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return (
        <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      );
    }
    
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 ml-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-10 bg-gray-200 rounded w-64 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Menu Not Found</h2>
          <p className="text-gray-600">Sorry, we couldn't find this outlet's menu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
         
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {outlet.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {outlet.description}
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg border mb-8 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
              />
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {filteredAndSortedMenu.length} item{filteredAndSortedMenu.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </div>

        {/* Menu Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          {filteredAndSortedMenu.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your search terms.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      {[
                        { key: 'itemName', label: 'Item Name' },
                        { key: 'calories', label: 'Calories' },
                        { key: 'protein', label: 'Protein (g)' },
                        { key: 'carbs', label: 'Carbs (g)' },
                        { key: 'fat', label: 'Fat (g)' }
                      ].map(({ key, label }) => (
                        <th
                          key={key}
                          onClick={() => handleSort(key)}
                          className="py-4 px-6 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                        >
                          <div className="flex items-center">
                            {label}
                            {getSortIcon(key)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAndSortedMenu.map((item, index) => (
                      <tr
                        key={item._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">
                            {item.itemName}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200">
                            {item.calories}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {item.protein}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            {item.carbs}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            {item.fat}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden p-4 space-y-4">
                {filteredAndSortedMenu.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">
                      {item.itemName}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1">
                          Calories
                        </div>
                        <div className="text-lg font-semibold text-orange-900">
                          {item.calories}
                        </div>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <div className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">
                          Protein
                        </div>
                        <div className="text-lg font-semibold text-emerald-900">
                          {item.protein}g
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                          Carbs
                        </div>
                        <div className="text-lg font-semibold text-blue-900">
                          {item.carbs}g
                        </div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-1">
                          Fat
                        </div>
                        <div className="text-lg font-semibold text-purple-900">
                          {item.fat}g
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'Total Items', 
              value: outlet.menu.length, 
              color: 'bg-slate-900',
              icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m-1-4h1m4 4h1m-1-4h1'
            },
            { 
              label: 'Avg Calories', 
              value: Math.round(outlet.menu.reduce((acc, item) => acc + item.calories, 0) / outlet.menu.length), 
              color: 'bg-orange-600',
              icon: 'M13 10V3L4 14h7v7l9-11h-7z'
            },
            { 
              label: 'Avg Protein', 
              value: `${Math.round(outlet.menu.reduce((acc, item) => acc + item.protein, 0) / outlet.menu.length)}g`, 
              color: 'bg-emerald-600',
              icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
            },
            { 
              label: 'Showing', 
              value: filteredAndSortedMenu.length, 
              color: 'bg-blue-600',
              icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
            }
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.color} rounded-lg p-6 text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/90">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutletMenu;