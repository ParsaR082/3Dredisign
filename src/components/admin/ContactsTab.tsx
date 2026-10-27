'use client';

import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  Clock,
  Copy,
  Check,
  Eye,
  X,
} from 'lucide-react';

interface ContactsTabProps {
  contacts: any[];
  onRefresh: () => void;
  onMarkSeen: (id: number, current: boolean) => void;
  onDelete: (id: number) => void;
}

export default function ContactsTab({ contacts, onRefresh, onMarkSeen, onDelete }: ContactsTabProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const filtered = contacts.filter((c) => {
    if (filter === 'unread' && c.is_seen) return false;
    if (filter === 'read' && !c.is_seen) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = c.full_name?.toLowerCase().includes(term);
      const matchPhone = c.phone?.toLowerCase().includes(term);
      const matchMsg = c.message?.toLowerCase().includes(term);
      return matchName || matchPhone || matchMsg;
    }
    return true;
  });

  const handleCopyPhone = (id: number, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-brand-400" />
            <span>پیام‌های تماس و درخواست‌های مشاوره</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            پیام‌های ثبت‌شده از فرم ایستگاه مشاوره حضوری در پردیس ۳بعدی ({contacts.length} پیام کل)
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-dark-base p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'all' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            همه ({contacts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'unread' ? 'bg-rose-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            خوانده‌نشده ({contacts.filter((c) => !c.is_seen).length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'read' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            بررسی‌شده ({contacts.filter((c) => c.is_seen).length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جستجو بر اساس نام، شماره تلفن یا متن پیام..."
          className="w-full pr-11 pl-4 py-3 rounded-2xl bg-dark-surface border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 transition-colors"
        />
      </div>

      {/* Messages List */}
      <div className="glass-panel-elevated rounded-3xl border border-white/10 divide-y divide-white/5 overflow-hidden">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 sm:p-6 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                item.is_seen ? 'hover:bg-white/[0.02]' : 'bg-brand-600/5 hover:bg-brand-600/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                    item.is_seen ? 'bg-gray-600' : 'bg-rose-500 ring-4 ring-rose-500/20 animate-pulse'
                  }`}
                />
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-sm sm:text-base text-white">{item.full_name}</span>
                    <span className="text-xs text-brand-300 font-mono dir-ltr bg-brand-500/10 px-2.5 py-0.5 rounded-lg border border-brand-500/20">
                      {item.phone}
                    </span>
                    {item.email && (
                      <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {item.email}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 max-w-2xl leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => setSelectedMessage(item)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="مشاهده متن کامل"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-400" />
                  <span>مشاهده</span>
                </button>

                <button
                  onClick={() => handleCopyPhone(item.id, item.phone)}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="کپی شماره"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-400" />
                      <span>کپی شماره</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${item.phone}`}
                  className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition-colors"
                  title="تماس مستقیم"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <button
                  onClick={() => onMarkSeen(item.id, item.is_seen)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    item.is_seen
                      ? 'bg-white/5 hover:bg-white/10 text-gray-400'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{item.is_seen ? 'دیده‌شده' : 'تأیید بررسی'}</span>
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                  title="حذف پیام"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-gray-400 text-xs space-y-2">
            <Inbox className="w-12 h-12 text-gray-600 mx-auto" />
            <p>هیچ پیامی با فیلتر انتخابی شما یافت نشد.</p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="w-full max-w-xl bg-dark-base border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white">{selectedMessage.full_name}</h3>
                <span className="text-xs text-brand-300 font-mono dir-ltr">{selectedMessage.phone}</span>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs text-gray-400 font-semibold block">متن کامل پیام / درخواست:</span>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={`tel:${selectedMessage.phone}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>تماس با مشتری</span>
              </a>

              <button
                onClick={() => {
                  onMarkSeen(selectedMessage.id, selectedMessage.is_seen);
                  setSelectedMessage({ ...selectedMessage, is_seen: !selectedMessage.is_seen });
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
              >
                {selectedMessage.is_seen ? 'تغییر به خوانده‌نشده' : 'تغییر به خوانده‌شده'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
