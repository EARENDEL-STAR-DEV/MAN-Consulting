'use client';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, PenLine, Eye, EyeOff, ExternalLink, Loader2, Download } from 'lucide-react';
import { subscribeArticles, saveArticle, deleteArticle, SEED_ARTICLE } from '@/lib/articlesRepo';
import { Field, TextArea, ImageUpload, Grid2, TabLoading } from './Shared';
import { useConfirm } from '@/context/ConfirmContext';

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY_ARTICLE = () => ({
  title: '',
  author: 'م. مروان أحمد ناظر',
  date: today(),
  source: 'صحيفة مكة',
  sourceUrl: '',
  coverImage: '',
  excerpt: '',
  content: '',
  published: true,
});

/* Each article is its own Firestore doc, so changes are saved per-article
   immediately (no global "save all" button like the siteContent tabs). */
export default function ArticlesTab() {
  const { confirm, alert } = useConfirm();
  const [articles, setArticles] = useState(null);
  const [draft, setDraft]       = useState(null);
  const [saving, setSaving]     = useState(false);

  useEffect(() => subscribeArticles(setArticles), []);

  const close = () => setDraft(null);
  const setF  = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  const run = async (fn) => {
    setSaving(true);
    try { await fn(); return true; }
    catch (err) { await alert('تعذّر الحفظ: ' + (err?.message || ''), { variant: 'danger' }); return false; }
    finally { setSaving(false); }
  };

  const submit = async () => {
    if (!draft.title.trim() || !draft.content.trim()) {
      await alert('عنوان المقال ونصه مطلوبان.', { variant: 'danger' });
      return;
    }
    if (await run(() => saveArticle(draft))) close();
  };

  const toggle = (a) => run(() => saveArticle({ id: a.id, published: !a.published }));
  const remove = async (a) => {
    if (await confirm(`حذف المقال "${a.title}" نهائياً؟`, { variant: 'danger' })) run(() => deleteArticle(a.id));
  };

  if (articles === null) return <TabLoading />;

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/40">{articles.length} مقال · {articles.filter(a => a.published).length} منشور</p>
        <button onClick={() => setDraft(EMPTY_ARTICLE())}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: 'rgba(201,163,77,0.10)', border: '1px solid rgba(201,163,77,0.30)', color: '#F2B233' }}>
          <Plus size={13} /> مقال جديد
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl py-16 text-center space-y-4" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
          <PenLine size={28} className="text-white/10 mx-auto" />
          <p className="text-white/20 text-sm">لا توجد مقالات بعد</p>
          <button onClick={() => run(() => saveArticle(SEED_ARTICLE))} disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            style={{ background: 'rgba(201,163,77,0.08)', border: '1px solid rgba(201,163,77,0.25)', color: '#F2B233' }}>
            {saving ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            استيراد مقال صحيفة مكة (جدة.. وفاء لمن خدمها)
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {articles.map(a => (
            <div key={a.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${!a.published ? 'opacity-40' : ''}`}
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {a.coverImage
                ? <img src={a.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                : <PenLine size={13} className="text-[#F2B233]/50 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{a.title || '—'}</p>
                <p className="text-xs text-white/30">{a.date} · {a.source || '—'}</p>
              </div>
              {a.published && (
                <a href={`/articles/${a.id}`} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-white/30 hover:text-[#F2B233] hover:bg-white/5 transition-all">
                  <ExternalLink size={13} />
                </a>
              )}
              <button onClick={() => toggle(a)} title={a.published ? 'إخفاء' : 'نشر'}
                className={`p-1.5 rounded-lg transition-all ${a.published ? 'text-green-400/60 hover:text-green-400' : 'text-white/20 hover:text-white/50'}`}>
                {a.published ? <Eye size={13} /> : <EyeOff size={13} />}
              </button>
              <button onClick={() => setDraft({ ...EMPTY_ARTICLE(), ...a })} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all">
                <Pencil size={13} />
              </button>
              <button onClick={() => remove(a)} className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/8 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {draft && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }} onClick={close}>
          <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
            style={{ background: '#0a0e17', border: '1px solid rgba(201,163,77,0.2)', boxShadow: '0 24px 80px rgba(0,0,0,0.9)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{draft.id ? 'تعديل المقال' : 'مقال جديد'}</h3>
              <button onClick={close} className="text-white/30 hover:text-white"><X size={15} /></button>
            </div>
            <Field label="عنوان المقال" value={draft.title} onChange={v => setF('title', v)} />
            <Grid2>
              <Field label="الكاتب" value={draft.author} onChange={v => setF('author', v)} />
              <Field label="تاريخ النشر" type="date" value={draft.date} onChange={v => setF('date', v)} />
            </Grid2>
            <Grid2>
              <Field label="الصحيفة / المصدر" value={draft.source} onChange={v => setF('source', v)} placeholder="صحيفة مكة" />
              <Field label="رابط المقال الأصلي" value={draft.sourceUrl} onChange={v => setF('sourceUrl', v)} placeholder="https://..." />
            </Grid2>
            <ImageUpload label="صورة المقال" value={draft.coverImage} onChange={v => setF('coverImage', v)} />
            <TextArea label="مقتطف قصير (يظهر في بطاقة المقال)" value={draft.excerpt} onChange={v => setF('excerpt', v)} rows={2} />
            <TextArea label="نص المقال — افصل بين الفقرات بسطر فارغ" value={draft.content} onChange={v => setF('content', v)} rows={12} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={draft.published} onChange={e => setF('published', e.target.checked)}
                className="w-4 h-4 rounded" />
              <span className="text-sm text-white/60">منشور ويظهر للزوار</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={submit} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
                style={{ background: 'rgba(201,163,77,0.12)', border: '1px solid rgba(201,163,77,0.35)', color: '#F2B233' }}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'جارٍ الحفظ...' : 'حفظ المقال'}
              </button>
              <button onClick={close} className="px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
