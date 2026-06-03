import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";
import { Heart, Sparkles, Users, MessageCircle } from "lucide-react";

export default function BatePapoAmizadeNamoro() {
  const faq = [
    {
      q: "É um bate papo de namoro sério ou só paquera?",
      a: "Os dois. Temos quem busca amizade, quem busca paquera e quem está procurando relacionamento sério. O sistema de matchs ajuda você a sinalizar interesse."
    },
    {
      q: "O bate papo namoro gratis funciona como um site de relacionamento?",
      a: "Funciona melhor: você vê a pessoa conversando ao vivo na sala antes de qualquer 'match', em vez de só deslizar fotos. É um site de relacionamento gratuito com cara de comunidade."
    },
    {
      q: "Posso fazer só amizade aqui?",
      a: "Claro. A maioria dos usuários começa exatamente assim. O bate papo para amizade é o coração da sala geral."
    },
    {
      q: "O que é o efeito 'Apaixonados'?",
      a: "Quando você dá match em alguém que também deu match em você, a conversa ganha um destaque especial 'Apaixonados', com efeito visual exclusivo na lista de conversas."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Bate-Papo para Amizade e Namoro — Conheça Pessoas Grátis</title>
        <meta name="description" content="Bate papo para amizade e namoro gratis. Chat para amizade, paquera e relacionamento, com sistema de matchs. Site de relacionamento gratuito e seguro." />
        <link rel="canonical" href="https://batepapogratis.com/bate-papo-amizade-namoro" />
        <meta property="og:title" content="Bate-Papo para Amizade e Namoro" />
        <meta property="og:description" content="Conheça pessoas reais no bate papo de namoro e amizade — comunidade brasileira e gratuita." />
        <meta property="og:url" content="https://batepapogratis.com/bate-papo-amizade-namoro" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
        })}</script>
      </Helmet>

      <LegalLayout title="Bate-Papo para Amizade e Namoro">
        <p className="lead text-gray-600">
          O <strong>bate papo para amizade</strong> e o <strong>bate papo de namoro</strong> sempre foram a essência da internet brasileira.
          O Bate-Papo Grátis moderniza essa tradição: comunidade ativa, sistema de matchs, perfis com foto e álbum, e
          um efeito especial "Apaixonados" quando o interesse é recíproco. Tudo isso em um <strong>site de relacionamento gratuito</strong>.
        </p>

        <h2><Heart size={18} className="text-blue-600 shrink-0" /> Amizade, paquera ou relacionamento — você escolhe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 not-prose">
          {[
            { icon: Users, title: "Amizade", desc: "Chat para amizade leve na sala geral." },
            { icon: Sparkles, title: "Paquera", desc: "Bate papo paquera gratis com gente da sua região." },
            { icon: Heart, title: "Relacionamento", desc: "Bate papo de relacionamento sério, com matchs." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl p-4 border border-pink-100 bg-pink-50 text-center">
              <Icon size={20} className="text-pink-600 mx-auto mb-2" />
              <p className="font-semibold text-sm text-gray-900 mb-0.5">{title}</p>
              <p className="text-xs text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        <h2><MessageCircle size={18} className="text-blue-600 shrink-0" /> Bate papo namoro gratis com sistema de matchs</h2>
        <p>
          Cada perfil tem um botão de match. Se a pessoa que recebeu o seu match também der match em você, vocês entram
          no modo <strong>Apaixonados</strong>: um efeito visual exclusivo aparece na conversa do lado esquerdo, marcando
          que rolou conexão de verdade. É um diferencial que nenhum outro <strong>bate papo namoro gratis</strong> oferece.
        </p>

        <h2>Conversa online para amizade — sem pressão</h2>
        <p>
          Diferente de apps tradicionais de dating, nossa <strong>conversa online para amizade</strong> acontece em comunidade.
          Você puxa papo na sala geral, ouve áudios, vê reações em tempo real — e só vai para o privado quando faz sentido.
          É a vibe de uma <strong>comunidade online gratuita</strong> brasileira, não um catálogo de fotos.
        </p>

        <div className="mt-8 not-prose">
          <Link
            to="/saladebatepapo"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Conhecer Pessoas Agora
          </Link>
        </div>

        <h2 className="mt-12">Perguntas Frequentes</h2>
        <div className="space-y-3 not-prose mt-4">
          {faq.map((f, i) => (
            <details key={i} className="group rounded-xl border border-gray-200 bg-white p-4 open:bg-blue-50/40 open:border-blue-200">
              <summary className="cursor-pointer font-semibold text-sm text-gray-900 list-none flex items-center justify-between">
                {f.q}
                <span className="text-blue-600 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <h2 className="mt-12">Veja também</h2>
        <ul className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
          <li><Link to="/bate-papo-sem-cadastro" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Bate-Papo Sem Cadastro</Link></li>
          <li><Link to="/sala-de-bate-papo" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Sala de Bate-Papo</Link></li>
          <li><Link to="/chat-gratis" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Chat Grátis Online</Link></li>
          <li><Link to="/bate-papo-webcam" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Bate-Papo com Webcam</Link></li>
        </ul>
      </LegalLayout>
    </>
  );
}
