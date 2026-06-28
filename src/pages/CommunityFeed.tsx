/**
 * Community Feed - Social verification & commenting hub
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, Report, Comment } from '../utils/supabase';
import { MessageSquare, Heart, Share2, CornerDownRight, AlertTriangle, Bookmark, Sparkles, Send, CheckCircle2, User } from 'lucide-react';

export default function CommunityFeed() {
  const [searchParams] = useSearchParams();
  const focusReportId = searchParams.get('reportId');

  const [reports, setReports] = useState<Report[]>([]);
  const [commentsState, setCommentsState] = useState<Record<string, Comment[]>>({});
  const [activeCommentsReportId, setActiveCommentsReportId] = useState<string | null>(focusReportId || null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [followedIssues, setFollowedIssues] = useState<Record<string, boolean>>({});
  const [shareToastId, setShareToastId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const unsub = supabase.subscribe(() => {
      loadData();
    });
    return unsub;
  }, []);

  const loadData = () => {
    const list = supabase.getReports();
    setReports(list);

    // Load comments for each report
    const commentsMap: Record<string, Comment[]> = {};
    list.forEach(r => {
      commentsMap[r.id] = supabase.getComments(r.id);
    });
    setCommentsState(commentsMap);
  };

  const handleToggleVote = (id: string) => {
    supabase.toggleVote(id);
    loadData();
  };

  const handleToggleDuplicate = (id: string) => {
    supabase.toggleVote(id, 'duplicate');
    loadData();
    alert("Issue flagged as a potential duplicate. Municipal dispatch has been alerted to review the coordinate overlap.");
  };

  const handleAddComment = (reportId: string) => {
    const text = commentText[reportId];
    if (!text?.trim()) return;

    supabase.addComment(reportId, text);
    setCommentText(prev => ({ ...prev, [reportId]: '' }));
    loadData();
  };

  const handleToggleFollow = (id: string) => {
    setFollowedIssues(prev => ({ ...prev, [id]: !prev[id] }));
    const following = !followedIssues[id];
    
    // Create notification
    const curr = supabase.getCurrentUser();
    if (curr) {
      supabase.createNotification(
        curr.id, 
        following ? 'Following Issue' : 'Unfollowed Issue', 
        `You will ${following ? 'now' : 'no longer'} receive SMS and email status updates for this report.`
      );
    }
  };

  const handleShare = (reportId: string, title: string) => {
    const link = `${window.location.origin}/feed?reportId=${reportId}`;
    navigator.clipboard.writeText(link).then(() => {
      setShareToastId(reportId);
      setTimeout(() => setShareToastId(null), 2500);
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 w-full overflow-x-hidden" id="community-feed-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Community Social Feed</h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
            Validate nearby civic reports, converse on resolution strategies, and build public consensus to drive city dispatch priorities.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* MIDDLE COLUMN: Social Stream Feed */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            
            {reports.map((report) => {
              const comments = commentsState[report.id] || [];
              const isCommentingActive = activeCommentsReportId === report.id;
              const isFollowing = !!followedIssues[report.id];
              const isShared = shareToastId === report.id;

              return (
                <div
                  key={report.id}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-xs flex flex-col gap-4 ${
                    focusReportId === report.id ? 'ring-2 ring-blue-500 border-blue-200' : 'border-slate-100'
                  }`}
                  id={`feed-card-${report.id}`}
                >
                  {/* Card Header: Creator info */}
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={report.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg'}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-slate-100 object-cover shrink-0"
                        alt="User Avatar"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                          <h4 className="font-bold text-slate-900 text-xs truncate max-w-[120px] sm:max-w-none">{report.user?.name}</h4>
                          <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[7.5px] sm:text-[8px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wide shrink-0">
                            {report.user?.role}
                          </span>
                        </div>
                        <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium">
                          Reported {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                        report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Media Image Proof */}
                  {report.image_url && (
                    <div className="rounded-xl overflow-hidden max-h-72 sm:max-h-80 border border-slate-50 bg-slate-50 select-none">
                      <img src={report.image_url} className="w-full h-full object-cover" alt="Report visual proof" />
                    </div>
                  )}

                  {/* Card Content Details */}
                  <div className="flex flex-col gap-2 min-w-0">
                    <h3 className="font-extrabold text-slate-950 text-sm md:text-base leading-snug">{report.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{report.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-400 font-semibold mt-1 min-w-0">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase tracking-wider text-[8px] shrink-0">
                        {report.category}
                      </span>
                      <span className="break-words max-w-full">📍 {report.address}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="shrink-0">Confidence score: {Math.round(report.confidence * 100)}%</span>
                    </div>
                  </div>

                  {/* Card Interaction Actions Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-y border-slate-50 py-2 mt-2 text-[10.5px] sm:text-xs">
                    
                    {/* Upvote / Verify Button */}
                    <button
                      onClick={() => handleToggleVote(report.id)}
                      className={`flex items-center gap-1 sm:gap-1.5 font-bold px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all cursor-pointer ${
                        report.is_upvoted_by_me 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${report.is_upvoted_by_me ? 'fill-blue-600 stroke-blue-600' : ''}`} />
                      <span>Verify ({report.upvotes_count || 0})</span>
                    </button>

                    {/* Toggle Comments Button */}
                    <button
                      onClick={() => setActiveCommentsReportId(isCommentingActive ? null : report.id)}
                      className={`flex items-center gap-1 sm:gap-1.5 font-bold px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all cursor-pointer ${
                        isCommentingActive ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      <span>Discuss ({comments.length})</span>
                    </button>

                    {/* Follow Issue Button */}
                    <button
                      onClick={() => handleToggleFollow(report.id)}
                      className={`flex items-center gap-1 sm:gap-1.5 font-bold px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all cursor-pointer ${
                        isFollowing ? 'text-amber-600 bg-amber-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 sm:h-4.5 sm:w-4.5 ${isFollowing ? 'fill-amber-600' : ''}`} />
                      <span>{isFollowing ? 'Following' : 'Follow'}</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(report.id, report.title)}
                      className="flex items-center gap-1 sm:gap-1.5 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all cursor-pointer relative"
                    >
                      <Share2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      <span>Share</span>
                      {isShared && (
                        <div className="absolute bottom-[115%] left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded shadow-md whitespace-nowrap z-30">
                          Link copied!
                        </div>
                      )}
                    </button>

                    {/* Report Duplicate Option */}
                    <button
                      onClick={() => handleToggleDuplicate(report.id)}
                      className="flex items-center gap-1 sm:gap-1.5 font-bold text-red-500 hover:bg-red-50 hover:text-red-700 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-all cursor-pointer text-[9.5px] sm:text-[10px]"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Flag Duplicate</span>
                    </button>
                  </div>

                  {/* Card Collapsible Comments Panel */}
                  {isCommentingActive && (
                    <div className="bg-slate-50/50 rounded-xl p-4 flex flex-col gap-3.5 mt-2 border border-slate-50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Discussion Board</span>
                      
                      {/* Comments Thread list */}
                      <div className="space-y-3.5 max-h-60 overflow-y-auto">
                        {comments.map((comm) => (
                          <div key={comm.id} className="flex gap-2.5 items-start">
                            <img
                              src={comm.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg'}
                              className="h-7 w-7 rounded-full object-cover shrink-0 border border-slate-100"
                              alt="Commenter Avatar"
                            />
                            <div className="bg-white rounded-xl p-3 border border-slate-100 flex-1 text-xs">
                              <div className="flex items-center justify-between gap-2.5 mb-1">
                                <span className="font-bold text-slate-900">{comm.user?.name}</span>
                                <span className="text-[9px] text-slate-400">
                                  {new Date(comm.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed">{comm.comment}</p>
                            </div>
                          </div>
                        ))}

                        {comments.length === 0 && (
                          <div className="text-center py-6 text-xs text-slate-400 italic">
                            No community responses yet. Write the first response below!
                          </div>
                        )}
                      </div>

                      {/* Write comment box */}
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={commentText[report.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [report.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(report.id)}
                          placeholder="Write constructive advice..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleAddComment(report.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer"
                        >
                          Send
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>

          {/* RIGHT SIDEBAR PANEL: Trending and Active Verification metrics */}
          <div className="flex flex-col gap-6 h-fit">
            
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                <Sparkles className="h-4.5 w-4.5 text-blue-500 fill-blue-500/10" />
                <h3 className="font-bold text-slate-950 text-sm">Action Rewards</h3>
              </div>
              
              <ul className="space-y-3.5 text-xs">
                <li className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">1</div>
                  <p className="text-slate-500"><strong className="text-slate-900 font-semibold">Verify reports (+10 pts):</strong> Validate neighboring pins. Reports with 3+ verifications auto-upgrade to 'Community Verified'.</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">2</div>
                  <p className="text-slate-500"><strong className="text-slate-900 font-semibold">Write Comments (+20 pts):</strong> Converse about local traffic outlines, pipe repairs, or street maintenance schedules.</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] shrink-0">3</div>
                  <p className="text-slate-500"><strong className="text-slate-900 font-semibold">Spot Problems (+100 pts):</strong> Upload photos of active water line breaks, potholes, or structural damages.</p>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col gap-3.5">
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider font-mono">Real-Time Notice Board</span>
              <span className="font-extrabold text-sm tracking-wide">Help resolve "Haight Street streetlight dark zones"</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Volunteers are coordinating a walk-through inspection on Tuesday evening at 7:00 PM. Follow the Haight St report for live text coordinates and team routing.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
