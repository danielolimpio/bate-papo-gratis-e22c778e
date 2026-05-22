import { Helmet } from "react-helmet-async";
import LegalLayout from "@/components/LegalLayout";
import { Heart, Target, Star, Sparkles, Users } from "lucide-react";

export default function QuemSomos() {
  return (
    <>
      <Helmet>
        <title>Quem Somos — Bate-Papo Grátis</title>
        <meta name="description" content="Conheça a história, missão e valores do Bate-Papo Grátis. Um espaço para conexões genuínas." />
        <link rel="canonical" href="/quem-somos" />
      </Helmet>
      <LegalLayout title="Quem Somos">
      <div className="text-center mb-8">
        <p className="text-lg leading-relaxed text-gray-600">
          O <strong className="text-gray-900">Bate-Papo Grátis</strong> nasceu da vontade de criar um espaço online onde pessoas possam se conectar de forma genuína, segura e divertida.
          Acreditamos que todo mundo merece encontrar alguém especial.
        </p>
      </div>

      <h2><Target size={18} className="text-blue-600 shrink-0" /> Nossa Missão</h2>
      <div className="bg-blue-50 rounded-xl p-5 mt-3 border border-blue-100 text-center">
        <p className="text-sm text-blue-800 font-medium">Conectar corações por meio de conversas autênticas. O Bate-Papo Grátis é mais do que um bate-papo — é um ambiente onde <strong>relacionamentos reais</strong> começam.</p>
      </div>

      <h2><Star size={18} className="text-blue-600 shrink-0" /> Nossos Valores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {[
          { emoji: "🤝", title: "Respeito", desc: "Todos os membros merecem ser tratados com dignidade e respeito" },
          { emoji: "🔒", title: "Segurança", desc: "Investimos constantemente em tecnologia para manter a plataforma segura" },
          { emoji: "✨", title: "Autenticidade", desc: "Incentivamos perfis reais e conversas verdadeiras" },
          { emoji: "🌍", title: "Inclusão", desc: "O Bate-Papo Grátis é para todos, independente de orientação, idade ou localização" },
          { emoji: "💙", title: "Gratuidade", desc: "Acreditamos que o amor não deve ter preço. Plataforma 100% gratuita" },
        ].map((item, i) => (
          <div key={i} className={`bg-white rounded-xl p-4 border border-gray-200 shadow-sm ${i === 4 ? "sm:col-span-2" : ""}`}>
            <div className="flex items-center gap-2 font-semibold text-sm text-gray-900 mb-1">
              <span className="text-lg">{item.emoji}</span>
              {item.title}
            </div>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2><Sparkles size={18} className="text-blue-600 shrink-0" /> Como Funciona</h2>
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        {[
          { step: "1", title: "Crie sua conta", desc: "Cadastro rápido e gratuito" },
          { step: "2", title: "Preencha seu perfil", desc: "Mostre quem você é" },
          { step: "3", title: "Comece a conversar", desc: "Conecte-se com pessoas incríveis" },
        ].map((item) => (
          <div key={item.step} className="flex-1 bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold mx-auto mb-2">{item.step}</div>
            <p className="font-semibold text-sm text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      <h2><Users size={18} className="text-blue-600 shrink-0" /> Nossa Equipe</h2>
      <p>Somos uma equipe apaixonada por tecnologia e relacionamentos humanos. Trabalhamos todos os dias para criar a melhor experiência de conexão online do Brasil.</p>

      <div className="mt-10 bg-gradient-to-r from-blue-600 to-amber-500 rounded-2xl p-6 text-center shadow-lg">
        <Heart className="mx-auto text-white/80 mb-2" size={28} />
        <p className="text-white font-semibold text-lg">Bate-Papo Grátis — Onde corações se encontram.</p>
      </div>
    </LegalLayout>
  </>
  );
}
