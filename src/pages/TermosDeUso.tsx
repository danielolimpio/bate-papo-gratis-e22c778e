import LegalLayout from "@/components/LegalLayout";

export default function TermosDeUso() {
  return (
    <LegalLayout title="Termos de Uso">
      <p><strong>Última atualização:</strong> Janeiro de 2026</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Aceitação dos Termos</h2>
      <p>Ao acessar e utilizar o WoomChat, você concorda com estes Termos de Uso. Se você não concorda com algum destes termos, não utilize a plataforma.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. Elegibilidade</h2>
      <p>Para utilizar o WoomChat, você deve:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Ter pelo menos 18 anos de idade;</li>
        <li>Fornecer informações verdadeiras e precisas no cadastro;</li>
        <li>Não possuir condenações por crimes sexuais ou violência.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Uso da Plataforma</h2>
      <p>O WoomChat é uma plataforma de bate-papo e relacionamentos. Ao utilizá-la, você concorda em:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Tratar outros usuários com respeito e cordialidade;</li>
        <li>Não enviar conteúdo ofensivo, ameaçador, difamatório ou ilegal;</li>
        <li>Não utilizar a plataforma para fins comerciais ou publicidade;</li>
        <li>Não criar perfis falsos ou se passar por outra pessoa;</li>
        <li>Não compartilhar informações pessoais de terceiros sem consentimento.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Conta do Usuário</h2>
      <p>Você é responsável por manter a confidencialidade da sua conta e senha. O WoomChat não se responsabiliza por acessos não autorizados decorrentes da falta de cuidado com suas credenciais.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Conteúdo do Usuário</h2>
      <p>Você é o único responsável pelo conteúdo que publica na plataforma. O WoomChat reserva-se o direito de remover qualquer conteúdo que viole estes termos, sem aviso prévio.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Suspensão e Encerramento</h2>
      <p>O WoomChat pode suspender ou encerrar sua conta a qualquer momento, caso haja violação destes termos, sem direito a reembolso ou indenização.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">7. Isenção de Responsabilidade</h2>
      <p>O WoomChat não garante a veracidade das informações fornecidas pelos usuários e não se responsabiliza por danos decorrentes de interações entre membros da plataforma.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">8. Alterações nos Termos</h2>
      <p>O WoomChat pode alterar estes termos a qualquer momento. As alterações serão comunicadas por e-mail ou aviso na plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.</p>
    </LegalLayout>
  );
}
