import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";
import { Camera, Image as ImageIcon, Mic, ShieldCheck } from "lucide-react";

export default function BatePapoWebcam() {
  const faq = [
    {
      q: "O bate papo com webcam é gratis?",
      a: "Sim. Todos os recursos visuais (foto de perfil, fotos no privado, álbum) e de áudio são totalmente gratuitos. Bate papo com webcam gratuito de verdade."
    },
    {
      q: "Como funciona o bate papo webcam aqui?",
      a: "Cada usuário monta um perfil visual: foto principal, álbum de fotos e bio. Você visualiza o perfil completo da pessoa antes e durante o chat, simulando a riqueza visual de um bate papo web cam tradicional, mas com mais segurança."
    },
    {
      q: "Posso trocar fotos no chat com webcam?",
      a: "Sim. No chat privado você pode enviar fotos diretamente para a pessoa, junto com mensagens, links e reações."
    },
    {
      q: "É seguro usar chat com webcam sem cadastro?",
      a: "Por isso mantemos um cadastro express obrigatório: garante que perfis sejam moderáveis. Veja nossas dicas na página Namoro Seguro antes de qualquer chamada externa."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Bate-Papo com Webcam Grátis — Chat com Foto e Áudio Online</title>
        <meta name="description" content="Bate papo com webcam grátis: perfis com fotos, álbum, áudio na sala e fotos no privado. Chat com webcam gratuito, brasileiro e ao vivo." />
        <link rel="canonical" href="https://bate-papo-gratis.lovable.app/bate-papo-webcam" />
        <meta property="og:title" content="Bate-Papo com Webcam Grátis" />
        <meta property="og:description" content="Chat com fotos, áudio e perfis visuais ricos — bate papo webcam gratis." />
        <meta property="og:url" content="https://bate-papo-gratis.lovable.app/bate-papo-webcam" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
        })}</script>
      </Helmet>

      <LegalLayout title="Bate-Papo com Webcam Grátis">
        <p className="lead text-gray-600">
          Quem busca <strong>bate papo com webcam gratis</strong> normalmente quer o mesmo: <em>ver</em> com quem está
          falando. No Bate-Papo Grátis, levamos essa proposta a sério com perfis ricos em imagens, álbuns de fotos,
          áudios na sala e troca de fotos no privado — uma alternativa moderna ao <strong>bate papo webcam gratis</strong> tradicional.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 not-prose">
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong>Importante:</strong> nosso foco é segurança. Em vez de transmissões de vídeo abertas — que costumam
            atrair conteúdo impróprio e expor menores — oferecemos perfis verificáveis, fotos moderadas e áudios.
            Conexões diretas por câmera ao vivo podem ser combinadas com a pessoa em apps próprios para isso.
          </p>
        </div>

        <h2><Camera size={18} className="text-blue-600 shrink-0" /> Recursos visuais do nosso chat com webcam</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 not-prose">
          {[
            { icon: Camera, title: "Perfil com foto", desc: "Toda pessoa tem uma foto principal — você sabe com quem fala." },
            { icon: ImageIcon, title: "Álbum de fotos", desc: "Galeria visual no perfil, como um chat com webcam de graça mais seguro." },
            { icon: Mic, title: "Áudios na sala", desc: "Ouça a voz da pessoa — o que mais se aproxima do bate papo com camera ao vivo." },
            { icon: ShieldCheck, title: "Moderação ativa", desc: "Fotos e perfis são monitorados — chat com webcam sem cadastro vulnerável, não." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl p-4 border border-blue-100 bg-blue-50 flex items-start gap-3">
              <Icon size={18} className="shrink-0 mt-0.5 text-blue-600" />
              <div>
                <p className="font-semibold text-sm text-gray-900 mb-0.5">{title}</p>
                <p className="text-xs text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>Bate papo com webcam gratuito: como começar</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Faça seu cadastro express e adicione uma foto de perfil.</li>
          <li>Monte seu álbum — quanto mais visual, melhor seu engajamento no <strong>bate papo web cam gratuito</strong>.</li>
          <li>Entre na sala e explore perfis. Quando rolar conexão, abra o privado para trocar fotos diretamente.</li>
        </ol>

        <h2>Por que evitar bate papo web cam totalmente aberto</h2>
        <p>
          A maior parte dos sites antigos de <strong>bate papo video gratis</strong> abandonou o modelo de webcam aberta
          justamente pelos problemas de moderação. Nossa proposta de <strong>bate papo com webcam gratuito</strong>
          é mais segura, brasileira e respeitosa — sem abrir mão da experiência visual.
        </p>

        <div className="mt-8 not-prose">
          <Link
            to="/saladebatepapo"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Entrar e Ver Perfis
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
          <li><Link to="/bate-papo-amizade-namoro" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Bate-Papo para Amizade e Namoro</Link></li>
        </ul>
      </LegalLayout>
    </>
  );
}
