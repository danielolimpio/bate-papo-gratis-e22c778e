import LegalLayout from "@/components/LegalLayout";
import { FileText, CheckCircle, UserCheck, MessageSquare, Key, Trash2, AlertTriangle, RefreshCw } from "lucide-react";

export default function TermosDeUso() {
  return (
    <LegalLayout title="Termos de Uso">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
        <FileText size={13} />
        Última atualização: Janeiro de 2026
      </div>

      <h2><CheckCircle size={18} className="text-blue-600 shrink-0" /> 1. Aceitação dos Termos</h2>
      <p>Ao acessar e utilizar o Bate-Papo Grátis, você concorda com estes Termos de Uso. Se você não concorda com algum destes termos, não utilize a plataforma.</p>

      <h2><UserCheck size={18} className="text-blue-600 shrink-0" /> 2. Elegibilidade</h2>
      <p>Para utilizar o Bate-Papo Grátis, você deve:</p>
      <div className="bg-gray-50 rounded-xl p-5 mt-3 border border-gray-100">
        <ul className="list-disc pl-5 space-y-1.5 text-sm">
          <li>Ter pelo menos <strong>18 anos</strong> de idade;</li>
          <li>Fornecer informações verdadeiras e precisas no cadastro;</li>
          <li>Não possuir condenações por crimes sexuais ou violência.</li>
        </ul>
      </div>

      <h2><MessageSquare size={18} className="text-blue-600 shrink-0" /> 3. Uso da Plataforma</h2>
      <p>O Bate-Papo Grátis é uma plataforma de bate-papo e relacionamentos. Ao utilizá-la, você concorda em:</p>
      <div className="space-y-2 mt-3">
        {[
          "Tratar outros usuários com respeito e cordialidade",
          "Não enviar conteúdo ofensivo, ameaçador, difamatório ou ilegal",
          "Não utilizar a plataforma para fins comerciais ou publicidade",
          "Não criar perfis falsos ou se passar por outra pessoa",
          "Não compartilhar informações pessoais de terceiros sem consentimento",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
            <CheckCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>

      <h2><Key size={18} className="text-blue-600 shrink-0" /> 4. Conta do Usuário</h2>
      <div className="bg-amber-50 rounded-xl p-5 mt-3 border border-amber-100">
        <p className="text-sm text-amber-800">Você é responsável por manter a <strong>confidencialidade</strong> da sua conta e senha. O Bate-Papo Grátis não se responsabiliza por acessos não autorizados decorrentes da falta de cuidado com suas credenciais.</p>
      </div>

      <h2><Trash2 size={18} className="text-blue-600 shrink-0" /> 5. Conteúdo do Usuário</h2>
      <p>Você é o único responsável pelo conteúdo que publica na plataforma. O Bate-Papo Grátis reserva-se o direito de remover qualquer conteúdo que viole estes termos, sem aviso prévio.</p>

      <h2><AlertTriangle size={18} className="text-blue-600 shrink-0" /> 6. Suspensão e Encerramento</h2>
      <div className="bg-red-50 rounded-xl p-5 mt-3 border border-red-100">
        <p className="text-sm text-red-800">O Bate-Papo Grátis pode <strong>suspender ou encerrar</strong> sua conta a qualquer momento, caso haja violação destes termos, sem direito a reembolso ou indenização.</p>
      </div>

      <h2><AlertTriangle size={18} className="text-blue-600 shrink-0" /> 7. Isenção de Responsabilidade</h2>
      <p>O Bate-Papo Grátis não garante a veracidade das informações fornecidas pelos usuários e não se responsabiliza por danos decorrentes de interações entre membros da plataforma.</p>

      <h2><RefreshCw size={18} className="text-blue-600 shrink-0" /> 8. Alterações nos Termos</h2>
      <p>O Bate-Papo Grátis pode alterar estes termos a qualquer momento. As alterações serão comunicadas por e-mail ou aviso na plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.</p>
    </LegalLayout>
  );
}
