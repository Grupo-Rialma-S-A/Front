export default function Footer() {
  return (
    <footer className="mt-auto py-4 border-t border-green-200 bg-white/70">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
            <span>Desenvolvido por</span>
            <img
              src="/xref-logo.png"
              alt="XRef Logo"
              className="w-5 h-5"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <a
              href="https://xref.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-green-800 transition-colors cursor-pointer"
            >
              XRef
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
