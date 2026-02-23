import LegalLayout from "@/components/LegalLayout";

export default function PoliticaCookies() {
  return (
    <LegalLayout title="Política de Cookies">
      <p><strong>Última atualização:</strong> Janeiro de 2026</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">O que são cookies?</h2>
      <p>Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles permitem que o site se lembre de suas ações e preferências ao longo do tempo.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Como utilizamos cookies</h2>
      <p>O WoomChat utiliza cookies para:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento da plataforma, como manter sua sessão ativa;</li>
        <li><strong>Cookies de desempenho:</strong> Nos ajudam a entender como os usuários interagem com a plataforma para melhorar a experiência;</li>
        <li><strong>Cookies de funcionalidade:</strong> Permitem lembrar suas preferências, como tema claro/escuro;</li>
        <li><strong>Cookies de análise:</strong> Utilizados para coletar dados estatísticos anônimos sobre o uso da plataforma.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">Gerenciar cookies</h2>
      <p>Você pode controlar e/ou excluir cookies conforme desejar. A maioria dos navegadores permite que você:</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>Veja quais cookies estão armazenados e os exclua individualmente;</li>
        <li>Bloqueie cookies de terceiros;</li>
        <li>Bloqueie todos os cookies;</li>
        <li>Exclua todos os cookies ao fechar o navegador.</li>
      </ul>
      <p className="mt-3">Note que desabilitar cookies pode afetar o funcionamento da plataforma.</p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contato</h2>
      <p>Em caso de dúvidas sobre nossa Política de Cookies, entre em contato: <strong>contato@woomchat.com</strong></p>
    </LegalLayout>
  );
}
