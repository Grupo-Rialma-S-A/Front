export default function PlanilhaGado() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Planilha de Gado
          </h1>
          <p className="text-blue-700">Controle e monitoramento do rebanho</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg shadow-lg">
          <div className="bg-blue-100/80 backdrop-blur-sm border-b-2 border-blue-200 p-6 rounded-t-lg text-center">
            <h2 className="text-2xl font-bold text-blue-800">
              Funcionalidade em Desenvolvimento
            </h2>
          </div>

          <div className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-8xl mb-6">🚧</div>
              <h3 className="text-4xl font-bold text-blue-700 mb-4">
                Em breve...
              </h3>
              <p className="text-lg text-gray-600 max-w-md mb-6">
                Esta funcionalidade está em desenvolvimento e estará disponível
                em breve para ajudar no controle e monitoramento do seu rebanho.
              </p>
              <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Recursos que estarão disponíveis:</strong>
                </p>
                <ul className="text-sm text-blue-600 mt-2 space-y-1">
                  <li>• Controle de identificação dos animais</li>
                  <li>• Monitoramento de peso e idade</li>
                  <li>• Gestão de status do rebanho</li>
                  <li>• Relatórios detalhados</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
