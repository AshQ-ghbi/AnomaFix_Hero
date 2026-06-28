/**
 * NotFound 404 Page Component
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col items-center justify-center p-6 text-center" id="notfound-page-root">
      <div className="max-w-md bg-white rounded-2xl border border-slate-100 p-8 shadow-xs flex flex-col items-center gap-5">
        
        <div className="bg-red-50 text-red-600 p-4 rounded-full border border-red-100">
          <ShieldAlert className="h-8 w-8 animate-bounce" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900">404 - Ward Coordinates Lost</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            The civic page you are attempting to locate does not exist or has been archived by the municipal dispatch registry.
          </p>
        </div>

        <Link
          to="/dashboard"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

      </div>
    </div>
  );
}
