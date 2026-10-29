// Firestore repository for the `articles` collection — the director's
// newspaper columns (one doc per article, so the list can grow daily without
// hitting the 1 MB single-document limit of `siteContent/*`).
// Public reads use an explicit `where('published', '==', true)` so the query
// is provably restricted for Firestore rules; sorting happens client-side to
// avoid needing a composite index.
import {
  collection, doc, getDoc, getDocs, setDoc, deleteDoc,
  onSnapshot, query, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COL = 'articles';

export const ARTICLE_FALLBACK_COVER = '/asstes/office-projects/17.jpg';

const byDateDesc = (a, b) => (b.date || '').localeCompare(a.date || '');
const mapDocs = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(byDateDesc);

/* Body is stored as plain text; blank lines separate paragraphs. */
export function toParagraphs(content = '') {
  return content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/* ── Admin: full collection access ── */

export function subscribeArticles(callback) {
  return onSnapshot(collection(db, COL), (snap) => callback(mapDocs(snap)), (err) => {
    console.error('subscribeArticles failed:', err);
  });
}

export async function saveArticle(article) {
  const { id, ...data } = article;
  const ref = id ? doc(db, COL, id) : doc(collection(db, COL));
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  return ref.id;
}

export async function deleteArticle(id) {
  await deleteDoc(doc(db, COL, id));
}

/* ── Public: rule-provable constrained queries ── */

const publishedQuery = () => query(collection(db, COL), where('published', '==', true));

export async function getPublishedArticles() {
  return mapDocs(await getDocs(publishedQuery()));
}

export function subscribePublishedArticles(callback) {
  return onSnapshot(publishedQuery(), (snap) => callback(mapDocs(snap)), (err) => {
    console.error('subscribePublishedArticles failed:', err);
    callback([]);
  });
}

export async function getArticleById(id) {
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/* First article — imported from the admin tab with one click. */
export const SEED_ARTICLE = {
  title: 'جدة.. وفاء لمن خدمها وثقة بمن يقود مستقبلها',
  author: 'م. مروان أحمد ناظر',
  date: '2026-10-22',
  source: 'صحيفة مكة',
  sourceUrl: 'https://www.makkahnews.sa/5525796.html',
  coverImage: 'https://www.makkahnews.sa/wp-content/uploads/2026/10/b41886bc-7d69-4fff-855a-9e3d3ad6c0da.jpeg',
  excerpt: 'قراءة في حفل تكريم معالي الأستاذ صالح التركي لمعالي الأستاذ إحسان بافقيه بمناسبة تعيينه أمينًا لمحافظة جدة، ورسالة الوفاء والتكامل بين القيادات.',
  content: [
    'من خلال حضوري حفل التكريم الذي أقامه معالي الأستاذ صالح بن علي التركي، أمين محافظة جدة السابق، احتفاءً بمعالي الأستاذ إحسان بن عباس بافقيه، بمناسبة تعيينه أمينًا لمحافظة جدة، استوقفتني المعاني الإنسانية والاجتماعية الجميلة التي حملتها هذه المبادرة، وما عكسته من قيم الوفاء والتقدير والرقي في التعامل، في مشهد يجسد أصالة مجتمعنا السعودي، ويؤكد أن خدمة الوطن مسؤولية تتواصل، وأن العلاقات الإنسانية تبقى أسمى من المناصب.',
    'لم يكن الحفل مجرد مناسبة اجتماعية، بل رسالة حضارية تعكس ثقافة الوفاء والتقدير المتبادل، وتجسد روح التكامل بين القيادات، فالمسؤولية أمانة تتعاقب عليها الكفاءات، وتبقى خدمة الوطن والمواطن هدفها الأسمى.',
    'ثمانية أعوام قضاها صالح التركي على رأس أمانة محافظة جدة، شهدت خلالها المدينة تحولات تنموية ومشروعات تطويرية واسعة، شملت تحسين البنية التحتية، وتطوير المشهد الحضري، والارتقاء بالخدمات البلدية والمرافق العامة، وتعزيز جودة الحياة، إلى جانب جهود معالجة التحديات العمرانية، في مدينة تتسع طموحاتها بقدر مكانتها الاقتصادية والسياحية والحضارية.',
    'ولعل ما يميز تجربة التركي اهتمامه بالبعد الإنساني والاجتماعي، وتعزيز الشراكات المجتمعية، انطلاقًا من أن نجاح العمل التنموي لا يقاس بالمشروعات وحدها، وإنما بأثرها الإيجابي في حياة الإنسان.',
    'واليوم، تواصل جدة مسيرتها التنموية مع أمينها الجديد إحسان بافقيه، وسط تطلعات كبيرة لمواصلة البناء على المنجزات، وتسريع وتيرة التطوير، وتعزيز مكانة المدينة، بما يواكب مستهدفات رؤية المملكة 2030.',
    'لقد خرجت من حفل التكريم بقناعة راسخة بأن المناصب مراحل في مسيرة العطاء، بينما تبقى المواقف الإنسانية النبيلة شاهدًا على أصالة أصحابها. وما أجمل أن يبادر مسؤول سابق للاحتفاء بمن يخلفه، في صورة تعكس سمو الأخلاق واستمرارية العمل المؤسسي.',
    'فشكرًا لصالح التركي على ما قدمه لجدة، وعلى مبادرته الكريمة، وخالص التهاني والتوفيق لإحسان بافقيه في مسؤولياته الجديدة، وستبقى جدة مدينة تستحق منا جميعًا الوفاء والعمل والطموح.',
  ].join('\n\n'),
  published: true,
};
