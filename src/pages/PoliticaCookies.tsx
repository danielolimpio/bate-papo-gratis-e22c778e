import { Helmet } from "react-helmet-async";
import LegalLayout from "@/components/LegalLayout";
import { Cookie, Settings, Mail, Zap, BarChart3, Palette } from "lucide-react";

export default function PoliticaCookies() {
  return (
    <>
      <Helmet>
        <title>Política de Cookies — Bate-Papo Grátis</title>
        <meta name="description" content="Entenda como utilizamos cookies para melhorar sua experiência no Bate-Papo Grátis." />
        <link rel="canonical" href="/politica-de-cookies" />
        <meta property="og:title" content="Política de Cookies — Bate-Papo Grátis" />
        <meta property="og:description" content="Entenda como utilizamos cookies para melhorar sua experiência no Bate-Papo Grátis." />
        <meta property="og:url" content="https://batepapogratis.com/politica-de-cookies" />
        <meta property="og:type" content="website" />
      </Helmet>
      <LegalLayout title="Política de Cookies">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
        <Cookie size={13} />
        Última atualização: Janeiro de 2026
      </div>

      <h2><Cookie size={18} className="text-blue-600 shrink-0" /> O que são cookies?</h2>
      <p>Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site. Eles permitem que o site se lembre de suas ações e preferências ao longo do tempo.</p>

      <h2><Settings size={18} className="text-blue-600 shrink-0" /> Como utilizamos cookies</h2>
      <p>O Bate-Papo Grátis utiliza cookies para:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {[
          { icon: Zap, title: "Essenciais", desc: "Necessários para o funcionamento da plataforma, como manter sua sessão ativa", color: "bg-blue-50 border-blue-100 text-blue-700" },
          { icon: BarChart3, title: "Desempenho", desc: "Nos ajudam a entender como os usuários interagem com a plataforma", color: "bg-purple-50 border-purple-100 text-purple-700" },
          { icon: Palette, title: "Funcionalidade", desc: "Permitem lembrar suas preferências, como tema claro/escuro", color: "bg-amber-50 border-amber-100 text-amber-700" },
          { icon: BarChart3, title: "Análise", desc: "Dados estatísticos anônimos sobre o uso da plataforma", color: "bg-blue-50 border-blue-100 text-blue-700" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`rounded-xl p-4 border ${item.color}`}>
              <div className="flex items-center gap-2 font-semibold text-sm mb-1.5">
                <Icon size={15} />
                {item.title}
              </div>
              <p className="text-xs opacity-80">{item.desc}</p>
            </div>
          );
        })}
      </div>

      <h2><Settings size={18} className="text-blue-600 shrink-0" /> Gerenciar cookies</h2>
      <p>Você pode controlar e/ou excluir cookies conforme desejar. A maioria dos navegadores permite que você:</p>
      <div className="bg-gray-50 rounded-xl p-5 mt-3 border border-gray-100">
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Veja quais cookies estão armazenados e os exclua individualmente;</li>
          <li>Bloqueie cookies de terceiros;</li>
          <li>Bloqueie todos os cookies;</li>
          <li>Exclua todos os cookies ao fechar o navegador.</li>
        </ul>
      </div>
      <div className="bg-amber-50 rounded-xl p-4 mt-4 border border-amber-100">
        <p className="text-sm text-amber-800">⚠️ Note que desabilitar cookies pode afetar o funcionamento da plataforma.</p>
      </div>

      <h2><Mail size={18} className="text-blue-600 shrink-0" /> Contato</h2>
      <div className="bg-gray-50 rounded-xl p-5 mt-3 border border-gray-100 text-center">
        <p className="text-sm text-gray-600">Em caso de dúvidas sobre nossa Política de Cookies, entre em contato:</p>
        <p className="font-semibold text-blue-600 mt-1">contato@batepapogratis.com</p>
      </div>
    </LegalLayout>
  </>
  );
}
