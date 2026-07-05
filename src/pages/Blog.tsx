import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";
import { Calendar, Clock, ArrowRight, BookOpen, Sparkles, MessageCircle, Heart, Shield, Users, Camera, type LucideIcon } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  icon: LucideIcon;
  accent: string;
  to: string;
}

const posts: Post[] = [
  {
    slug: "como-fazer-amizade-online",
    title: "Como fazer amizade online de verdade em 2026",
    excerpt: "Um guia honesto sobre construir conexões reais no bate-papo brasileiro: como puxar assunto, manter conversas vivas e transformar contatos em amizades duradouras.",
    date: "1 Jul 2026",
    readTime: "6 min",
    category: "Amizade",
    icon: Users,
    accent: "from-blue-500 to-indigo-600",
    to: "/bate-papo-amizade-namoro",
  },
  {
    slug: "paquera-online-segura",
    title: "Paquera online segura: o que funciona e o que evitar",
    excerpt: "Dicas práticas de flerte respeitoso, red flags para identificar rápido e como o sistema de matchs ajuda quem procura relacionamento sério pela internet.",
    date: "24 Jun 2026",
    readTime: "8 min",
    category: "Namoro",
    icon: Heart,
    accent: "from-pink-500 to-rose-600",
    to: "/namoro-seguro",
  },
  {
    slug: "chat-sem-cadastro-vs-com-cadastro",
    title: "Chat sem cadastro vs. chat com cadastro express: qual escolher?",
    excerpt: "Comparamos os dois modelos ponto a ponto — privacidade, segurança, moderação e experiência — para você entender por que o cadastro mínimo virou padrão.",
    date: "18 Jun 2026",
    readTime: "5 min",
    category: "Guia",
    icon: Shield,
    accent: "from-emerald-500 to-teal-600",
    to: "/bate-papo-sem-cadastro",
  },
  {
    slug: "salas-de-bate-papo-brasileiras",
    title: "A história das salas de bate-papo brasileiras",
    excerpt: "Do IRC ao UOL, do MSN ao chat moderno em navegador: a jornada da comunicação online no Brasil e por que salas de bate-papo continuam relevantes.",
    date: "12 Jun 2026",
    readTime: "10 min",
    category: "Cultura",
    icon: MessageCircle,
    accent: "from-amber-500 to-orange-600",
    to: "/sala-de-bate-papo",
  },
  {
    slug: "bate-papo-com-webcam-alternativa-segura",
    title: "Bate-papo com webcam: alternativa moderna e segura",
    excerpt: "Por que abrir a câmera para desconhecidos não é a melhor ideia — e como perfis visuais ricos, álbum de fotos e vídeo de perfil resolvem o mesmo desejo com mais segurança.",
    date: "5 Jun 2026",
    readTime: "7 min",
    category: "Segurança",
    icon: Camera,
    accent: "from-violet-500 to-purple-600",
    to: "/bate-papo-webcam",
  },
  {
    slug: "conversas-que-viram-relacionamento",
    title: "Conversas que viram relacionamento: casos reais",
    excerpt: "Histórias inspiradoras de casais que se conheceram em bate-papos online e transformaram uma simples mensagem em uma relação séria e duradoura.",
    date: "28 Mai 2026",
    readTime: "9 min",
    category: "Histórias",
    icon: Sparkles,
    accent: "from-fuchsia-500 to-pink-600",
    to: "/bate-papo-amizade-namoro",
  },
];

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog do Bate-Papo Grátis — Amizade, Paquera e Conversas Online</title>
        <meta name="description" content="Blog do Bate-Papo Grátis: guias sobre amizade online, paquera segura, salas de bate-papo brasileiras, namoro online e comunidade. Conteúdo editorial premium." />
        <link rel="canonical" href="https://batepapogratis.com/blog" />
        <meta property="og:title" content="Blog do Bate-Papo Grátis" />
        <meta property="og:description" content="Guias, histórias e dicas sobre bate-papo online, amizade, paquera e namoro no Brasil." />
        <meta property="og:url" content="https://batepapogratis.com/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      <LegalLayout title="Blog">
        <p className="lead text-gray-600">
          Bem-vindo ao <strong>Blog do Bate-Papo Grátis</strong> — um espaço editorial com guias, histórias e reflexões
          sobre como brasileiros usam o <strong>bate-papo online</strong> para construir amizades reais, paquerar com
          respeito e, quem sabe, encontrar um relacionamento sério. Aqui a conversa é honesta e o conteúdo é premium.
        </p>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {posts.map((post) => {
            const Icon = post.icon;
            return (
              <Link
                key={post.slug}
                to={post.to}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300"
              >
                <div className={`h-32 bg-gradient-to-br ${post.accent} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                      <Icon size={12} />
                      {post.category}
                    </span>
                    <Icon size={40} className="text-white/40" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-3">
                    <span className="inline-flex items-center gap-1"><Calendar size={12} />{post.date}</span>
                    <span className="text-gray-300">•</span>
                    <span className="inline-flex items-center gap-1"><Clock size={12} />{post.readTime} de leitura</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {post.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-gray-600 mb-4">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                    Ler artigo <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <h2 className="mt-16"><BookOpen size={22} className="text-blue-600 shrink-0" /> Sobre o Blog</h2>
        <p>
          Nosso blog nasce da observação diária da comunidade: quais dúvidas aparecem no chat, quais histórias emocionam,
          quais golpes precisam ser denunciados. Cada texto é escrito para <strong>quem realmente usa</strong> o
          bate-papo — não para agradar algoritmo. É conteúdo humano, revisado, e conectado às páginas práticas do site.
        </p>

        <h2 className="mt-12">Perguntas Frequentes sobre o Blog</h2>
        <div className="space-y-3 not-prose mt-4">
          {[
            { q: "Com que frequência o blog é atualizado?", a: "Publicamos novos artigos aproximadamente a cada duas semanas. Você pode acompanhar direto por aqui — não usamos newsletter invasiva nem cobramos nada para acessar o conteúdo." },
            { q: "Quem escreve os textos?", a: "A equipe editorial do Bate-Papo Grátis, com apoio de moderadores da comunidade que compartilham observações reais do dia a dia da sala." },
            { q: "Posso sugerir um tema?", a: "Pode. Sugestões da comunidade são bem-vindas — muitos artigos nascem de perguntas recorrentes de usuários da sala de bate-papo." },
            { q: "O conteúdo do blog é gratuito?", a: "Totalmente. Assim como o chat, o blog é 100% gratuito, sem paywall, sem propaganda invasiva e sem cadastro para ler." },
          ].map((f, i) => (
            <details key={i} className="group rounded-2xl border-2 border-gray-100 bg-white p-5 open:bg-blue-50/40 open:border-blue-200 transition-colors">
              <summary className="cursor-pointer font-semibold text-[16px] text-gray-900 list-none flex items-center justify-between">
                {f.q}
                <span className="text-blue-600 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 not-prose">
          <Link
            to="/saladebatepapo"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Entrar no Bate-Papo Agora
          </Link>
        </div>
      </LegalLayout>
    </>
  );
}
