import LegalLayout from "@/components/LegalLayout";

export default function NamoroSeguro() {
  return (
    <LegalLayout title="Namoro Seguro">
      <p className="text-lg leading-relaxed mb-6">
        Sua segurança é nossa prioridade. No WoomChat, trabalhamos para que você tenha a melhor experiência ao conhecer novas pessoas. 
        Confira nossas dicas e políticas para um namoro online seguro.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Dicas de Segurança</h2>
      <ol className="list-decimal pl-6 space-y-2 mt-2">
        <li>Nunca envie dinheiro para outro membro.</li>
        <li>Exponha claramente suas expectativas para evitar mal-entendidos.</li>
        <li>Faça videochamadas com seu parceiro de vez em quando.</li>
        <li>Não compartilhe sua senha, acesso à sua conta ou qualquer documento de identidade oficial com ninguém.</li>
      </ol>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-6 mb-6 rounded-r-lg">
        <p className="font-semibold text-amber-800">NOTA! Recomendamos enfaticamente que nossos membros sigam estas diretrizes:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2 text-amber-900">
          <li>Nunca inclua seu sobrenome, endereço de e-mail, endereço residencial, número de telefone, local de trabalho ou qualquer outra informação de identificação em seu perfil na Internet ou em suas primeiras mensagens. Pare de se comunicar com qualquer pessoa que o pressione para fornecer informações pessoais ou financeiras.</li>
          <li>Se optar por ter um encontro presencial com outro membro, avise sempre alguém da sua família ou um amigo para onde vai e quando vai voltar. Nunca aceite ser buscado em casa. Providencie sempre o seu próprio transporte de ida e volta para o encontro e encontre-se num local público com muitas pessoas por perto.</li>
        </ul>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-3">Golpes e Reembolsos</h2>
      <ol className="list-decimal pl-6 space-y-2 mt-2">
        <li>Um membro se identifica incorretamente (ou seja, usa o perfil de outro membro sem permissão para se comunicar com você). Tomaremos as devidas providências contra esse membro.</li>
        <li>Um membro solicitou dinheiro ou presentes caros. Baniremos esse membro permanentemente.</li>
        <li>Um membro apresentou informações falsas e deliberadas em seu perfil, incluindo idade, filhos, sexo e estado civil. Baniremos esse membro permanentemente.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-3">Não é Golpe</h2>
      <ol className="list-decimal pl-6 space-y-2 mt-2">
        <li>Ocorreram alguns erros na tradução de uma carta.</li>
        <li>Se um membro não responder a todas as perguntas em um e-mail.</li>
        <li>Se, em qualquer nível da sua comunicação, o membro decidir parar de desenvolver o relacionamento.</li>
        <li>Se um membro tiver fotos de parentes, amigos, ex-parceiros e outras informações pessoais publicadas em qualquer rede social.</li>
        <li>Se um membro usa anéis nos dedos, isso não significa que a pessoa seja casada, independentemente do dedo em que o anel esteja.</li>
        <li>Se um membro usar um apelido.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-3">Exploração e Tráfico de Seres Humanos</h2>
      <p>Mantemos uma política de tolerância zero contra qualquer forma de exploração ou tráfico de seres humanos. Isso inclui:</p>
      <ol className="list-decimal pl-6 space-y-2 mt-2">
        <li>Conteúdo que explore indivíduos de forma sexual ou violenta, particularmente menores de 18 anos.</li>
        <li>Conteúdo que incite, promova ou facilite o tráfico de seres humanos, incluindo exploração sexual, trabalho forçado ou escravidão moderna.</li>
        <li>Conteúdo que utilize a plataforma para coagir ou solicitar atividades ilegais, como prostituição ou serviços de acompanhantes.</li>
      </ol>
      <p className="mt-3">Colaboramos ativamente com as autoridades policiais e organizações de combate ao tráfico de pessoas para investigar e solucionar essas violações. Incentivamos os usuários a denunciarem imediatamente qualquer comportamento ou conteúdo suspeito.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Compromissos Adicionais de Segurança</h2>
      <p>Para criar um ambiente seguro, também implementamos as seguintes medidas:</p>
      <ol className="list-decimal pl-6 space-y-2 mt-2">
        <li><strong>Verificação e triagem:</strong> Os usuários são incentivados a verificar suas contas, e nossa equipe pode realizar verificações para reduzir atividades fraudulentas.</li>
        <li><strong>Ferramentas de denúncia:</strong> Recursos de denúncia fáceis de usar estão disponíveis para que os usuários sinalizem conteúdo inadequado ou prejudicial, que é analisado prontamente por nossa equipe de moderação.</li>
        <li><strong>Proteção da Privacidade:</strong> Priorizamos a privacidade do usuário, restringindo a coleta ou o compartilhamento não autorizados de informações pessoais.</li>
      </ol>

      <h2 className="text-xl font-semibold mt-8 mb-3">Responsabilidades do Usuário</h2>
      <ol className="list-decimal pl-6 space-y-2 mt-2">
        <li>Evite compartilhar informações sensíveis, como endereços residenciais, dados financeiros ou documentos de identificação pessoal.</li>
        <li>Evite encontrar-se pessoalmente com alguém sem as devidas precauções, como informar um amigo de confiança, encontrar-se em um local público e garantir um transporte seguro.</li>
      </ol>

      <p className="mt-6">Nossa plataforma está comprometida em promover uma comunidade segura, respeitosa e confiável. Violações dessas políticas resultarão na suspensão imediata da conta e em possíveis medidas legais.</p>

      <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
        <p className="text-gray-600">Atenciosamente,</p>
        <p className="font-semibold text-gray-800">Equipe de Suporte do WoomChat</p>
      </div>
    </LegalLayout>
  );
}
