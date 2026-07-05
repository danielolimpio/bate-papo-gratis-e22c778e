import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import LegalLayout from "@/components/LegalLayout";
import { Users, MessageCircle, Globe, Heart } from "lucide-react";

export default function SalaDeBatePapo() {
  const faq = [
    {
      q: "Como entrar na sala de bate papo gratis?",
      a: "Basta clicar em 'Entrar no Bate-Papo', escolher um apelido e pronto. Nossa sala de bate papo online gratis está aberta 24 horas por dia, todos os dias."
    },
    {
      q: "Existe alguma sala bate papo gratuita só para amizade?",
      a: "Sim. A sala geral é voltada para conversas leves, amizade e novas conexões. Quem busca paquera pode usar o privado entre dois usuários."
    },
    {
      q: "Posso usar a sala de bate papo sem cadastro?",
      a: "O cadastro é mínimo e gratuito, criado em segundos. Mantemos esse passo apenas para proteger a comunidade contra spam e perfis falsos."
    },
    {
      q: "Quantas pessoas ficam na sala bate papo gratis ao mesmo tempo?",
      a: "Temos centenas de usuários ativos diariamente. Sempre tem alguém online para conversar, a qualquer hora."
    },
    {
      q: "A sala de bate papo brasileira funciona ao vivo 24 horas?",
      a: "Sim. Nossa sala de bate papo online 24 horas grátis fica sempre disponível. Você encontra brasileiros ativos de madrugada, pela manhã e nos fins de semana, com mensagens em tempo real."
    },
    {
      q: "Tem sala de bate papo para conhecer gente da minha região?",
      a: "Sim. Além da sala geral, o perfil de cada usuário mostra a cidade e estado, funcionando como uma sala de bate papo regional brasileira para quem quer conversar com gente próxima."
    },
    {
      q: "Posso usar áudios e ver fotos dos perfis na sala?",
      a: "Pode. Na sala geral é possível enviar áudios de voz, e cada perfil traz fotos verificáveis — uma experiência de sala de bate papo com áudios, fotos e reações, sem custo."
    },
    {
      q: "Existe sala de bate papo para adultos brasileiros e para solteiros?",
      a: "Nossa sala de bate papo é aberta a adultos brasileiros que buscam amizade, paquera e conversa saudável. É bastante procurada por solteiros e solteiras que querem conhecer gente nova sem propaganda invasiva."
    },
    {
      q: "Existe sistema de matchs dentro da sala?",
      a: "Sim. Nossa sala de bate papo online tem sistema de matchs: quando o interesse é mútuo, a conversa entre os dois ganha destaque com o efeito Apaixonados."
    },
    {
      q: "É uma sala de bate papo com moderação?",
      a: "Sim. A sala de bate papo brasileira do Bate-Papo Grátis tem moderação ativa 24h, denúncia rápida e regras claras — mantendo o ambiente respeitoso para todos."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sala de Bate-Papo Grátis — Salas Online Para Conversar Agora</title>
        <meta name="description" content="Sala de bate papo gratis e online 24h. Entre em salas bate papo gratuita com pessoas de todo o Brasil. Sala de bate papo online gratis e segura." />
        <link rel="canonical" href="https://batepapogratis.com/sala-de-bate-papo" />
        <meta property="og:title" content="Sala de Bate-Papo Grátis — Conversas ao Vivo" />
        <meta property="og:description" content="Salas de bate papo online gratuito com gente de todo o Brasil." />
        <meta property="og:url" content="https://batepapogratis.com/sala-de-bate-papo" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
        })}</script>
      </Helmet>

      <LegalLayout title="Sala de Bate-Papo Grátis">
        <p className="lead text-gray-600">
          A <strong>sala de bate papo gratis</strong> do Bate-Papo Grátis é um espaço aberto, brasileiro e ativo 24 horas por dia.
          É uma <strong>sala bate papo gratuita</strong> de verdade — sem mensalidade, sem limites de tempo e sem assinaturas.
        </p>

        <h2><Users size={18} className="text-blue-600 shrink-0" /> Salas para todos os perfis</h2>
        <p>
          Nossa <strong>sala de bate papo online gratis</strong> reúne pessoas de todas as idades e regiões. Aqui você
          encontra desde quem busca <strong>sala bate papo grátis</strong> só para passar o tempo até quem quer construir
          amizades duradouras. Funciona em duas camadas:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Sala Geral</strong> — uma <strong>sala de papo gratis</strong> pública, ideal para puxar assunto, mandar áudios e participar de conversas coletivas.</li>
          <li><strong>Chat Privado</strong> — quando rola química, você abre um privado direto com a pessoa, com troca de imagens e links.</li>
        </ul>

        <h2><Globe size={18} className="text-blue-600 shrink-0" /> Sala de bate papo gratis online: como entrar</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Acesse a página inicial.</li>
          <li>Selecione seu gênero e faça o cadastro express.</li>
          <li>Pronto! Você está na nossa <strong>sala de bate papo gratis online</strong>.</li>
        </ol>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 not-prose">
          {[
            { icon: MessageCircle, title: "Mensagens em tempo real", desc: "Realtime de verdade — você vê quando o outro está digitando." },
            { icon: Users, title: "Comunidade brasileira", desc: "Salas de bate papo on line gratis com gente do Brasil inteiro." },
            { icon: Heart, title: "Amizade e paquera", desc: "Da sala bate papo gratis ao privado em um clique." },
            { icon: Globe, title: "100% no navegador", desc: "Salas de bate papo online gratuito, sem instalar nada." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl p-4 border border-amber-100 bg-amber-50 flex items-start gap-3">
              <Icon size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-semibold text-sm text-gray-900 mb-0.5">{title}</p>
                <p className="text-xs text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>Por que nossa sala bate papo gratis é diferente</h2>
        <p>
          A maior parte das <strong>salas de bate papo online gratuito</strong> que você encontra por aí ou está abandonada,
          ou exige assinatura para liberar recursos básicos. No Bate-Papo Grátis, nada disso. Você tem áudio na sala,
          fotos no privado, perfil completo com fotos e bio, sistema de matchs e até efeito "Apaixonados" quando o
          interesse é mútuo — tudo dentro da mesma <strong>sala bate papo gratuita</strong>.
        </p>

        <div className="mt-8 not-prose">
          <Link
            to="/saladebatepapo"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Entrar na Sala Agora
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
          <li><Link to="/chat-gratis" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Chat Grátis Online</Link></li>
          <li><Link to="/bate-papo-webcam" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Bate-Papo com Webcam</Link></li>
          <li><Link to="/bate-papo-amizade-namoro" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700 transition-colors">→ Bate-Papo para Amizade e Namoro</Link></li>
        </ul>
      </LegalLayout>
    </>
  );
}
