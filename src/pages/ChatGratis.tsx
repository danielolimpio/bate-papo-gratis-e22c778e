import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";
import { Smile, Image as ImageIcon, Mic, Users } from "lucide-react";

export default function ChatGratis() {
  const faq = [
    {
      q: "O chat gratis funciona no celular?",
      a: "Sim. Nosso chat online gratis funciona em qualquer dispositivo com navegador moderno: Android, iPhone, tablet, notebook ou desktop."
    },
    {
      q: "Tem chat gratis amizade de verdade?",
      a: "Sim. A sala geral é o melhor lugar para fazer amizades. O chat de bate papo gratuito incentiva conversas leves e respeitosas, com moderação ativa."
    },
    {
      q: "O chat bate papo gratis tem limite de mensagens?",
      a: "Não. Você pode mandar quantas mensagens quiser, no chat público ou privado, sem limite diário e sem cobrança."
    },
    {
      q: "Como funciona o chat sem cadastro aqui?",
      a: "O cadastro é express e gratuito, só para garantir a segurança. Veja a página Bate-Papo Sem Cadastro para entender por que escolhemos esse modelo."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Chat Grátis — Chat Online Gratuito de Bate-Papo 24 Horas</title>
        <meta name="description" content="Chat gratis online 24 horas. Chat de bate papo gratuito com pessoas do Brasil inteiro. Chat gratis amizade, paquera e relacionamento — tudo gratuito." />
        <link rel="canonical" href="https://bate-papo-gratis.lovable.app/chat-gratis" />
        <meta property="og:title" content="Chat Grátis — Chat Online Gratuito 24h" />
        <meta property="og:description" content="Chat bate papo gratuito com mensagens em tempo real, áudio e fotos." />
        <meta property="og:url" content="https://bate-papo-gratis.lovable.app/chat-gratis" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
        })}</script>
      </Helmet>

      <LegalLayout title="Chat Grátis Online">
        <p className="lead text-gray-600">
          Procurando por <strong>chat gratis</strong>, <strong>chat gratuito</strong> ou <strong>chat online gratis</strong>?
          Você está no lugar certo. O Bate-Papo Grátis oferece um <strong>chat de bate papo gratuito</strong>, brasileiro,
          ativo 24 horas e com recursos que só apps pagos costumam ter.
        </p>

        <h2><Users size={18} className="text-blue-600 shrink-0" /> Chat público + chat privado</h2>
        <p>
          Nosso <strong>chat bate papo gratis</strong> é dividido em duas experiências:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Sala geral</strong>: o <strong>chat online gratuito</strong> aberto a todos, ideal para puxar papo, ouvir áudios e conhecer rosto novo.</li>
          <li><strong>Conversas privadas</strong>: <strong>chat bate papo gratuito</strong> 1-a-1, com troca de imagens, links e reações.</li>
        </ul>

        <h2>Recursos do nosso chat de bate papo gratuito</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 not-prose">
          {[
            { icon: Smile, title: "Emojis e reações", desc: "Reaja com 1 clique." },
            { icon: Mic, title: "Áudios na sala", desc: "Mande sua voz no chat público." },
            { icon: ImageIcon, title: "Fotos no privado", desc: "Compartilhe imagens com segurança." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl p-4 border border-blue-100 bg-blue-50 text-center">
              <Icon size={20} className="text-blue-600 mx-auto mb-2" />
              <p className="font-semibold text-sm text-gray-900 mb-0.5">{title}</p>
              <p className="text-xs text-gray-600">{desc}</p>
            </div>
          ))}
        </div>

        <h2>Chat gratis amizade — sem complicação</h2>
        <p>
          Muita gente chega aqui pesquisando por <strong>chat gratis amizade</strong> ou <strong>chat gratis de bate papo</strong>.
          A boa notícia é que nossa comunidade é exatamente isso: pessoas reais querendo trocar ideia, rir, desabafar e
          construir amizades — sem pressão, sem custo e sem cadastro complicado.
        </p>

        <div className="mt-8 not-prose">
          <Link
            to="/saladebatepapo"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Entrar no Chat Agora
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
          <li><Link to="/bate-papo-webcam" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Bate-Papo com Webcam</Link></li>
          <li><Link to="/bate-papo-amizade-namoro" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Bate-Papo para Amizade e Namoro</Link></li>
        </ul>
      </LegalLayout>
    </>
  );
}
