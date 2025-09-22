// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-blue-200/30 bg-gradient-to-r from-blue-50/95 via-blue-100/95 to-blue-50/95 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-2">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 text-sm">
            <span className="text-blue-700 mr-4">Desenvolvido por</span>
            <div className="flex items-center space-x-2">
              <img
                src="/xref-logo.png"
                alt="XRef Logo"
                className="w-4 h-4"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <a
                href="https://xref.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-900 hover:text-blue-700 transition-colors cursor-pointer"
              >
                Xref Solutions Partners
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
