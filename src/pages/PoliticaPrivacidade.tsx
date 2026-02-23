import LegalLayout from "@/components/LegalLayout";

export default function PoliticaPrivacidade() {
  return (
    <LegalLayout title="Política de Privacidade">
      <p><strong>Última atualização:</strong> Janeiro de 2026</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Informações que coletamos</h2>
      <p>Ao utilizar o WoomChat, podemos coletar as seguintes informações pessoais:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Nome completo, idade, gênero e cidade;</li>
        <li>Endereço de e-mail e senha (criptografada);</li>
        <li>Preferências de relacionamento e interesse;</li>
        <li>Mensagens trocadas na plataforma;</li>
        <li>Dados de navegação, como endereço IP e tipo de navegador.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Como utilizamos suas informações</h2>
      <p>Suas informações são utilizadas para:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Criar e gerenciar sua conta;</li>
        <li>Conectar você com outros usuários compatíveis;</li>
        <li>Melhorar a experiência do usuário na plataforma;</li>
        <li>Enviar comunicações relacionadas ao serviço;</li>
        <li>Garantir a segurança da plataforma e prevenir fraudes.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Compartilhamento de dados</h2>
      <p>O WoomChat não vende, aluga ou compartilha suas informações pessoais com terceiros para fins comerciais. Podemos compartilhar dados apenas:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Quando exigido por lei ou ordem judicial;</li>
        <li>Para proteger a segurança dos nossos usuários;</li>
        <li>Com provedores de serviços essenciais (hospedagem, e-mail), sob acordos de confidencialidade.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Segurança dos dados</h2>
      <p>Utilizamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo criptografia de dados, firewalls e controles de acesso rigorosos.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Seus direitos</h2>
      <p>Você pode, a qualquer momento:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Acessar, corrigir ou excluir suas informações pessoais;</li>
        <li>Solicitar a portabilidade dos seus dados;</li>
        <li>Revogar o consentimento para o uso dos seus dados;</li>
        <li>Encerrar sua conta.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Contato</h2>
      <p>Para dúvidas sobre esta política, entre em contato conosco através do e-mail: <strong>contato@woomchat.com</strong></p>
    </LegalLayout>
  );
}
