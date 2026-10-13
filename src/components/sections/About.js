"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Calendar, Award } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteContent } from "@/hooks/useSiteContent";

/* ── Animated stat number — counts up once when scrolled into view ── */
const StatNumber = ({ value, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (node) observer.observe(node);
    return () => { if (node) observer.unobserve(node); };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const duration = 2000;
    let frameId;
    let start;
    const tick = (t) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(value * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
      else setCount(value);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [hasAnimated, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
};

const About = () => {
  const { lang, t } = useLanguage();
  const isRTL = lang === 'ar' || lang === 'ur';
  const { data: aboutCms } = useSiteContent('about');

  const directorImage = aboutCms?.director_image || '/asstes/Company-manager-lader.jpg';
  const directorName = aboutCms?.director_name || t('about.directorName');
  const directorTitle = isRTL
    ? (aboutCms?.director_pos_ar || t('about.directorTitle'))
    : (aboutCms?.director_pos_en || t('about.directorTitle'));

  const ceoImage = aboutCms?.ceo_image || '/asstes/ceo-man-2026.jpeg';
  const ceoName = aboutCms?.ceo_name || t('about.ceoName');
  const ceoTitle = (isRTL ? aboutCms?.ceo_pos_ar : aboutCms?.ceo_pos_en) || t('about.ceoTitle');

  const eyebrowText = {
    ar: "قيادة وخبرة", en: "Leadership & Expertise", zh: "领导力与专长",
    es: "Liderazgo y experiencia", fr: "Leadership et expertise",
    de: "Führung & Expertise", tr: "Liderlik & Uzmanlık", ur: "قیادت اور مہارت",
    hi: "नेतृत्व और विशेषज्ञता", ru: "Лидерство и опыт"
  }[lang] || "Leadership & Expertise";

  const titlePre = {
    ar: "القيادة التي", en: "The Leadership That", zh: "建立信任的",
    es: "El liderazgo que", fr: "Le leadership qui",
    de: "Die Führung, die", tr: "Güven İnşa Eden", ur: "وہ قیادت جو",
    hi: "विश्वास बनाने वाला", ru: "Лидерство, создающее"
  }[lang] || "The Leadership That";
  const titleGold = {
    ar: "تبني الثقة", en: "Builds Trust", zh: "领导力",
    es: "construye confianza", fr: "construit la confiance",
    de: "Vertrauen aufbaut", tr: "Liderlik", ur: "اعتماد بناتی ہے",
    hi: "नेतृत्व", ru: "доверие"
  }[lang] || "Builds Trust";

  const descText = {
    ar: "نؤمن بأن الهندسة رسالة قبل أن تكون مهنة، وخلف كل مشروع ناجح قيادة راسخة منذ عام 1986 — بخبرة تمتد لأربعة عقود تحوّل الرؤية إلى واقع وتصنع الفارق في كل تفصيلة.",
    en: "We believe engineering is a calling before a profession — behind every successful project stands leadership rooted since 1986, with four decades of experience turning vision into reality.",
    zh: "我们相信工程是一种使命——自1986年以来，每个成功项目背后都有深厚的领导力，四十年经验将愿景变为现实。",
    fr: "Nous croyons que l'ingénierie est une vocation — derrière chaque projet réussi se trouve un leadership ancré depuis 1986, fort de quatre décennies d'expérience.",
    es: "Creemos que la ingeniería es una vocación — detrás de cada proyecto exitoso hay un liderazgo consolidado desde 1986, con cuatro décadas de experiencia.",
    de: "Wir glauben, dass Ingenieurwesen eine Berufung ist — hinter jedem erfolgreichen Projekt steht eine seit 1986 verwurzelte Führung mit vier Jahrzehnten Erfahrung.",
    tr: "Mühendisliğin bir meslek olmadan önce bir misyon olduğuna inanıyoruz — her başarılı projenin arkasında 1986'dan bu yana köklü, kırk yıllık deneyime sahip bir liderlik vardır.",
    ur: "ہمارا ماننا ہے کہ انجینئرنگ ایک پیشے سے پہلے ایک مشن ہے — ہر کامیاب منصوبے کے پیچھے 1986 سے قائم قیادت ہے جو چار دہائیوں کے تجربے کے ساتھ وژن کو حقیقت میں بدلتی ہے۔",
    hi: "हम मानते हैं कि इंजीनियरिंग एक पेशे से पहले एक मिशन है — हर सफल परियोजना के पीछे 1986 से स्थापित नेतृत्व है, जिसके पास चार दशकों का अनुभव है।",
    ru: "Мы верим, что инженерия — это призвание. За каждым успешным проектом стоит руководство, заложенное с 1986 года, с сорокалетним опытом."
  }[lang] || "We believe engineering is a calling before a profession — behind every successful project stands leadership rooted since 1986, with four decades of experience.";

  const stats = [
    {
      icon: Calendar, value: 1986, prefix: "", suffix: "",
      label: { ar: "تأسست عام", en: "Since", zh: "始于", es: "Desde", fr: "Depuis", de: "Seit", tr: "Kuruluş", ur: "قیام", hi: "स्थापना", ru: "С" }[lang] || "Since"
    },
    {
      icon: Award, value: 40, prefix: "+", suffix: "",
      label: { ar: "عام خبرة", en: "Years Experience", zh: "年经验", es: "Años de experiencia", fr: "Ans d'expérience", de: "Jahre Erfahrung", tr: "Yıl Deneyim", ur: "سال تجربہ", hi: "वर्षों का अनुभव", ru: "Лет опыта" }[lang] || "Years Experience"
    },
  ];

  // Both frames use one slightly-shorter portrait ratio. `landscapeCrop`
  // applies only when the photo is wider than tall: it zooms the chairman's
  // office shot (seated at ~54% across) to head-and-chest at 1.6x.
  const people = [
    { key: 'director', image: directorImage, name: directorName, title: directorTitle, pos: 'center top',
      landscapeCrop: { objectPosition: '58% center', transform: 'scale(1.6)', transformOrigin: '50% 66%' } },
    { key: 'ceo', image: ceoImage, name: ceoName, title: ceoTitle, pos: 'center top' },
  ];
  // Natural aspect (w/h) of each loaded portrait
  const [ratios, setRatios] = useState({});

  return (
    <section id="about" className="relative py-20 md:py-28 overflow-hidden bg-[var(--background)]" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Layered premium background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* base layered gradient */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,168,67,0.06) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(212,168,67,0.04) 0%, transparent 60%), linear-gradient(180deg, #3B3E46 0%, #202227 50%, #1A1B1F 100%)' }} />

      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-16 items-center">

          {/* ── Content column (faces the portraits) ── */}
          <div className="lg:col-span-6 text-start" data-aos="fade-up">

            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-[#D4A843]" />
              <span className="text-[#D4A843] font-bold tracking-[0.25em] uppercase text-[11px]">
                {eyebrowText}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black leading-[1.2] mb-5">
              <span className="text-white">{titlePre} </span>
              <span style={{ color: '#D4A843' }}>{titleGold}</span>
            </h2>

            <div className="h-1 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #D4A843, #E8C66A)' }} />

            <p className="mt-6 text-white/60 text-base md:text-lg leading-loose max-w-xl">
              {descText}
            </p>

            {/* Key figures — founded year + years of experience */}
            <div className="mt-10 grid grid-cols-2 max-w-md border-y border-[rgba(212,168,67,0.18)]">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 py-5 ${i % 2 === 0 ? 'pe-5 border-e border-[rgba(212,168,67,0.18)]' : 'ps-5'} ${i >= 2 ? 'border-t border-[rgba(212,168,67,0.18)]' : ''}`}
                  >
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.3)' }}>
                      <Icon size={17} style={{ color: '#D4A843' }} />
                    </span>
                    <div className="min-w-0">
                      <div className="text-2xl md:text-3xl font-black leading-none" style={{ color: '#D4A843' }}>
                        <StatNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                      </div>
                      <div className="mt-1.5 text-white/55 text-xs md:text-sm font-semibold">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Portraits column: two equal portrait cards, stacked, each with
               a small name plate in a bottom corner and a gold corner frame ── */}
          <div className="lg:col-span-6 flex flex-col items-center gap-14 md:gap-16">
            {people.map((person, i) => {
              const plateOnLeft = (i === 0) === isRTL;
              const crop = person.landscapeCrop && ratios[person.key] > 1 ? person.landscapeCrop : null;
              return (
                <article
                  key={person.key}
                  className="relative w-[220px] sm:w-[240px]"
                  data-aos="fade-up"
                  data-aos-delay={150 + i * 150}
                >
                  <div className="relative z-10 group">
                    <div className="relative rounded-2xl overflow-hidden border-4 border-[#44474F] bg-[#2A2C32] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.7)] aspect-[1019/1450]">
                      <div className="absolute inset-0" style={crop ? { transform: crop.transform, transformOrigin: crop.transformOrigin } : undefined}>
                        <Image
                          src={person.image}
                          alt={person.name}
                          fill
                          sizes="(max-width: 640px) 440px, 480px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          style={{ objectPosition: crop ? crop.objectPosition : person.pos }}
                          unoptimized={person.image.startsWith('http')}
                          onLoad={(e) => {
                            const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                            if (w && h) setRatios((r) => (r[person.key] === w / h ? r : { ...r, [person.key]: w / h }));
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Gold corner frame (opposite the plate) */}
                    <div className={`absolute -top-4 w-16 h-16 md:w-20 md:h-20 border-t-4 border-[#D4A843] -z-10 ${plateOnLeft ? '-right-4 border-r-4 rounded-tr-3xl' : '-left-4 border-l-4 rounded-tl-3xl'}`} />
                  </div>

                  {/* Name plate — small, in the bottom corner */}
                  <div
                    className={`absolute -bottom-6 ${plateOnLeft ? '-left-6' : '-right-6'} z-20 max-w-[85%] px-4 py-3 rounded-xl text-start shadow-[0_14px_32px_-12px_rgba(0,0,0,0.6)]`}
                    style={{ background: '#2A2C32', border: '1px solid rgba(212,168,67,0.3)' }}
                    data-aos="fade-up"
                    data-aos-delay={400 + i * 150}
                  >
                    <h4 className="font-bold text-sm md:text-base leading-snug mb-0.5" style={{ color: '#D4A843' }}>{person.name}</h4>
                    <p className="text-white/70 text-[9px] md:text-[10px] uppercase tracking-wider font-bold leading-relaxed">{person.title}</p>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
