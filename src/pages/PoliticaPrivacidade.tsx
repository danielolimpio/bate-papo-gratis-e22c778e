import { Helmet } from "react-helmet-async";
import LegalLayout from "@/components/LegalLayout";
import { Shield, Eye, Share2, Lock, UserCheck, Mail } from "lucide-react";

export default function PoliticaPrivacidade() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade — Bate-Papo Grátis</title>
        <meta name="description" content="Saiba como protegemos seus dados e sua privacidade no Bate-Papo Grátis. Leia nossa política completa." />
        <link rel="canonical" href="/politica-de-privacidade" />
        <meta property="og:title" content="Política de Privacidade — Bate-Papo Grátis" />
        <meta property="og:description" content="Saiba como protegemos seus dados e sua privacidade no Bate-Papo Grátis. Leia nossa política completa." />
        <meta property="og:url" content="https://bate-papo-gratis.lovable.app/politica-de-privacidade" />
        <meta property="og:type" content="website" />
      </Helmet>
      <LegalLayout title="Política de Privacidade">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
        <Shield size={13} />
        Última atualização: Janeiro de 2026
      </div>

      <h2><Eye size={18} className="text-blue-600 shrink-0" /> 1. Informações que coletamos</h2>
      <p>Ao utilizar o Bate-Papo Grátis, podemos coletar as seguintes informações pessoais:</p>
      <div className="bg-gray-50 rounded-xl p-5 mt-3 border border-gray-100">
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Nome completo, idade, gênero e cidade;</li>
          <li>Endereço de e-mail e senha (criptografada);</li>
          <li>Preferências de relacionamento e interesse;</li>
          <li>Mensagens trocadas na plataforma;</li>
          <li>Dados de navegação, como endereço IP e tipo de navegador.</li>
        </ul>
      </div>

      <h2><UserCheck size={18} className="text-blue-600 shrink-0" /> 2. Como utilizamos suas informações</h2>
      <p>Suas informações são utilizadas para:</p>
      <div className="bg-gray-50 rounded-xl p-5 mt-3 border border-gray-100">
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Criar e gerenciar sua conta;</li>
          <li>Conectar você com outros usuários compatíveis;</li>
          <li>Melhorar a experiência do usuário na plataforma;</li>
          <li>Enviar comunicações relacionadas ao serviço;</li>
          <li>Garantir a segurança da plataforma e prevenir fraudes.</li>
        </ul>
      </div>

      <h2><Share2 size={18} className="text-blue-600 shrink-0" /> 3. Compartilhamento de dados</h2>
      <p>O Bate-Papo Grátis <strong>não vende, aluga ou compartilha</strong> suas informações pessoais com terceiros para fins comerciais. Podemos compartilhar dados apenas:</p>
      <div className="bg-gray-50 rounded-xl p-5 mt-3 border border-gray-100">
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Quando exigido por lei ou ordem judicial;</li>
          <li>Para proteger a segurança dos nossos usuários;</li>
          <li>Com provedores de serviços essenciais (hospedagem, e-mail), sob acordos de confidencialidade.</li>
        </ul>
      </div>

      <h2><Lock size={18} className="text-blue-600 shrink-0" /> 4. Segurança dos dados</h2>
      <div className="bg-blue-50 rounded-xl p-5 mt-3 border border-blue-100">
        <p className="text-sm text-blue-800">Utilizamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo <strong>criptografia de dados</strong>, firewalls e controles de acesso rigorosos.</p>
      </div>

      <h2><UserCheck size={18} className="text-blue-600 shrink-0" /> 5. Seus direitos</h2>
      <p>Você pode, a qualquer momento:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {["Acessar, corrigir ou excluir suas informações pessoais", "Solicitar a portabilidade dos seus dados", "Revogar o consentimento para o uso dos seus dados", "Encerrar sua conta"].map((item, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 flex items-start gap-2 shadow-sm">
            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      <h2><Mail size={18} className="text-blue-600 shrink-0" /> 6. Contato</h2>
      <div className="bg-gray-50 rounded-xl p-5 mt-3 border border-gray-100 text-center">
        <p className="text-sm text-gray-600">Para dúvidas sobre esta política, entre em contato:</p>
        <p className="font-semibold text-blue-600 mt-1">contato@batepapogratis.com</p>
      </div>
    </LegalLayout>
  </>
  );
}
