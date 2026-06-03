import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";
import { CheckCircle, Lock, Zap, Users, MessageCircle, Shield } from "lucide-react";

export default function BatePapoSemCadastro() {
  const faq = [
    {
      q: "O bate papo é realmente gratis sem cadastro?",
      a: "Sim. O Bate-Papo Grátis é 100% gratuito. Para entrar na sala de bate papo basta um cadastro rápido e opcional só para garantir a segurança da comunidade — sem pagar nada, sem assinatura e sem cobranças escondidas."
    },
    {
      q: "Preciso baixar algum aplicativo para usar o chat sem cadastro?",
      a: "Não. Nosso bate papo online sem cadastro funciona direto no navegador, no celular, tablet ou computador. Basta abrir, escolher um apelido e começar a conversar."
    },
    {
      q: "Por que oferecer cadastro se a proposta é bate papo sem login?",
      a: "Mantemos um cadastro mínimo e gratuito apenas para reduzir spam, perfis falsos e proteger usuários reais. Em segundos você está dentro do chat — é praticamente um bate papo sem registrar."
    },
    {
      q: "É seguro usar uma sala de bate papo sem cadastro?",
      a: "Sim. Investimos em moderação ativa, denúncias rápidas e regras claras de convivência. Veja nossa página de Namoro Seguro para dicas de segurança."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Bate-Papo Sem Cadastro — Chat Grátis e Online Sem Registro</title>
        <meta name="description" content="Bate papo sem cadastro grátis e online. Entre na sala de bate papo sem login, sem conta e sem registrar. Chat gratuito 24h para conversar agora." />
        <link rel="canonical" href="https://bate-papo-gratis.lovable.app/bate-papo-sem-cadastro" />
        <meta property="og:title" content="Bate-Papo Sem Cadastro — Chat Grátis Online" />
        <meta property="og:description" content="Sala de bate papo sem cadastro, grátis e ao vivo. Comece a conversar em segundos." />
        <meta property="og:url" content="https://bate-papo-gratis.lovable.app/bate-papo-sem-cadastro" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(f => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a }
          }))
        })}</script>
      </Helmet>

      <LegalLayout title="Bate-Papo Sem Cadastro">
        <p className="lead text-gray-600">
          O <strong>bate papo sem cadastro</strong> é a forma mais rápida e simples de conhecer pessoas novas online.
          No <strong>Bate-Papo Grátis</strong>, oferecemos um chat online sem cadastro complicado: você cria seu apelido,
          entra na sala e começa a conversar em segundos. <strong>Bate papo gratis sem cadastro</strong>, sem pagar nada
          e sem precisar instalar nada.
        </p>

        <h2><Zap size={18} className="text-blue-600 shrink-0" /> Por que escolher um chat sem cadastro?</h2>
        <p>
          Procurar por <strong>bate papo online sem cadastro</strong> mostra que você quer praticidade.
          Ninguém merece preencher formulários enormes só para mandar um "oi". Por isso, criamos um
          <strong> chat sem cadastro</strong> que respeita seu tempo: poucos cliques e você já está dentro.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 not-prose">
          {[
            { icon: Zap, title: "Acesso instantâneo", desc: "Bate papo sem fazer cadastro longo. Entre em segundos." },
            { icon: Lock, title: "Privacidade primeiro", desc: "Bate papo sem login complicado, sem expor seus dados." },
            { icon: Users, title: "Pessoas reais", desc: "Sala de bate papo sem cadastro, com moderação ativa." },
            { icon: MessageCircle, title: "Conversa ao vivo", desc: "Bate papo ao vivo sem cadastro, mensagens em tempo real." },
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

        <h2><Shield size={18} className="text-blue-600 shrink-0" /> Bate papo gratuito sem cadastro: como funciona</h2>
        <p>
          Nosso <strong>bate papo gratuito sem cadastro</strong> funciona assim:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Você acessa a sala — é um <strong>bate papo sem registo</strong> burocrático.</li>
          <li>Cria um apelido livre. Pronto, é um <strong>bate papo sem conta</strong> formal vinculada a você.</li>
          <li>Começa a conversar com pessoas do Brasil inteiro, em uma <strong>conversa online sem cadastro</strong> demorado.</li>
        </ol>

        <h2><CheckCircle size={18} className="text-blue-600 shrink-0" /> Quem usa nossos chats online sem cadastro?</h2>
        <p>
          Recebemos diariamente pessoas que pesquisam por <strong>chats online sem cadastro</strong>,
          <strong> chats gratis sem cadastro</strong> e <strong>salas de chat sem cadastro</strong>.
          São pessoas buscando amizade, paquera, conversas sobre interesses comuns e companhia para o dia a dia.
        </p>
        <p>
          Diferente de muitos sites de <strong>bate papo livre sem cadastro</strong>, oferecemos uma comunidade brasileira
          ativa, com perfis verificáveis e um ambiente respeitoso — sem deixar de ser um
          <strong> bate papo sem se cadastrar</strong> em listas pagas, sem assinaturas e sem pegadinhas.
        </p>

        <div className="mt-8 not-prose">
          <Link
            to="/saladebatepapo"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Entrar no Bate-Papo Agora
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
          <li><Link to="/sala-de-bate-papo" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Sala de Bate-Papo Grátis</Link></li>
          <li><Link to="/chat-gratis" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Chat Grátis Online</Link></li>
          <li><Link to="/bate-papo-webcam" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Bate-Papo com Webcam</Link></li>
          <li><Link to="/bate-papo-amizade-namoro" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Bate-Papo para Amizade e Namoro</Link></li>
        </ul>
      </LegalLayout>
    </>
  );
}
