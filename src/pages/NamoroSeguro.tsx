import { Helmet } from "react-helmet-async";
import LegalLayout from "@/components/LegalLayout";
import { Shield, AlertTriangle, Ban, Eye, UserCheck, Lock, Heart, CheckCircle, XCircle } from "lucide-react";

export default function NamoroSeguro() {
  return (
    <>
      <Helmet>
        <title>Namoro Seguro — Bate-Papo de Namoro, Amizade e Paquera Grátis</title>
        <meta name="description" content="Bate papo de namoro e amizade com segurança. Bate papo paquera gratis, chat para amizade e site de relacionamento gratuito com dicas de proteção." />
        <link rel="canonical" href="https://batepapogratis.com/namoro-seguro" />
        <meta property="og:title" content="Namoro Seguro — Bate-Papo de Namoro, Amizade e Paquera Grátis" />
        <meta property="og:description" content="Bate papo de namoro e amizade com segurança. Bate papo paquera gratis, chat para amizade e site de relacionamento gratuito com dicas de proteção." />
        <meta property="og:url" content="https://batepapogratis.com/namoro-seguro" />
        <meta property="og:type" content="website" />
      </Helmet>
      <LegalLayout title="Namoro Seguro">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Shield size={13} />
          Sua segurança é nossa prioridade
        </div>
        <p className="text-gray-600">
          O <strong>bate papo de namoro</strong> e o <strong>bate papo para amizade</strong> só fazem sentido em um ambiente seguro.
          No Bate-Papo Grátis, construímos um <strong>site de relacionamento gratuito</strong> com moderação ativa, dicas
          de proteção e ferramentas que valorizam <strong>bate papo paquera gratis</strong> respeitoso. Aqui estão nossas
          diretrizes para você curtir o <strong>chat para amizade</strong>, paquera e relacionamento com tranquilidade.
        </p>
      </div>

      <h2><Shield size={18} className="text-blue-600 shrink-0" /> Dicas de Segurança</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {[
          { icon: Ban, text: "Nunca envie dinheiro para outro membro", color: "border-red-200 bg-red-50" },
          { icon: Eye, text: "Exponha claramente suas expectativas para evitar mal-entendidos", color: "border-blue-200 bg-blue-50" },
          { icon: UserCheck, text: "Faça videochamadas com seu parceiro de vez em quando", color: "border-purple-200 bg-purple-50" },
          { icon: Lock, text: "Não compartilhe sua senha ou documentos de identidade", color: "border-amber-200 bg-amber-50" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`rounded-xl p-4 border ${item.color} flex items-start gap-3`}>
              <Icon size={18} className="shrink-0 mt-0.5 opacity-70" />
              <span className="text-sm font-medium text-gray-800">{item.text}</span>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-6">
        <div className="flex items-center gap-2 font-bold text-amber-800 text-sm mb-3">
          <AlertTriangle size={16} />
          NOTA IMPORTANTE
        </div>
        <ul className="space-y-3 text-sm text-amber-900">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            Nunca inclua seu sobrenome, endereço de e-mail, endereço residencial, número de telefone, local de trabalho ou qualquer outra informação de identificação em seu perfil ou nas primeiras mensagens.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
            Se optar por um encontro presencial, avise alguém da sua família. Nunca aceite ser buscado em casa. Providencie seu próprio transporte e encontre-se em local público.
          </li>
        </ul>
      </div>

      <h2><AlertTriangle size={18} className="text-blue-600 shrink-0" /> Golpes e Reembolsos</h2>
      <div className="space-y-2 mt-3">
        {[
          "Um membro se identifica incorretamente (usa perfil de outro sem permissão). Tomaremos providências.",
          "Um membro solicitou dinheiro ou presentes caros. Banimento permanente.",
          "Um membro apresentou informações falsas deliberadas (idade, filhos, sexo, estado civil). Banimento permanente.",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg p-3">
            <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      <h2><CheckCircle size={18} className="text-blue-600 shrink-0" /> Não é Golpe</h2>
      <div className="space-y-2 mt-3">
        {[
          "Ocorreram alguns erros na tradução de uma carta.",
          "Se um membro não responder a todas as perguntas em um e-mail.",
          "Se o membro decidir parar de desenvolver o relacionamento.",
          "Se um membro tiver fotos de parentes/amigos publicadas em redes sociais.",
          "Se um membro usa anéis nos dedos — não significa que é casado(a).",
          "Se um membro usar um apelido.",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      <h2><Ban size={18} className="text-blue-600 shrink-0" /> Exploração e Tráfico de Seres Humanos</h2>
      <div className="bg-red-50 rounded-xl p-5 mt-3 border border-red-200">
        <p className="text-sm text-red-800 font-semibold mb-3">Mantemos uma política de tolerância zero contra qualquer forma de exploração ou tráfico.</p>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-red-900">
          <li>Conteúdo que explore indivíduos de forma sexual ou violenta, particularmente menores de 18 anos.</li>
          <li>Conteúdo que incite, promova ou facilite o tráfico de seres humanos.</li>
          <li>Conteúdo que utilize a plataforma para coagir ou solicitar atividades ilegais.</li>
        </ol>
        <p className="text-sm text-red-800 mt-3">Colaboramos ativamente com as autoridades policiais para investigar e solucionar essas violações.</p>
      </div>

      <h2><Shield size={18} className="text-blue-600 shrink-0" /> Compromissos Adicionais de Segurança</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        {[
          { icon: UserCheck, title: "Verificação", desc: "Incentivamos verificação de contas e realizamos verificações para reduzir fraudes" },
          { icon: AlertTriangle, title: "Denúncia", desc: "Recursos de denúncia fáceis de usar, analisados prontamente pela moderação" },
          { icon: Lock, title: "Privacidade", desc: "Restringimos coleta ou compartilhamento não autorizado de informações pessoais" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-2">
                <Icon size={16} />
              </div>
              <p className="font-semibold text-xs text-gray-900 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <h2><UserCheck size={18} className="text-blue-600 shrink-0" /> Responsabilidades do Usuário</h2>
      <div className="space-y-2 mt-3">
        <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <Shield size={16} className="text-gray-500 shrink-0 mt-0.5" />
          <span className="text-sm text-gray-700">Evite compartilhar informações sensíveis, como endereços, dados financeiros ou documentos de identificação pessoal.</span>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
          <Shield size={16} className="text-gray-500 shrink-0 mt-0.5" />
          <span className="text-sm text-gray-700">Evite encontrar-se pessoalmente sem precauções: informe um amigo, encontre-se em local público e garanta transporte seguro.</span>
        </div>
      </div>
      <div className="mt-10 bg-gradient-to-r from-blue-600 to-amber-500 rounded-2xl p-6 text-center shadow-lg">
        <Heart className="mx-auto text-white/80 mb-2" size={28} />
        <p className="text-white font-medium text-sm">Nossa plataforma está comprometida em promover uma comunidade segura, respeitosa e confiável.</p>
        <p className="text-white/80 text-xs mt-2">Atenciosamente, Equipe de Suporte do Bate-Papo Grátis</p>
      </div>
    </LegalLayout>
  </>
  );
}
