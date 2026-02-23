import LegalLayout from "@/components/LegalLayout";

export default function QuemSomos() {
  return (
    <LegalLayout title="Quem Somos">
      <p className="text-lg leading-relaxed">
        O <strong>WoomChat</strong> nasceu da vontade de criar um espaço online onde pessoas possam se conectar de forma genuína, segura e divertida. 
        Acreditamos que todo mundo merece encontrar alguém especial, e nossa missão é facilitar esse encontro.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Nossa Missão</h2>
      <p>Conectar corações por meio de conversas autênticas. O WoomChat é mais do que um bate-papo — é um ambiente onde relacionamentos reais começam, seja uma amizade, um namoro ou o amor da sua vida.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Nossos Valores</h2>
      <ul className="list-disc pl-6 space-y-2 mt-2">
        <li><strong>Respeito:</strong> Todos os membros merecem ser tratados com dignidade e respeito;</li>
        <li><strong>Segurança:</strong> Investimos constantemente em tecnologia para manter a plataforma segura;</li>
        <li><strong>Autenticidade:</strong> Incentivamos perfis reais e conversas verdadeiras;</li>
        <li><strong>Inclusão:</strong> O WoomChat é para todos, independentemente de orientação, idade ou localização;</li>
        <li><strong>Gratuidade:</strong> Acreditamos que o amor não deve ter preço. Nossa plataforma é 100% gratuita.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">Como Funciona</h2>
      <p>É simples: crie sua conta, preencha seu perfil e comece a conversar! Nossa sala de bate-papo conecta você com pessoas que compartilham seus interesses e estão próximas de você.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Nossa Equipe</h2>
      <p>Somos uma equipe apaixonada por tecnologia e relacionamentos humanos. Trabalhamos todos os dias para criar a melhor experiência de conexão online do Brasil.</p>

      <p className="mt-8 text-center text-lg font-medium text-emerald-600">
        💚 WoomChat — Onde corações se encontram.
      </p>
    </LegalLayout>
  );
}
